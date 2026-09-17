/**
 * Ask Bach — Interactive Video Experience
 *
 * Modal-driven player for concert Q&A videos.
 * Supports YouTube and Vimeo. No overlays on the embed.
 * Tracks watched questions in sessionStorage for later metrics.
 *
 * @package festival-bach-understrap
 */

(function () {
	'use strict';

	if (typeof concertInteractiveData === 'undefined' || !concertInteractiveData) {
		return;
	}

	var data = concertInteractiveData;
	var captionsEnabled = !!(data && data.autoClosedCaptions);
	var allVideos = [];
	var questions = Array.isArray(data.questions) ? data.questions.slice() : [];

	allVideos.push({ id: 'idle', url: data.idleVideoUrl, label: 'Idle' });
	for (var i = 0; i < questions.length; i++) {
		allVideos.push({
			id: questions[i].id,
			url: questions[i].videoUrl,
			label: questions[i].question
		});
	}

	function detectPlatform(url) {
		if (/youtube\.com|youtu\.be/.test(url)) {
			return 'youtube';
		}
		if (/vimeo\.com/.test(url)) {
			return 'vimeo';
		}
		return null;
	}

	function getYouTubeId(url) {
		var match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
		return match ? match[1] : null;
	}

	function getVimeoId(url) {
		var match = url.match(/(?:vimeo\.com\/(?:video\/)?)(\d+)/);
		return match ? match[1] : null;
	}

	function getVideoId(url) {
		var platform = detectPlatform(url);
		if (platform === 'youtube') return getYouTubeId(url);
		if (platform === 'vimeo') return getVimeoId(url);
		return null;
	}

	var modalEl = document.getElementById('ask-bach-modal');
	var container = document.getElementById('interactive-video-container');
	var placeholder = document.getElementById('interactive-video-placeholder');
	var statusLabel = document.getElementById('interactive-video-label');
	var statusBar = modalEl ? modalEl.querySelector('.ask-bach-status-bar') : null;
	var questionsRoot = document.getElementById('interactive-questions');
	var questionButtons = questionsRoot
		? Array.prototype.slice.call(questionsRoot.querySelectorAll('.interactive-question-btn'))
		: [];
	var questionItems = questionsRoot
		? Array.prototype.slice.call(questionsRoot.querySelectorAll('.interactive-question-item'))
		: [];
	var seenToggles = questionsRoot
		? Array.prototype.slice.call(questionsRoot.querySelectorAll('.interactive-question-seen-toggle'))
		: [];

	if (!modalEl || !container || !questionsRoot) {
		return;
	}

	var state = {
		isOpen: false,
		hasStarted: false,
		currentId: null,
		isYouTubeReady: false,
		youtubePlayer: null,
		activeIframe: null,
		idleLoopTimeout: null,
		vimeoEndHandler: null,
		ytApiRequested: false,
		watchedIds: {}
	};

	var i18n = Object.assign({
		ready: 'Ready — select a question',
		idle: 'Listening — select a question',
		returning: 'Returning…',
		unsupported: 'Unsupported video platform',
		tipTitle: 'New: talk with Bach',
		tipText: 'Ask him your questions to discover this concert.',
		dismiss: 'Dismiss',
		openCta: 'Ask me a question',
		markWatched: 'Mark watched',
		markUnwatched: 'Mark unwatched',
		watched: 'Watched',
		markAsWatched: 'Mark as watched',
		markAsUnwatched: 'Mark as unwatched'
	}, data.i18n || {});

	var watchedStorageKey = 'ask-bach-watched-' + String(data.concertId || '0');
	var watchedAnyStorageKey = 'ask-bach-watched-any-' + String(data.concertId || '0');
	var globalTipDismissedStorageKey = 'ask-bach-first-visit-tip-dismissed';
	var openBtn = document.getElementById('ask-bach-open');
	var brandLink = document.querySelector('.ask-bach-portrait-cta__brand-link');
	var tipEl = document.getElementById('ask-bach-first-visit-tip');
	var tipCloseBtn = document.getElementById('ask-bach-first-visit-tip-close');
	var tipDismissAllBtn = document.getElementById('ask-bach-first-visit-tip-dismiss-all');

	if (brandLink) {
		brandLink.addEventListener('click', function (event) {
			event.stopPropagation();
			event.stopImmediatePropagation();
		});
	}

	function setStatus(text, isPlaying) {
		if (statusLabel) {
			statusLabel.textContent = text;
		}
		if (statusBar) {
			statusBar.classList.toggle('is-playing', !!isPlaying);
		}
	}

	function showPlaceholder(hide) {
		if (!placeholder) return;
		if (hide) {
			placeholder.classList.add('fade-out');
		} else {
			placeholder.classList.remove('fade-out');
		}
	}

	function loadWatchedState() {
		state.watchedIds = {};
		try {
			var raw = window.sessionStorage.getItem(watchedStorageKey);
			if (!raw) return;
			var parsed = JSON.parse(raw);
			if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
				state.watchedIds = parsed;
			} else if (Array.isArray(parsed)) {
				for (var i = 0; i < parsed.length; i++) {
					state.watchedIds[String(parsed[i])] = true;
				}
			}
		} catch (e) {}
	}

	function persistWatchedState() {
		try {
			window.sessionStorage.setItem(watchedStorageKey, JSON.stringify(state.watchedIds));
		} catch (e) {}

		// Expose for later checkout metrics without coupling pages yet.
		try {
			window.festivalAskBachWatched = window.festivalAskBachWatched || {};
			window.festivalAskBachWatched[String(data.concertId || '0')] = Object.keys(state.watchedIds).filter(function (id) {
				return !!state.watchedIds[id];
			});
		} catch (e2) {}
	}

	function isWatched(id) {
		return !!(id && state.watchedIds[id]);
	}

	function updateSeenToggle(toggle, watched) {
		if (!toggle) return;

		var icon = toggle.querySelector('.seen-toggle-icon i');
		var label = toggle.querySelector('.seen-toggle-label');
		var text = watched ? i18n.markUnwatched : i18n.markWatched;
		var aria = watched ? i18n.markAsUnwatched : i18n.markAsWatched;

		toggle.classList.toggle('is-watched', watched);
		toggle.setAttribute('aria-pressed', watched ? 'true' : 'false');
		toggle.setAttribute('title', aria);
		toggle.setAttribute('aria-label', aria);

		if (label) {
			label.textContent = text;
		}
		if (icon) {
			icon.className = watched ? 'fas fa-eye-slash' : 'far fa-eye';
		}
	}

	function applyWatchedUi() {
		for (var i = 0; i < questionItems.length; i++) {
			var item = questionItems[i];
			var id = item.getAttribute('data-question-id');
			var watched = isWatched(id);
			item.classList.toggle('is-watched', watched);

			var btn = item.querySelector('.interactive-question-btn');
			if (btn) {
				btn.classList.toggle('is-watched', watched);
			}

			var toggle = item.querySelector('.interactive-question-seen-toggle');
			updateSeenToggle(toggle, watched);
		}
	}

	function setWatched(id, watched) {
		if (!id || id === 'idle') return;

		if (watched) {
			state.watchedIds[id] = true;
		} else {
			delete state.watchedIds[id];
		}

		persistWatchedState();
		applyWatchedUi();
	}

	function markWatched(id) {
		setWatched(id, true);
		try {
			window.localStorage.setItem(watchedAnyStorageKey, '1');
		} catch (e) {}
	}

	function highlightQuestion(id) {
		for (var j = 0; j < questionButtons.length; j++) {
			var btn = questionButtons[j];
			if (btn.getAttribute('data-question-id') === id) {
				btn.classList.add('is-active');
			} else {
				btn.classList.remove('is-active');
			}
		}
	}

	function clearHighlight() {
		for (var j = 0; j < questionButtons.length; j++) {
			questionButtons[j].classList.remove('is-active');
		}
	}

	function findEntry(videoId) {
		for (var i = 0; i < allVideos.length; i++) {
			if (allVideos[i].id === videoId) {
				return allVideos[i];
			}
		}
		return null;
	}

	function switchToVideo(videoId) {
		if (!state.isOpen) return;

		var entry = findEntry(videoId);
		if (!entry) return;

		var url = entry.url;
		var platform = detectPlatform(url);
		var videoPlatformId = getVideoId(url);
		if (!platform || !videoPlatformId) return;

		state.currentId = videoId;
		showPlaceholder(true);
		if (videoId !== 'idle' && window.festivalTrackAffiliateEvent) {
			window.festivalTrackAffiliateEvent('interactive_video_started', {
				concertId: data.concertId,
				questionId: videoId
			});
		}

		if (videoId === 'idle') {
			setStatus(i18n.idle, false);
			clearHighlight();
		} else {
			setStatus(entry.label, true);
			highlightQuestion(videoId);
			// Selecting a question counts as watched for session metrics.
			markWatched(videoId);
		}

		if (state.vimeoEndHandler) {
			window.removeEventListener('message', state.vimeoEndHandler);
			state.vimeoEndHandler = null;
		}

		if (platform === 'youtube') {
			switchYouTube(videoPlatformId, videoId === 'idle');
		} else if (platform === 'vimeo') {
			switchVimeo(videoPlatformId, videoId === 'idle');
		}
	}

	function getYouTubePlayerVars(videoId, isIdle) {
		return {
			autoplay: 1,
			rel: 0,
			modestbranding: 1,
			playsinline: 1,
			controls: 1,
			fs: 1,
			// Enable closed captions and set interface language to English
			cc_load_policy: captionsEnabled ? 1 : 0,
			// Interface language affects caption preferences; use 'en' for English
			hl: captionsEnabled ? 'en' : undefined,
			// Disable keyboard controls for overlay safety
			disablekb: 0,
			// Prevent suggested videos after playback ends
			mute: isIdle ? 1 : 0,
			loop: isIdle ? 1 : 0,
			playlist: isIdle ? videoId : undefined
		};
	}

	function switchYouTube(videoId, isIdle) {
		removeVimeoIframe();

		if (state.youtubePlayer && typeof state.youtubePlayer.loadVideoById === 'function') {
			if (isIdle) {
				try { state.youtubePlayer.mute(); } catch (e) {}
			} else {
				try { state.youtubePlayer.unMute(); } catch (e) {}
			}
			state.youtubePlayer.loadVideoById({
				videoId: videoId,
				startSeconds: 0
			});
			try { state.youtubePlayer.setLoop(!!isIdle); } catch (e) {}
			// Ensure captions are shown when switching videos
			if (captionsEnabled) {
				try {
					state.youtubePlayer.loadModule('captions');
					state.youtubePlayer.setOption('captions', 'fontSize', 1);
				} catch (e) {}
			}
			try { state.youtubePlayer.playVideo(); } catch (e) {}
			return;
		}

		createYouTubePlayer(videoId, isIdle);
	}

	function createYouTubePlayer(videoId, isIdle) {
		var existing = container.querySelector('.interactive-video-iframe.youtube');
		if (existing) existing.remove();

		var mount = document.getElementById('yt-player');
		if (!mount) {
			mount = document.createElement('div');
			mount.id = 'yt-player';
			mount.className = 'interactive-video-iframe youtube';
			container.appendChild(mount);
		}

		if (typeof YT !== 'undefined' && YT.Player) {
			state.youtubePlayer = new YT.Player('yt-player', {
				height: '100%',
				width: '100%',
				videoId: videoId,
				playerVars: getYouTubePlayerVars(videoId, isIdle),
				events: {
					onReady: function (event) {
						state.isYouTubeReady = true;
						if (isIdle) {
							try { event.target.mute(); } catch (e) {}
							try { event.target.setLoop(true); } catch (e) {}
						}
						// Load and display captions if enabled
						if (captionsEnabled) {
							try {
								event.target.loadModule('captions');
								// setOption with fontSize 1 enables captions (0=hidden, 1+=visible at different sizes)
								event.target.setOption('captions', 'fontSize', 1);
							} catch (e) {}
						}
						try { event.target.playVideo(); } catch (e) {}
					},
					onStateChange: function (e) {
						if (e.data === 0) {
							handleVideoEnd();
						}
					},
					onError: function () {
						clearTimeout(state.idleLoopTimeout);
						state.idleLoopTimeout = setTimeout(function () {
							if (state.isOpen) {
								switchToVideo('idle');
							}
						}, 1500);
					}
				}
			});
			return;
		}

		var fallbackIframe = document.createElement('iframe');
		var params = [
			'autoplay=1',
			'rel=0',
			'modestbranding=1',
			'playsinline=1',
			'controls=1',
			'cc_load_policy=' + (captionsEnabled ? 1 : 0)
		];
		if (captionsEnabled) {
			// Use 'hl' to set interface language, which influences caption preferences
			params.push('hl=en');
		}
		if (isIdle) {
			params.push('mute=1', 'loop=1', 'playlist=' + videoId);
		}
		fallbackIframe.src = 'https://www.youtube.com/embed/' + videoId + '?' + params.join('&');
		fallbackIframe.className = 'interactive-video-iframe youtube';
		// Modern security: explicit allow attribute with essential features only
		fallbackIframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
		fallbackIframe.setAttribute('allowfullscreen', '');
		fallbackIframe.setAttribute('title', 'Ask Bach video');
		// Add referrer policy for privacy
		fallbackIframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
		// Load attribute for performance (lazy)
		fallbackIframe.setAttribute('loading', 'lazy');
		container.appendChild(fallbackIframe);
		state.activeIframe = fallbackIframe;
	}

	function switchVimeo(videoId, isIdle) {
		removeYouTubeIframe();

		var existing = container.querySelector('.interactive-video-iframe.vimeo');
		if (existing) existing.remove();

		var vimeoParams = [
			'autoplay=1',
			'byline=0',
			'portrait=0',
			'title=0',
			'controls=1',
			'loop=' + (isIdle ? 1 : 0)
		];
		if (isIdle) {
			vimeoParams.push('muted=1');
		}
		if (captionsEnabled) {
			vimeoParams.push('texttrack=en');
		}
		
		var iframe = document.createElement('iframe');
		iframe.src = 'https://player.vimeo.com/video/' + videoId + '?' + vimeoParams.join('&');
		iframe.className = 'interactive-video-iframe vimeo';
		// Modern security: explicit allow attribute with essential features only
		iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
		iframe.setAttribute('allowfullscreen', '');
		iframe.setAttribute('title', 'Ask Bach video');
		// Add referrer policy for privacy
		iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
		// Load attribute for performance (lazy)
		iframe.setAttribute('loading', 'lazy');
		container.appendChild(iframe);
		state.activeIframe = iframe;

		if (!isIdle) {
			iframe.addEventListener('load', function () {
				try {
					iframe.contentWindow.postMessage(JSON.stringify({ method: 'addEventListener', value: 'finish' }), '*');
				} catch (e) {}
			});

			state.vimeoEndHandler = function (event) {
				if (!event.origin || event.origin.indexOf('vimeo') === -1) return;
				try {
					var parsed = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
					if (parsed && (parsed.event === 'finish' ||
						(parsed.event === 'playProgress' && parsed.data && parsed.data.percent >= 0.99))) {
						handleVideoEnd();
						if (state.vimeoEndHandler) {
							window.removeEventListener('message', state.vimeoEndHandler);
							state.vimeoEndHandler = null;
						}
					}
				} catch (e) {}
			};
			window.addEventListener('message', state.vimeoEndHandler);
		}
	}

	function removeYouTubeIframe() {
		if (state.youtubePlayer && typeof state.youtubePlayer.destroy === 'function') {
			try { state.youtubePlayer.destroy(); } catch (e) {}
			state.youtubePlayer = null;
		}

		var el = container.querySelector('.interactive-video-iframe.youtube');
		if (el) el.remove();

		var mount = document.getElementById('yt-player');
		if (mount) mount.remove();

		state.isYouTubeReady = false;
	}

	function removeVimeoIframe() {
		var el = container.querySelector('.interactive-video-iframe.vimeo');
		if (el) el.remove();
		state.activeIframe = null;
	}

	function stopAllPlayback() {
		clearTimeout(state.idleLoopTimeout);
		state.idleLoopTimeout = null;

		if (state.vimeoEndHandler) {
			window.removeEventListener('message', state.vimeoEndHandler);
			state.vimeoEndHandler = null;
		}

		if (state.youtubePlayer && typeof state.youtubePlayer.stopVideo === 'function') {
			try { state.youtubePlayer.stopVideo(); } catch (e) {}
			try { state.youtubePlayer.destroy(); } catch (e) {}
			state.youtubePlayer = null;
		}

		removeYouTubeIframe();
		removeVimeoIframe();

		state.currentId = null;
		state.hasStarted = false;
		showPlaceholder(false);
		clearHighlight();
		setStatus(i18n.ready, false);
	}

	function handleVideoEnd() {
		if (!state.isOpen || state.currentId === 'idle') return;

		if (state.currentId) {
			markWatched(state.currentId);
			if (window.festivalTrackAffiliateEvent) {
				window.festivalTrackAffiliateEvent('interactive_video_completed', {
					concertId: data.concertId,
					questionId: state.currentId,
					data: { watchedCount: Object.keys(state.watchedIds).length }
				});
			}
		}

		setStatus(i18n.returning, false);
		clearTimeout(state.idleLoopTimeout);
		state.idleLoopTimeout = setTimeout(function () {
			if (state.isOpen) {
				switchToVideo('idle');
			}
		}, 1000);
	}

	function loadYouTubeAPI(callback) {
		if (typeof YT !== 'undefined' && YT.Player) {
			state.isYouTubeReady = true;
			if (typeof callback === 'function') callback();
			return;
		}

		var previous = window.onYouTubeIframeAPIReady;
		window.onYouTubeIframeAPIReady = function () {
			if (typeof previous === 'function') {
				try { previous(); } catch (e) {}
			}
			state.isYouTubeReady = true;
			if (typeof callback === 'function') callback();
		};

		if (state.ytApiRequested) return;
		state.ytApiRequested = true;

		var tag = document.createElement('script');
		tag.src = 'https://www.youtube.com/iframe_api';
		// Modern practice: use async attribute for non-blocking script loading
		tag.async = true;
		// Prefer appending to document head for better resource loading order
		document.head.appendChild(tag);
	}

	function startExperience() {
		if (state.hasStarted) {
			if (state.currentId !== 'idle') {
				switchToVideo('idle');
			} else if (state.youtubePlayer && typeof state.youtubePlayer.playVideo === 'function') {
				try { state.youtubePlayer.mute(); } catch (e) {}
				try { state.youtubePlayer.playVideo(); } catch (e) {}
			}
			return;
		}

		state.hasStarted = true;
		var platform = detectPlatform(data.idleVideoUrl);

		if (platform === 'youtube') {
			loadYouTubeAPI(function () {
				if (state.isOpen) {
					switchToVideo('idle');
				}
			});
		} else if (platform === 'vimeo') {
			switchToVideo('idle');
		} else {
			setStatus(i18n.unsupported, false);
		}
	}

	function setupQuestionButtons() {
		for (var i = 0; i < questionButtons.length; i++) {
			questionButtons[i].addEventListener('click', function () {
				var questionId = this.getAttribute('data-question-id');
				if (!questionId || !state.isOpen) return;
				switchToVideo(questionId);
			});
		}
	}

	function setupSeenToggles() {
		for (var i = 0; i < seenToggles.length; i++) {
			seenToggles[i].addEventListener('click', function (event) {
				event.preventDefault();
				event.stopPropagation();

				var questionId = this.getAttribute('data-question-id');
				if (!questionId) return;

				setWatched(questionId, !isWatched(questionId));
			});
		}
	}

	function onModalShown() {
		state.isOpen = true;
		if (window.festivalTrackAffiliateEvent) {
			window.festivalTrackAffiliateEvent('interactive_video_open', { concertId: data.concertId });
		}
		startExperience();
	}

	function onModalHidden() {
		state.isOpen = false;
		stopAllPlayback();
	}

	function hasWatchedAnyVideo() {
		if (Object.keys(state.watchedIds).some(function (id) {
			return !!state.watchedIds[id];
		})) {
			return true;
		}

		try {
			return window.localStorage.getItem(watchedAnyStorageKey) === '1';
		} catch (e) {
			return false;
		}
	}

	function hasGlobalTipDismissal() {
		try {
			return window.localStorage.getItem(globalTipDismissedStorageKey) === '1';
		} catch (e) {
			return false;
		}
	}

	function rememberGlobalTipDismissal() {
		try {
			window.localStorage.setItem(globalTipDismissedStorageKey, '1');
		} catch (e) {}
	}

	function hideIntroTip(persist) {
		if (!tipEl) return;
		tipEl.hidden = true;
		tipEl.classList.remove('is-visible');
		if (openBtn) {
			openBtn.classList.remove('ask-bach-cta-glow--pulse');
		}
		if (persist) {
			rememberGlobalTipDismissal();
		}
	}

	function showIntroTip() {
		if (!tipEl || !openBtn || hasWatchedAnyVideo() || hasGlobalTipDismissal()) {
			return;
		}

		tipEl.hidden = false;
		// Force reflow so the entrance transition plays.
		void tipEl.offsetWidth;
		tipEl.classList.add('is-visible');
		openBtn.classList.add('ask-bach-cta-glow--pulse');
	}

	function setupIntroTip() {
		if (!tipEl || !openBtn) {
			return;
		}

		if (tipCloseBtn) {
			tipCloseBtn.addEventListener('click', function (event) {
				event.preventDefault();
				event.stopPropagation();
				hideIntroTip(false);
			});
		}

		if (tipDismissAllBtn) {
			tipDismissAllBtn.addEventListener('click', function (event) {
				event.preventDefault();
				event.stopPropagation();
				hideIntroTip(true);
			});
		}

		openBtn.addEventListener('click', function (event) {
			if (isBrandLinkClick(event)) {
				return;
			}
			hideIntroTip(false);
		});

		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape' && tipEl.classList.contains('is-visible')) {
				hideIntroTip(false);
			}
		});

		// Delay slightly so the concert layout settles before the tip appears.
		window.setTimeout(showIntroTip, 700);
	}

	function openModal() {
		var ModalApi = window.bootstrap || window.understrap;
		if (ModalApi && ModalApi.Modal) {
			ModalApi.Modal.getOrCreateInstance(modalEl).show();
			return;
		}

		modalEl.classList.add('show');
		modalEl.style.display = 'block';
		modalEl.removeAttribute('aria-hidden');
		document.body.classList.add('modal-open');
		onModalShown();
	}

	function closeModal() {
		var ModalApi = window.bootstrap || window.understrap;
		if (ModalApi && ModalApi.Modal) {
			ModalApi.Modal.getOrCreateInstance(modalEl).hide();
			return;
		}

		modalEl.classList.remove('show');
		modalEl.style.display = 'none';
		modalEl.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('modal-open');
		onModalHidden();
	}

	function bindModalEvents() {
		modalEl.addEventListener('shown.bs.modal', onModalShown);
		modalEl.addEventListener('hidden.bs.modal', onModalHidden);

		if (openBtn) {
			openBtn.addEventListener('click', function (event) {
				if (brandLink && event.target && event.target.closest && event.target.closest('.ask-bach-portrait-cta__brand-link')) {
					return;
				}
				hideIntroTip(false);
				openModal();
			});
		}

		var closeBtns = modalEl.querySelectorAll('[data-bs-dismiss="modal"]');
		for (var c = 0; c < closeBtns.length; c++) {
			closeBtns[c].addEventListener('click', function () {
				closeModal();
			});
		}
	}

	function init() {
		loadWatchedState();
		setupQuestionButtons();
		setupSeenToggles();
		applyWatchedUi();
		persistWatchedState();
		bindModalEvents();
		setupIntroTip();
		setStatus(i18n.ready, false);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();

/**
 * Welcome Video Modal
 *
 * Opens on every home page load, unless the visitor chose
 * "Do not show this again" (remembered in localStorage).
 * The YouTube iframe is only injected on click, so nothing
 * loads from YouTube for visitors who just close the popup.
 *
 * @package festival-bach-understrap
 */

(function () {
	'use strict';

	var OPEN_DELAY = 600;

	var modalEl = document.getElementById('welcome-video-modal');
	if (!modalEl) {
		return;
	}

	var container = document.getElementById('welcome-video-container');
	var playBtn = document.getElementById('welcome-video-play');
	var dismissBtn = document.getElementById('welcome-video-dismiss');
	var titleEl = document.getElementById('welcome-video-modal-title');

	var videoId = modalEl.getAttribute('data-video-id');
	var storageKey = modalEl.getAttribute('data-storage-key');

	if (!container || !playBtn || !videoId) {
		return;
	}

	var iframe = null;

	/**
	 * localStorage can throw (private browsing, blocked storage),
	 * so every access is guarded.
	 */
	function isDismissed() {
		try {
			return window.localStorage.getItem(storageKey) === '1';
		} catch (e) {
			return false;
		}
	}

	function rememberDismissal() {
		try {
			window.localStorage.setItem(storageKey, '1');
		} catch (e) {
			// Nothing to do — the modal simply shows again next visit.
		}
	}

	function buildEmbedUrl() {
		return (
			'https://www.youtube-nocookie.com/embed/' +
			encodeURIComponent(videoId) +
			'?autoplay=1&rel=0&modestbranding=1&playsinline=1'
		);
	}

	function loadVideo() {
		if (iframe) {
			return;
		}

		iframe = document.createElement('iframe');
		iframe.src = buildEmbedUrl();
		iframe.title = titleEl ? titleEl.textContent.trim() : 'YouTube';
		iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
		iframe.setAttribute('allowfullscreen', '');
		iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
		iframe.setAttribute('frameborder', '0');

		container.appendChild(iframe);
		if (playBtn) {
			playBtn.classList.add('fade-out');
			playBtn.style.display = 'none';
		}
	}

	function unloadVideo() {
		if (!iframe) {
			return;
		}

		container.removeChild(iframe);
		iframe = null;
		playBtn.classList.remove('fade-out');
	}

	/**
	 * The Bootstrap bundle is exposed as `understrap` by the child theme,
	 * and as `bootstrap` when loaded from Bootstrap's own dist build.
	 *
	 * @return {object|null} Modal class or null when unavailable.
	 */
	function getModalApi() {
		var ns = window.bootstrap || window.understrap;
		return ns && ns.Modal ? ns.Modal : null;
	}

	function showModal() {
		var Modal = getModalApi();
		if (Modal) {
			Modal.getOrCreateInstance(modalEl).show();
			return;
		}

		// Fallback when the Bootstrap bundle is unavailable.
		modalEl.classList.add('show');
		modalEl.style.display = 'block';
		modalEl.removeAttribute('aria-hidden');
		document.body.classList.add('modal-open');
	}

	function hideModal() {
		var Modal = getModalApi();
		if (Modal) {
			Modal.getOrCreateInstance(modalEl).hide();
			return;
		}

		modalEl.classList.remove('show');
		modalEl.style.display = 'none';
		modalEl.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('modal-open');
		unloadVideo();
	}

	function bindEvents() {
		playBtn.addEventListener('click', loadVideo);

		// Stop playback once the popup is gone.
		modalEl.addEventListener('hidden.bs.modal', unloadVideo);

		if (dismissBtn) {
			dismissBtn.addEventListener('click', function () {
				rememberDismissal();
				hideModal();
			});
		}

		// Manual close handling for the no-Bootstrap fallback.
		if (!getModalApi()) {
			var closeBtns = modalEl.querySelectorAll('[data-bs-dismiss="modal"]');
			for (var i = 0; i < closeBtns.length; i++) {
				closeBtns[i].addEventListener('click', hideModal);
			}
		}
	}

	function init() {
		if (isDismissed()) {
			modalEl.parentNode.removeChild(modalEl);
			return;
		}

		bindEvents();
		loadVideo();
		window.setTimeout(showModal, OPEN_DELAY);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();

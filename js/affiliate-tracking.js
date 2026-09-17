(function () {
	'use strict';

	var config = window.festivalAffiliateData || {};
	var attribution = config.attribution || null;

	window.festivalTrackAffiliateEvent = function (eventName, details) {
		if (!attribution || !config.endpoint || !config.nonce) return;

		details = details || {};
		window.fetch(config.endpoint, {
			method: 'POST',
			keepalive: true,
			headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': config.nonce },
			body: JSON.stringify({
				event: eventName,
				concertId: details.concertId || 0,
				questionId: details.questionId || '',
				data: details.data || {}
			})
		}).catch(function () {});
	};

	document.addEventListener('click', function (event) {
		var link = event.target.closest ? event.target.closest('.festival-ticket-link') : null;
		if (!link || !window.festivalTrackAffiliateEvent) return;

		var destinationUrl = link.href;
		if (attribution && attribution.promo_code) {
			try {
				var destination = new URL(link.href, window.location.href);
				if (!destination.searchParams.has('promo')) {
					destination.searchParams.set('promo', attribution.promo_code);
					link.href = destination.toString();
				}
				destinationUrl = link.href;
			} catch (error) {}
		}

		window.festivalTrackAffiliateEvent('buy_ticket_click', {
			concertId: link.getAttribute('data-concert-id'),
			data: { destination: destinationUrl }
		});
	});
})();

<?php
/**
 * Welcome Video Modal
 *
 * Static popup shown on every home page visit until the visitor opts out
 * with "Do not show this again". Design mirrors the Ask Bach modal.
 *
 * @package festival-bach-understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$welcome_video_id = festival_get_welcome_video_id();
if ( ! $welcome_video_id ) {
	return;
}
?>

<div
	class="modal fade"
	id="welcome-video-modal"
	tabindex="-1"
	aria-labelledby="welcome-video-modal-title"
	aria-hidden="true"
	data-video-id="<?php echo esc_attr( $welcome_video_id ); ?>"
	data-storage-key="<?php echo esc_attr( festival_get_welcome_video_storage_key() ); ?>"
>
	<div class="modal-dialog modal-dialog-centered modal-lg">
		<div class="modal-content welcome-video-content">

			<div class="welcome-video-accent" aria-hidden="true"></div>

			<div class="modal-header welcome-video-header">
				<div class="welcome-video-heading">
					<span id="welcome-video-modal-title" class="welcome-video-kicker mb-0">
						<?php esc_html_e( 'International Bach Festival Montréal', 'festival-bach-understrap' ); ?>
					</span>
				</div>
				<button
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="<?php esc_attr_e( 'Close', 'festival-bach-understrap' ); ?>"
				></button>
			</div>

			<div class="modal-body welcome-video-body">
				<div class="welcome-video-player">
					<div id="welcome-video-container" class="ratio ratio-16x9">
						<button
							type="button"
							id="welcome-video-play"
							class="welcome-video-placeholder"
								aria-label="<?php esc_attr_e( 'Play video', 'festival-bach-understrap' ); ?>"
							></button>
					</div>
				</div>
			</div>

			<div class="modal-footer welcome-video-footer">
				<button
					type="button"
					class="welcome-video-dismiss"
					id="welcome-video-dismiss"
				>
					<span class="welcome-video-dismiss-icon" aria-hidden="true">
						<i class="far fa-eye-slash"></i>
					</span>
					<span>
						<?php esc_html_e( 'Do not show this again', 'festival-bach-understrap' ); ?>
					</span>
				</button>
				<button
					type="button"
					class="welcome-video-close btn btn-primary"
					data-bs-dismiss="modal"
				>
					<?php esc_html_e( 'Continue to the site', 'festival-bach-understrap' ); ?>
				</button>
			</div>

		</div>
	</div>
</div>

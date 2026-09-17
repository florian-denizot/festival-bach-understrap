<?php
/**
 * Interactive Video Modal ("Ask Bach")
 *
 * Theme-aligned modal opened from the concert info CTA.
 * Only renders when the concert has interactive videos configured.
 *
 * @package festival-bach-understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$interactive_data = festival_get_interactive_video_data();
if ( ! $interactive_data ) {
	return;
}

$questions       = $interactive_data['questions'];
$total_questions = count( $questions );
?>

<div
	class="modal fade"
	id="ask-bach-modal"
	tabindex="-1"
	aria-labelledby="ask-bach-modal-title"
	aria-hidden="true"
>
	<div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
		<div class="modal-content ask-bach-modal-content">

			<div class="ask-bach-accent" aria-hidden="true"></div>

			<div class="modal-header ask-bach-header">
				<h2 id="ask-bach-modal-title" class="visually-hidden">
					<?php esc_html_e( 'Ask me your questions', 'festival-bach-understrap' ); ?>
				</h2>
				<button
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="<?php esc_attr_e( 'Close', 'festival-bach-understrap' ); ?>"
				></button>
			</div>

			<div class="modal-body ask-bach-body">
				<div class="ask-bach-layout">

					<div class="ask-bach-media">
						<div class="ask-bach-player">
							<div id="interactive-video-container" class="ratio ratio-16x9">
								<div
									id="interactive-video-placeholder"
									class="ask-bach-placeholder d-flex align-items-center justify-content-center"
								>
									<div class="text-center px-3">
										<span class="ask-bach-placeholder-icon" aria-hidden="true">
											<i class="fas fa-play"></i>
										</span>
										<p class="ask-bach-placeholder-text mb-0">
											<?php esc_html_e( 'Select a question to begin', 'festival-bach-understrap' ); ?>
										</p>
									</div>
								</div>
							</div>
						</div>

						<div class="ask-bach-status-bar">
							<span class="ask-bach-status-dot" aria-hidden="true"></span>
							<p id="interactive-video-label" class="ask-bach-status mb-0" aria-live="polite">
								<?php esc_html_e( 'Ready — select a question', 'festival-bach-understrap' ); ?>
							</p>
						</div>
					</div>

					<div class="ask-bach-sidebar">
						<div
							id="interactive-questions"
							class="ask-bach-questions"
							role="list"
						>
							<?php foreach ( $questions as $index => $q ) : ?>
								<div
									class="interactive-question-item"
									role="listitem"
									data-question-id="<?php echo esc_attr( $q['id'] ); ?>"
								>
									<button
										type="button"
										class="interactive-question-btn"
										data-question-id="<?php echo esc_attr( $q['id'] ); ?>"
										data-video-url="<?php echo esc_url( $q['videoUrl'] ); ?>"
										data-question-index="<?php echo esc_attr( (string) $index ); ?>"
									>
										<span class="question-index" aria-hidden="true">
											<?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?>
										</span>
										<span class="question-text">
											<?php echo esc_html( $q['question'] ); ?>
										</span>
										<span class="question-action" aria-hidden="true">
											<i class="fas fa-play"></i>
										</span>
									</button>
									<button
										type="button"
										class="interactive-question-seen-toggle"
										data-question-id="<?php echo esc_attr( $q['id'] ); ?>"
										aria-pressed="false"
										title="<?php esc_attr_e( 'Mark as watched', 'festival-bach-understrap' ); ?>"
										aria-label="<?php esc_attr_e( 'Mark as watched', 'festival-bach-understrap' ); ?>"
									>
										<span class="seen-toggle-icon" aria-hidden="true">
											<i class="far fa-eye"></i>
										</span>
										<span class="seen-toggle-label">
											<?php esc_html_e( 'Mark watched', 'festival-bach-understrap' ); ?>
										</span>
									</button>
								</div>
							<?php endforeach; ?>
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>
</div>

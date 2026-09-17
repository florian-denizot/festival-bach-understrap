<?php
/**
 * Welcome Video Modal — helpers, assets and rendering.
 *
 * A static popup shown on every home page load, dismissible for good with
 * a "Do not show this again" button (stored client side in localStorage).
 *
 * @package festival-bach-understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

/**
 * Default YouTube video shown in the welcome modal.
 */
define( 'FESTIVAL_WELCOME_VIDEO_ID', 'dbx2tGH0Qhk' );

/**
 * YouTube ID of the welcome video.
 *
 * Filter `festival_welcome_video_id` with an empty value to disable the modal.
 *
 * @return string YouTube video ID, empty string when disabled.
 */
function festival_get_welcome_video_id() {
	/**
	 * Filters the welcome modal video.
	 *
	 * @param string $video_id YouTube video ID.
	 */
	$video_id = (string) apply_filters( 'festival_welcome_video_id', FESTIVAL_WELCOME_VIDEO_ID );

	// Only accept plain YouTube IDs — the JS builds the embed URL from it.
	if ( ! preg_match( '/^[a-zA-Z0-9_-]{6,20}$/', $video_id ) ) {
		return '';
	}

	return $video_id;
}

/**
 * localStorage key used to remember the opt-out.
 *
 * The video ID is part of the key so a new video is shown again to visitors
 * who dismissed the previous one.
 *
 * @return string
 */
function festival_get_welcome_video_storage_key() {
	return 'festivalBachWelcomeVideo:' . festival_get_welcome_video_id();
}

/**
 * Whether the welcome modal should be output on the current request.
 *
 * @return bool
 */
function festival_should_show_welcome_video() {
	if ( ! is_front_page() ) {
		return false;
	}

	if ( is_customize_preview() ) {
		return false;
	}

	return '' !== festival_get_welcome_video_id();
}

/**
 * Enqueue welcome modal assets on the home page.
 */
function festival_enqueue_welcome_modal_assets() {
	if ( ! festival_should_show_welcome_video() ) {
		return;
	}

	$theme_version = wp_get_theme()->get( 'Version' );

	$css_file = '/css/welcome-modal.css';
	$css_path = get_stylesheet_directory() . $css_file;
	if ( file_exists( $css_path ) ) {
		wp_enqueue_style(
			'festival-welcome-modal',
			get_stylesheet_directory_uri() . $css_file,
			array( 'child-understrap-styles' ),
			$theme_version . '.' . filemtime( $css_path )
		);
	}

	$js_file = '/js/welcome-modal.js';
	$js_path = get_stylesheet_directory() . $js_file;
	if ( file_exists( $js_path ) ) {
		wp_enqueue_script(
			'festival-welcome-modal',
			get_stylesheet_directory_uri() . $js_file,
			array( 'child-understrap-scripts' ),
			$theme_version . '.' . filemtime( $js_path ),
			true
		);
	}
}
add_action( 'wp_enqueue_scripts', 'festival_enqueue_welcome_modal_assets', 30 );

/**
 * Print the welcome modal markup in the footer.
 */
function festival_render_welcome_modal() {
	if ( ! festival_should_show_welcome_video() ) {
		return;
	}

	get_template_part( 'global-templates/welcome-video-modal' );
}
add_action( 'wp_footer', 'festival_render_welcome_modal' );

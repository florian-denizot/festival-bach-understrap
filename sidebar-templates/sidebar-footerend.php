<?php
/**
 * Sidebar setup for footer end
 *
 * @package Understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

if ( ! is_active_sidebar( 'footerend' ) ) {
	return;
}

$container = get_theme_mod( 'understrap_container_type' );
?>

<!-- ******************* The Footer End Widget Area ******************* -->

<div class="wrapper" id="wrapper-footer-end" role="complementary">

	<div class="<?php echo esc_attr( $container ); ?>" id="footer-end-content" tabindex="-1">

		<div class="row">

			<?php dynamic_sidebar( 'footerend' ); ?>

		</div>

	</div>

</div><!-- #wrapper-footer-end -->

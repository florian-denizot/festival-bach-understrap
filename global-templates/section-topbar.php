<?php
/**
 * Header Topbar
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
?>

<nav id="topbar">

	<div class="<?php echo esc_attr( $container ); ?>">

		<div class="row">
			<div class="col"><?php dynamic_sidebar( 'topbarleft' ); ?></div>
			<div class="col"><?php dynamic_sidebar( 'topbarcenter' ); ?></div>
			<div class="col d-flex flex-row-reverse align-items-center"><?php dynamic_sidebar( 'topbarright' ); ?></div>
		</div><!-- .row -->
		
	</div><!-- .container(-fluid) -->

</nav><!-- #main-nav -->

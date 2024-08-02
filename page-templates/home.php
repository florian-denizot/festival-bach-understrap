<?php 
/** 
 * Template Name: Home
 *
 * The template for displaying the home page
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();
?>

<div id="home">
	<?php
	// Program hero section 
	get_template_part( 'page-templates/partials/home/program'); 
	?>

	<?php
	// Do the left sidebar check and open div#primary.
	get_template_part( 'global-templates/left-sidebar-check' );
	?>

	<?php
	// Upcoming event section
	get_template_part( 'page-templates/partials/home/upcoming-events'); 
	?>

	<?php
	// News slider section
	?>

	<?php 
	// Permanent block section
	get_template_part( 'page-templates/partials/home/permanent-blocks'); 
	?>

	<?php
	// Do the right sidebar check and close div#primary.
	get_template_part( 'global-templates/right-sidebar-check' );
	?>

	<?php 
	// Partner section
	get_template_part( 'global-templates/section-partners'); 
	?>

	<?php
	// Newsletter
	get_template_part( 'global-templates/section-newsletter' );
	?>
</div>

<?php
get_footer();
    
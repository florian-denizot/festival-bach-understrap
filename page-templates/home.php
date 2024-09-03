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
	// Upcoming event section
	get_template_part( 'page-templates/partials/home/upcoming-events'); 
	?>

	<?php
	// News slider section
	get_template_part( 'page-templates/partials/home/news'); 
	?>

<?php 
	// Permanent block section
	get_template_part( 'page-templates/partials/home/artistic-director'); 
	?>

	<?php 
	// Permanent block section
	get_template_part( 'page-templates/partials/home/permanent-blocks'); 
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
    
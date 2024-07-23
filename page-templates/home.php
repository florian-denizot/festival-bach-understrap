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

$container = get_theme_mod( 'understrap_container_type' );

// Program hero section 
get_template_part( 'page-templates/partials/home/program'); 
?>

<div class="wrapper" id="page-wrapper">

	<div class="<?php echo esc_attr( $container ); ?>" id="content" tabindex="-1">
		<div class="row">

			<?php
			// Do the left sidebar check and open div#primary.
			get_template_part( 'global-templates/left-sidebar-check' );
			?>

			<main class="site-main" id="main">

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

				

   		</main>

			<?php
			// Do the right sidebar check and close div#primary.
			get_template_part( 'global-templates/right-sidebar-check' );
			?>

		</div><!-- .row -->
		
	</div><!-- #content -->


	<?php 
	// Partner section
	get_template_part( 'global-templates/content-partners'); 
	?>


</div><!-- #page-wrapper -->

<?php
get_footer();
    
<?php
/**
 * The template for displaying archive pages
 *
 * Learn more: https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();

$container = get_theme_mod( 'understrap_container_type' );
?>

<div id="archive-page">
	
	<section id="main-heading" class="top-block">
		<div class="main-heading-wrapper">
			<div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
				<div class="row justify-content-center">
					<div class="col-lg-10 col-xl-10 main-heading-content">
						<?php the_archive_title( '<h1 class="display-1">', '</h1>' ); ?>
						<div class="bottom-line my-4"></div>
						<?php the_archive_description( '<h2>', '</h2>' ); ?>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="main-section" class="py-5">
		<div class="<?php echo esc_attr( $container ); ?>" id="content" tabindex="-1">

			<div class="row">

				<?php
				// Do the left sidebar check and open div#primary.
				// get_template_part( 'global-templates/left-sidebar-check' );
				?>

				<main class="site-main" id="main">

					<?php
					if ( have_posts() ) {
						?>
						<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
							<?php
							// Start the loop.
							while ( have_posts() ) {
								the_post();
							?>
								<div class="col">
									<?php
									/*
									* Include the Post-Format-specific template for the content.
									* If you want to override this in a child theme, then include a file
									* called content-___.php (where ___ is the Post Format name) and that will be used instead.
									*/
									get_template_part( 'loop-templates/content', get_post_format() );
									?>
								</div>
							<?php 
							} 
							?>
						</div>
					<?php
					} else {
						get_template_part( 'loop-templates/content', 'none' );
					}
					?>

				</main>

				<?php
				// Display the pagination component.
				understrap_pagination();

				// Do the right sidebar check and close div#primary.
				// get_template_part( 'global-templates/right-sidebar-check' );
				?>

			</div><!-- .row -->

		</div><!-- #content -->
	
	</section>

</div><!-- #archive-page -->

<?php
get_footer();

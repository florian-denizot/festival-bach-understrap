<?php
/**
 * The template for displaying all single posts
 *
 * @package Understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();
$container = get_theme_mod( 'understrap_container_type' );

while ( have_posts() ) {
	the_post();
?>


<div id="single-page">
	<section id="main-heading" 
				class="top-block" 
				style="background-image:url('<?php echo get_the_post_thumbnail_url($post->ID) ? get_the_post_thumbnail_url($post->ID) :  get_stylesheet_directory_uri() . '/images/main-title-bg.jpg'?>')">
		<div class="main-heading-wrapper">
			<div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
				<div class="row justify-content-center">
					<div class="col-lg-10 col-xl-10 main-heading-content">
						<?php the_title( '<h1 class="display-1">', '</h1>' ); ?>
						<div class="underline my-4"></div>
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
				get_template_part( 'global-templates/left-sidebar-check' );
				?>

				<main class="site-main" id="main">

					<?php
						get_template_part( 'loop-templates/content', 'single' );
						// understrap_post_nav();

						// If comments are open or we have at least one comment, load up the comment template.
						if ( comments_open() || get_comments_number() ) {
							comments_template();
						}
					?>

				</main>

				<?php
				// Do the right sidebar check and close div#primary.
				get_template_part( 'global-templates/right-sidebar-check' );
				?>

			</div><!-- .row -->

		</div><!-- #content -->
		
	</section>

</div><!-- #single-page -->

<?php
}
get_footer();

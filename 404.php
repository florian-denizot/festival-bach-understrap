<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @package Understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();

$container = get_theme_mod( 'understrap_container_type' );
?>

<div class="wrapper" id="error-404-wrapper">

	<div class="<?php echo esc_attr( $container ); ?>" id="content" tabindex="-1">

		<div class="row">

			<div class="col-md-12 content-area" id="primary">

				<main class="site-main" id="main">

					<section class="error-404 not-found">

						<div class="page-content">

							<div class="row row-cols-1 row-cols-md-2 g-0">
								<div class="col">
									<img src="<?php echo get_stylesheet_directory_uri() . '/images/broken-b-lines.png'; ?>" 
											class="w-100">
								</div>
								<div class="col text-bg-light">
									<div class="d-flex align-items-center h-100">
										<div class="text-center w-100 p-5">
											<h1 class="display-1 mb-5">
												<?php esc_html_e( 'Page not found', 'festival-bach-understrap' ); ?>
											</h1>
											<a href="/" class="btn btn-primary">
												<?php esc_html_e( 'Return to the home page', 'festival-bach-understrap' ); ?>
											</a>
										</div>
									</div>
								</div>
							</div>
							

						</div><!-- .page-content -->

					</section><!-- .error-404 -->

				</main>

			</div><!-- #primary -->

		</div><!-- .row -->

	</div><!-- #content -->

</div><!-- #error-404-wrapper -->

<?php
get_footer();

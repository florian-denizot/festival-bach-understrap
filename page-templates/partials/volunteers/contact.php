<?php
/**
 * The template to display the Contact section of the Volunteer page
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$data = get_field('contact');
?>

<section id="volunteers-contact" class="py-7 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-4"><?php echo $data['title']; ?></h2>
        <div class="row">
          <div class="col-12 col-lg-6 mb-4">
            <?php echo do_shortcode('[contact-form-7 id="'. $data['form'][0]->ID .'"]'); ?>
          </div>
          <div class="col-12 col-lg-6">
            <div class="mb-3">
              <iframe src="<?php echo $data['map']; ?>" 
                width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
            <div class="mb-3">
              <?php echo $data['content']; ?>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
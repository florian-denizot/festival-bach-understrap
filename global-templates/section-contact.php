<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$title = isset($args['title']) && !empty($args['title']) ? 
    $args['title'] : __('Contact', 'festival-bach-understrap');
$address = isset($args['address']) && !empty($args['address']) ? 
    $args['address'] : get_field('contact_address', 'option');
// $phoneNumberBoxOffice = isset($args['box_office']) && !empty($args['box_office']) ? 
//     $args['box_office'] : get_field('contact_phone_boxoffice', 'option');
$phone = isset($args['phone']) && !empty($args['phone']) ? 
    $args['phone'] : get_field('contact_phone_administration', 'option');
$email = isset($args['email']) && !empty($args['email']) ? 
    $args['email'] : get_field('contact_email', 'option');
$maps = isset($args['maps']) && !empty($args['maps']) ? 
    $args['maps'] : get_field('google_maps', 'option');
$form = isset($args['form']) && is_array($args['form']) ? 
    $args['form'] : get_field('contact_form', 'option');


$class = isset($args['class']) ? $args['class'] : '';
$id = isset($args['id']) ? $args['id'] : 'section-contact';
$titleRight = isset($args['title_right']) && $args['title_right'] ? true : false;

?>
<section id="<?php echo $id; ?>" class="py-9 anchor <?php echo $class; ?>">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-6 text-primary <?php echo $titleRight ? 'text-end' : ''?>"><?php echo $title; ?></h2>
        <div class="row">
          <div class="col-12 col-lg-6 mb-4">
            <?php echo do_shortcode('[contact-form-7 id="'. $form[0]->ID .'"]'); ?>
          </div>
          <div class="col-12 col-lg-6">
            <div class="mb-3">
              <iframe src="<?php echo $maps; ?>" 
                width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
            <div class="mb-3">
              <div class="d-flex align-items-center">
               <i class="fas fa-map-marker-alt me-3"></i>
               <div><?php echo $address; ?></div>
              </div>
            </div>
            <div class="mb-3">
              <div class="d-flex align-items-center">
               <i class="fas fa-phone-alt me-3"></i>
               <div><?php echo $phone; ?></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
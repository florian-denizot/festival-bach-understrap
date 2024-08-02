<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$mainHeading = get_field('main_heading');

$imageTitle = false;
if($mainHeading['image_title'] && $mainHeading['image_title']['url']):
  $imageTitle = esc_url($mainHeading['image_title']['url']);
endif;

$image = false;
if($mainHeading['main_title_image'] && $mainHeading['main_title_image']['url']):
  $image = esc_url($mainHeading['main_title_image']['url']);
endif;
?>
<section id="main-heading" class="top-block" <?php echo $image ? 'style="background-image:url(\'' . $image . '\')"' : ''; ?>>
  <div class="main-heading-wrapper">
    <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
      <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-10 main-heading-content">
          <?php if($imageTitle): ?>
            <div class="main-heading-image-title">
              <img src="<?php echo $imageTitle; ?>"/>
            </div>
            <div class="underline my-3"></div>
          <?php elseif($mainHeading['main_title']): ?>
            <h1 class="display-1"><?php echo $mainHeading['main_title']; ?></h1>
            <div class="underline my-4"></div>
          <?php endif; ?>
          <?php if($mainHeading['subtitle']): ?>
            <h2><?php echo $mainHeading['subtitle']; ?></h2>
          <?php endif; ?>
        </div>
      </div>
    </div>
  </div>
</section>

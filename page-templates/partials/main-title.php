<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$mainHeading = get_field('main_heading');
$image = false;
if($mainHeading['image'] && $mainHeading['image']['url']):
  $image = esc_url($mainHeading['image']['url']);
endif;
?>

<div class="main-heading top-block" <?php echo $image ? 'style="background-image:url(\'' . $image . '\')"' : ''; ?>>
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-xl-6 main-heading-content">
        <?php if($mainHeading['title']): ?>
          <h1 class="display-1"><?php echo $mainHeading['title']; ?></h1>
          <div class="underline"></div>
        <?php endif; ?>
        <?php if($mainHeading['subtitle']): ?>
          <h2 class="display-2"><?php echo $mainHeading['subtitle']; ?></h2>
        <?php endif; ?>
      </div>
    </div>
  </div>
</div>

<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$data = get_field('introduction');

$class = isset($args['class']) ? $args['class'] :'';

if($data && is_array($data) && $data['display_introduction'] ) :
  $title = $data['introduction_title'] ? $data['introduction_title'] : false;
  $content = $data['introduction_content'];
  $image = $data['introduction_image'] ? $data['introduction_image'] : false;
?>

<section id="introduction" class="py-9 anchor <?php echo $class; ?>">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row align-items-stretch gx-0">
      <?php if($image): ?>
        <div class="d-none d-lg-block col-lg-6">
          <img class="introduction-image" src="<?php echo $image['url']; ?>"/>
        </div>
      <?php endif; ?>
      <div class="<?php echo $image ? 'col-lg-6' : 'col' ?> d-flex align-items-center bg-light">
        <div class="p-md-5">
          <h3 class="mb-4"><?php echo $title; ?></h3>
          <div class="text-justify"><?php echo $content; ?></div>
        </div>
      </div>
    </div>
  </div>
</section>

<?php endif; ?>
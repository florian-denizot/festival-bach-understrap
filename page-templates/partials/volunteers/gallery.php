<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('gallery');

$title = $data['title'];
$content = $data['content'];
?>

<section id="volunteers-gallery" class="py-9 anchor bg-note-black">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-6"><?php echo $title; ?></h2>
        <div><?php echo $content; ?></div>
      </div>
    </div>
  </div>
</section>
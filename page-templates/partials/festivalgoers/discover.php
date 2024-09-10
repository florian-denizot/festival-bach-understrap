<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$title = $args['title'];
$content = $args['content'];
$class = isset($args['class']) ? $args['class'] : '';
$id = isset($args['id']) ? $args['id'] : '';
?>

<section id="<?php echo $id; ?>" class="py-9 anchor <?php echo $class; ?> bg-b-lines-black">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-6"><?php echo $title; ?></h2>
        <div>
          <?php echo $content; ?>
        </div>
      </div>
    </div>
  </div>
</section>
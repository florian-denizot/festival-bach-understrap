<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$numbers = get_field('numbers');
?>

<div id="numbers" class="pt-5">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row justify-content-end">
      <div class="col-lg-7 col-xl-6">
        <h2><?php echo $numbers['title']; ?></h2>
        <div class="numbers-content"><?php echo nl2br($numbers['content']); ?></div>
      </div>
    </div>
  </div>
</div>
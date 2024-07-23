<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$summary = get_field('summary');
?>

<div id="summary" class="py-5">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-xl-6">
        <h2 class="pb-4"><?php echo $summary['title']; ?></h2>
        <div><?php echo $summary['content']; ?></div>
      </div>
    </div>
  </div>
</div>
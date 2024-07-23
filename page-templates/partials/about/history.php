<?php
/**
 * The template to display the history section of the About page
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$history = get_field('history');
?>

<div id="history" class="py-5">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-xl-6">
        <h2 class="pb-4"><?php echo $history['title']; ?></h2>
        <?php
        get_template_part( 'loop-templates/history-timeline' );
        ?>
      </div>
    </div>
  </div>
</div>
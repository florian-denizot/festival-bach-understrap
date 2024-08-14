<?php
/**
 * The template to display the Contact section of the Team page
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$data = get_field('contact');
?>

<section id="team-contact" class="py-7 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row justify-content-center">
      <div class="col">
        <h2 class="mb-4"><?php echo $data['title']; ?></h2>
        <div><?php echo $data['content']; ?></div>
      </div>
    </div>
  </div>
</section>
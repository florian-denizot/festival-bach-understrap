<?php
/**
 * The template to display the Our Mission section of the About page
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$mission = get_field('mission');
?>

<section id="about-mission" class="py-5 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-xl-6">
        <h2 class="text-end pb-4"><?php echo $mission['title']; ?></h2>
        <?php
        get_template_part( 'loop-templates/missions' );
        ?>
      </div>
    </div>
  </div>
</section>
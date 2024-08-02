<?php
/**
 * The template to display the Our Values section of the About page
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$values = get_field('values');
?>

<section id="about-values" class="py-5 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row justify-content-center">
      <div class="col-xl-8 col-xxl-9">
        <h2 class="pb-4"><?php echo $values['title']; ?></h2>
        <?php
        get_template_part( 'loop-templates/values' );
        ?>
      </div>
    </div>
  </div>
</section>
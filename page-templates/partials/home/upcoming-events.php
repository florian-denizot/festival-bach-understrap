<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$section = get_field('upcoming_events');

if( $section ):
  $display = $section['display'];

  if($display):
    $heading = $section['heading'];
    $calLinkLabel = $section['calendar_link_label'];
    $calLinkUrl = $section['calendar_link_url'];
?>

<section id="home-upcoming-events" class="py-7 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row justify-content-center">
      <div class="col">
        <h2><?php echo esc_html($heading); ?></h2>

        <?php
        // Do the left sidebar check and open div#primary.
        get_template_part( 'loop-templates/concert-cards' );
        ?>

      </div>
    </div>
  </div>
</section>

<?php
  endif;
endif;
?>
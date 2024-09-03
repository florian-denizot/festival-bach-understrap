<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$section = get_field('upcoming_events');

if( $section ):
  $display = $section['display_upcoming_events'];

  if($display):
    $heading = $section['heading'];
    $calLinkLabel = $section['calendar_link_label'];
    $calLinkUrl = $section['calendar_link_url'];
?>

<section id="home-upcoming-events" class="py-9 anchor text-bg-light">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row justify-content-center">
      <div class="col">
        <h2 class="mb-6"><?php echo esc_html($heading); ?></h2>

        <?php
        // upcoming concerts grid
        $params = array(
          'calLinkLabel' => $calLinkLabel, 
          'calLinkUrl' => $calLinkUrl
        );
        get_template_part('global-templates/content-concert-cards', '',  $params);
        ?>

      </div>
    </div>
  </div>
</section>

<?php
  endif;
endif;
?>
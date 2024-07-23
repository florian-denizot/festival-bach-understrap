<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$section = get_field('upcoming_events');

if( $section ):
  $display = $section['display'];

  if($display):
    $heading = $section['heading'];
    $calLinkLabel = $section['calendar_link_label'];
    $calLinkUrl = $section['calendar_link_url'];
?>
    <div id="upcoming-events" class="my-5">
      <h2><?php echo esc_html($heading); ?></h2>

      <?php
      // Do the left sidebar check and open div#primary.
			get_template_part( 'loop-templates/concert-cards' );
			?>

    </div>
<?php
  endif;
endif;
?>
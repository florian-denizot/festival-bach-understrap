<?php
/**
 * The template to display a history timeline
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$history = get_field('history');

?>


<?php if( $history && $history['timeline'] && is_array($history['timeline']) ): ?>
  <dl class="timeline">
  <?php foreach( $history['timeline'] as $entry): ?>
    <?php $year = esc_html($entry['year']); ?>
    <?php $content = esc_html($entry['content']); ?>

    <dt><?php echo $year; ?></dt>
    <dd><?php echo $content; ?></dd>

  <?php endforeach; ?>
  </dl>

<?php else : ?>
    
<?php endif; ?>
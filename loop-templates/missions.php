<?php
/**
 * The template to display a history timeline
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$mission = get_field('mission');
?>


<?php if( $mission && $mission['missions'] && is_array($mission['missions']) ): ?>
  <?php foreach( $mission['missions'] as $entry): ?>
    <?php $title = esc_html($entry['title']); ?>
    <?php $content = esc_html($entry['content']); ?>

    <h4><?php echo $title; ?></h4>
    <p class="mission-content"><?php echo $content; ?></p>

  <?php endforeach; ?>

<?php else : ?>
    
<?php endif; ?>
<?php
/**
 * The template to display a history timeline
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$values = get_field('values');
?>


<?php if( $values && $values['values'] && is_array($values['values']) ): ?>
  <div class="row">

    <?php foreach( $values['values'] as $entry): ?>
    
      <?php $title = esc_html($entry['title']); ?>
      <?php $content = esc_html($entry['content']); ?>

      <div class="col-md-6">
        <?php if($entry['image'] && is_array($entry['image']) && $entry['image']['url']): ?>
          <div class="value-image mb-3"><img src="<?php echo esc_url($entry['image']['url']); ?>"/></div>
        <?php endif; ?>
        <h4><?php echo $title; ?></h4>
        <p class="mission-content"><?php echo $content; ?></p>
      </div>

    <?php endforeach; ?>
  </div>

<?php else : ?>
    
<?php endif; ?>
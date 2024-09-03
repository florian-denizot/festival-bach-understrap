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
$class = isset($args['class']) ? $args['class'] : '';
$id = isset($args['id']) ? $args['id'] : 'about-history';
?>

<section id="<?php echo $id; ?>" class="py-9 anchor <?php echo $class; ?>  bg-note-red">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-xl-6">
        <h2 class="mb-6"><?php echo $history['title']; ?></h2>
        <?php if( $history && $history['timeline'] && is_array($history['timeline']) ): ?>
          <dl class="timeline">
          <?php foreach( $history['timeline'] as $entry): ?>
            <?php $year = esc_html($entry['year']); ?>
            <?php $content = esc_html($entry['content']); ?>

            <dt><?php echo $year; ?></dt>
            <dd><?php echo $content; ?></dd>
            
          <?php endforeach; ?>
          </dl>
        <?php endif; ?>
      </div>
    </div>
  </div>
</section>
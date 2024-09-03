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

<section id="about-values" class="py-9 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-6"><?php echo $values['title']; ?></h2>
        <?php if( $values && $values['values'] && is_array($values['values']) && count($values['values']) ): ?>
          <div class="row">
            <?php foreach( $values['values'] as $entry): ?>
              
              <?php $title = esc_html($entry['title']); ?>
              <?php $content = esc_html($entry['content']); ?>

              <div class="col-md-6">
                <?php if(isset($entry['icon'])): ?>
                  <div class="value-icon text-primary mb-3 text-center fs-1">
                    <?php echo $entry['icon']; ?>
                  </div>
                <?php endif; ?>
                <h4><?php echo $title; ?></h4>
                <p class="text-justify"><?php echo $content; ?></p>
              </div>
              
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>
    </div>
  </div>
</section>
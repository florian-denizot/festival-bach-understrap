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
<section id="about-mission" class="py-9 anchor text-bg-dark">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-6"><?php echo $mission['title']; ?></h2>
        <?php if( $mission && $mission['missions'] && is_array($mission['missions']) ): ?>
          
          <?php foreach( $mission['missions'] as $index => $entry): ?>
            <div class="row row-cols-1 row-cols-lg-2 g-0">
              <div class="col<?php echo ($index+1) % 2 ? ' order-lg-2': '';?>">
                <img src="<?php echo esc_url($entry['image']['url']); ?>" 
                    alt="<?php echo esc_html($entry['image']['alt']); ?>"
                    class="h-100 w-100 object-fit-cover">
              </div>
              <div class="col text-bg-black d-flex align-items-center<?php echo ($index+1) % 2 ? ' order-lg-1': ''; ?>">
                <div class="p-5">
                  <?php $title = $entry['title']; ?>
                  <?php $content = $entry['content']; ?>
                  <h4><?php echo $title; ?></h4>
                  <div class="text-justify"><?php echo $content; ?></div>
                </div>
              </div>
            </div>
          <?php endforeach; ?>

        <?php endif; ?>
      </div>
    </div>
  </div>
</section>
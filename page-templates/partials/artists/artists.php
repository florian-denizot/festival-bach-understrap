<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = $args['data'];

$title = $data['title'];
$artists = $data['artists'];

$id = $args['id'] ? $args['id'] : 'artists-artists';
$anchor = $args['anchor'] ? $args['anchor'] : 'artists-artists-a';
?>

<section id="<?php echo $id; ?>" class="py-7 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-4"><?php echo $title; ?></h2>
        
        
        <?php if($artists && is_array($artists) && count($artists)): ?>

          <div class="artist-carousel">    

          <?php foreach($artists as $entry): ?>
            
            <?php $artist = get_field("artist", intval($entry->ID)); ?>
            <?php if( $artist && is_array($artist) ): ?>
              <?php if( $artist['image'] && $artist['image']['url'] ): ?>
                <?php $image = $artist['image']['url']; ?>
            
                <div class="item ratio ratio-3x4">
                  <div class="p-1">
                    <div class="image" style="background-image:url('<?php echo esc_url($artist['image']['url']); ?>')">

                      <div class="slide-content">
                        <h5><?php echo $artist['name']; ?></h5>
                        <div><?php echo $artist['instrument']; ?></div>
                      </div>
                    </div>
                  </div>

                </div>
              <?php endif; ?>
            <?php endif; ?>

          <?php endforeach; ?>

          </div>
        <?php endif; ?>
      </div>
    </div>
  </div>
</section>
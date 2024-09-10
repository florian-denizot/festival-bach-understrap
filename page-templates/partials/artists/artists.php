<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = $args['data'];

$title = $data['title'];
$artists = $data['artists'];

$id = isset($args['id']) ? $args['id'] : 'artists-artists';
$class = isset($args['class']) ? $args['class'] : '';
?>
<?php if($artists && is_array($artists) && count($artists)): ?>
<section id="<?php echo $id; ?>" class="py-9 anchor <?php echo $class; ?>">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        
        <h2 class="mb-6"><?php echo $title; ?></h2>

        <div class="artist-carousel">    

          <?php foreach($artists as $entry): ?>
            
            <?php $artist = get_field("artist", intval($entry)); ?>
            <?php if( $artist && is_array($artist) ): ?>
              <?php if( $artist['image'] && $artist['image']['url'] ): ?>
                <?php $image = $artist['image']['url']; ?>
            
                <div class="item ratio ratio-3x4">
                  <?php if($artist['description'] && $artist['description'] !== ''): ?>
                    <a href="#artist-modal"
                        class="p-1"
                        data-bs-toggle="modal" 
                        data-bs-name="<?php echo $artist['name']; ?>"
                        data-bs-image="<?php echo esc_url($artist['image']['url']); ?>"
                        data-bs-bio="<?php echo esc_html($artist['description']); ?>">
                  <?php else : ?>
                    <div class="p-1">
                  <?php endif; ?>
                    <div class="image" style="background-image:url('<?php echo esc_url($artist['image']['url']); ?>')">

                      <div class="slide-content">
                        <h5><?php echo $artist['name']; ?></h5>
                        <div><?php echo $artist['instrument']; ?></div>
                      </div>

                    </div>
                  <?php if($artist['description'] && $artist['description'] !== ''): ?>
                    </a>
                  <?php else : ?>
                    </div>
                  <?php endif; ?>  
                </div>

              <?php endif; ?>
            <?php endif; ?>

          <?php endforeach; ?>

        </div>
        
      </div>
    </div>
  </div>
</section>
<?php endif; ?>
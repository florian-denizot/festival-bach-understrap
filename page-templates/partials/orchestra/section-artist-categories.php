<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = $args['data'];

$groupName = $args['group_name'] ? $args['group_name'] : 'orchestra';
$categoryName = $args['category_name'] ? $args['category_name'] : 'instrument';

$title = $data['title'];
$group = $data[$groupName];

$id = isset($args['id']) ? $args['id'] : 'orchestra-instrument-artists';
$class = isset($args['class']) ? $args['class'] : '';
?>

<section id="<?php echo $id; ?>" class="py-7 anchor <?php echo $class; ?>">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-4"><?php echo $title; ?></h2>
        
        <?php if($group && is_array($group) && count($group)): ?>

          <?php foreach($group as $category): ?>
            
            <h3><?php echo $category[$categoryName]; ?></h3>
            <div class="row row-cols-2 row-cols-sm-3 row-cols-lg-5 g-2 mb-5">

              <?php foreach($category['artists'] as $entry): ?>

                <?php $artist = get_field("artist", intval($entry)); ?>
                <?php if( $artist && is_array($artist) ): ?>
                  <?php if( $artist['image'] && is_array($artist['image']) && $artist['image']['url'] ): ?>

                    <div class="col">
                      
                      <?php $image = $artist['image']; ?>
                  
                      <div class="artist-card ratio ratio-3x4">
                        <div>
                          <?php if($artist['description'] && $artist['description'] !== ''): ?>
                            <a href="#artist-modal"
                                data-bs-toggle="modal" 
                                data-bs-name="<?php echo $artist['name']; ?>"
                                data-bs-image="<?php echo esc_url($artist['image']['url']); ?>"
                                data-bs-bio="<?php echo esc_html($artist['description']); ?>">
                          <?php endif; ?>
                          <div class="artist-image" style="background-image:url('<?php echo esc_url($artist['image']['url']); ?>')">

                            <div class="artist-content">
                              <h6><?php echo $artist['name']; ?></h6>
                            </div>

                          </div>
                          <?php if($artist['description'] && $artist['description'] !== ''): ?>
                            </a>
                          <?php endif; ?>
                        </div>
                      </div>
                    </div>

                  <?php endif; ?>
                <?php endif; ?>

              <?php endforeach; ?>

            </div>

          <?php endforeach; ?>

        <?php endif; ?>

      </div>
    </div>
  </div>
</section>


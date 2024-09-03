<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

require_once(get_stylesheet_directory() . '/inc/text-helper.php');


$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('news'); 

$display = $data['display'];
$title = $data['title'];
$posts = $data['posts'];
$button = $data['button_all_news'];

if($display && $posts && is_array( $posts ) && count( $posts ) > 0) :
?>

<section id="home-news" class="py-9 anchor text-bg-light">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-6"><?php echo $title; ?></h2>
        <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 mb-4">
          
          <?php foreach($posts as $posto): ?>
            <?php $posto = get_post($posto); ?>
            <?php $excerpt = get_excerpt_from_text($posto->post_content, 35); ?>
            <?php if (has_post_thumbnail( $posto->ID ) ): ?>
              <?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $posto->ID ), 'single-post-thumbnail' ); ?>
            <?php endif; ?>
            
            <div class="col">
              <div class="card h-100 text-bg-black">
                
                <div class="ratio ratio-16x9">
                  <img src="<?php echo $image[0]; ?>" class="object-fit-cover">
                </div>
                <div class="card-body pt-4 py-4">
                  <h5 class="card-title">
                    <?php echo $posto->post_title; ?>
                  </h5>
                  <div class="card-text text-justify">
                    <?php echo $excerpt; ?>
                  </div>
                </div>
                <div class="card-footer d-grid pb-4">
                  <a href="<?php echo the_permalink($posto->ID); ?>" 
                      class="btn btn-primary">
                    <?php _e('Read more', 'festival-bach-understrap'); ?>
                  </a>
                </div>

              </div>
            </div> 

          <?php endforeach; ?>
       
        </div>

        <?php if(!empty($button['label']) && !empty($button['link'])): ?>
          <a href="<?php echo esc_url($button['link']); ?>" class="btn btn-outline-primary btn-sm">
            <?php echo $button['label']; ?> <i class="far fa-arrow-right"></i>
          </a>
        <?php endif; ?>

      </div>
    </div>
  </div>
</section>

<?php endif; ?>

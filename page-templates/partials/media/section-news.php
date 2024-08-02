<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('news'); 

$title = $data['title'];
$posts = $data['posts'];

if($posts && is_array( $posts ) && count( $posts ) > 0) :
?>

<section id="media-news" class="py-7 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-4"><?php echo $title; ?></h2>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          
          <?php foreach($posts as $posto): ?>
            <div class="col">
              <?php 
                     
              $posto = get_post($posto); ?>

              <?php if (has_post_thumbnail( $posto->ID ) ): ?>
                <?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $posto->ID ), 'single-post-thumbnail' ); ?>
              <?php endif; ?>
              
              <div class="ratio ratio-4x3">
                <img src="<?php echo $image[0]; ?>" class="object-fit-cover">
                <a href="<?php echo the_permalink($posto->ID); ?>" class="d-flex align-items-end">
                  <div class="p-4 w-100 news-title">
                    <h5 class="mb-0">
                      <?php echo $posto->post_title; ?>
                    </h5>
                  </div>
                </a>
              </div>

            </div> 
          <?php endforeach; ?>
       
        </div>
      </div>
    </div>
  </div>
</section>

<?php endif; ?>
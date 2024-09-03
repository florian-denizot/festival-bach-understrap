<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$data = get_field('other_pages');

$class = isset($args['class']) ? $args['class'] :'';
$id = isset($args['id']) ? $args['id'] :'other_pages';
$titleRight = isset($args['title_right']) && $args['title_right'] ? true : false;
if($data && 
    is_array($data) && 
    isset($data['other_pages_posts']) && 
    is_array($data['other_pages_posts']) && 
    count($data['other_pages_posts'])  ) :
  $title = isset($data['other_pages_title']) ? $data['other_pages_title'] : false;
  $otherPosts = $data['other_pages_posts'];
?>

<section id="<?php echo $id; ?>" class="py-9 anchor <?php echo $class; ?>">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-6 <?php echo $titleRight ? 'text-end' : ''?>"><?php echo $title; ?></h2>

        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              
          <?php foreach($otherPosts as $otherPost): ?>
            
            <?php $item = get_post( $otherPost->ID, ARRAY_A); ?>
            <?php $link = get_permalink($otherPost->ID); ?>
            <?php $heading = get_field('main_heading', $otherPost->ID); ?>
            
            <?php if($heading && 
                    isset($heading['main_title_image']) && 
                    is_array($heading['main_title_image']) && 
                    isset($heading['main_title_image']['url']) &&
                    isset($heading['main_title_image']['alt'])): ?>
              <?php $imageUrl = $heading['main_title_image']['url']; ?>
              <?php $imageAlt = $heading['main_title_image']['alt']; ?>
              
            <?php else: ?>
              <?php $imageUrl = get_the_post_thumbnail_url($otherPost->ID); ?>
              <?php $imageUrl = get_post_meta ( $otherPost->ID, '_wp_attachment_image_alt', true ); ?>
              
            <?php endif; ?>

            <?php if($heading && 
                    isset($heading['main_title']) &&
                    !empty($heading['main_title'])): ?>
              <?php $title = $heading['main_title']; ?>
            <?php else: ?>
              <?php $title = $otherPost->post_title; ?>
            <?php endif; ?>

            <div class="col other_page">
              <a href="<?php echo $link; ?>">
                <div class="ratio ratio-4x3">
                  <img src="<?php echo esc_url($imageUrl); ?>" title="<?php echo $imageAlt; ?>" class="object-fit-cover">
                  <div class="p-4 d-flex align-items-end">
                    <h5 class="mb-0">
                      <?php echo $title; ?>
                      <div class="underline"></div>
                    </h5>
                  </div>
                </div>
              </a>
            </div>
            
          <?php endforeach; ?>
        </div>
      </div>
    </div>
  </div>
</section>

<?php endif; ?>
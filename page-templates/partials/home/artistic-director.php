<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

require_once(get_stylesheet_directory() . '/inc/text-helper.php');

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('artistic_director');

if( $data && isset($data['content']) && !empty($data['content']) && 
    isset($data['excerpt']) && !empty($data['excerpt'])):
  
    $title = $data['title'];
    $content = $data['content'];
    $excerpt = $data['excerpt'];
    $signature= $data['signature'];
    $image = $data['image'];
?>

<section id="home-artistic-director" class="py-9 my-5 my-sm-0 anchor text-bg-primary">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8 text-md-start text-center">
        <?php if($image): ?>
          <img src="<?php echo $image['url']; ?>" 
              class="float-md-end mx-auto me-md-0 ms-md-3 mb-3 col-md-5 col-lg-4 col-sm-6 col-8"/>
        <?php endif; ?>
        <h3 class="pb-4"><?php echo $title; ?></h3>
        <div class="text-justify"><?php echo $excerpt; ?></div>
        <div class="collapse" id="artisticDirectorcollapse">
          <div class="text-justify"><?php echo $content; ?></div>
          <div><?php echo $signature; ?></div>
        </div>
        <div>
          <a href="#artisticDirectorcollapse" 
              data-bs-toggle="collapse"  
              role="button" 
              aria-expanded="false" 
              aria-controls="artisticDirectorcollapse"
              class="link-light link-underline-opacity-25 link-underline-opacity-100-hover fw-bold">
            <span class="opened"><?php _e('Read more', 'festival-bach-understrap'); ?> <i class="fas fa-chevron-right"></i></span>
            <span class="closed"><?php _e('Read less', 'festival-bach-understrap'); ?> <i class="fas fa-chevron-up"></i></span>
          </a> 
        </div>         
       
      </div>
    </div>
  </div>
</section>

<?php 
endif; 
?>
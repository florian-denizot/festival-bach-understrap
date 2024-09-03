<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

require_once(get_stylesheet_directory() . '/inc/text-helper.php');

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('artistic_director');

if( $data && isset($data['content']) && !empty($data['content'])):
  
    $title = $data['title'];
    $content = $data['content'];
    $excerpt = get_excerpt_from_text($content, 100);
    $signature= $data['signature'];
    $image = $data['image'];
?>

<section id="home-artistic-director" class="py-9 my-5 my-sm-0 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row align-items-stretch gx-0">
      <?php if($image): ?>
        <div class="d-none d-lg-block col-lg-4">
          <img src="<?php echo $image['url']; ?>" class="object-fit-cover h-100"/>
        </div>
      <?php endif; ?>
      <div class="col-12 col-lg-8 text-bg-primary" >
        <div class="p-md-5">
          <h3 class="pb-4"><?php echo $title; ?></h3>
          <div class="mb-4 text-justify"><?php echo $excerpt; ?></div>
          <div>
            <a href="#artisticDirectorModal" data-bs-toggle="modal" class="btn btn-light">
              <?php _e('Read more', 'festival-bach-understrap'); ?>
            </a> 
          </div>         
        </div>
      </div>
    </div>
  </div>
</section>

<div class="modal fade" id="artisticDirectorModal" tabindex="-1" aria-labelledby="artisticDirectorModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="artisticDirectorModalLabel"><?php echo $title; ?></h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <?php if($image): ?>
          <div class="row justify-content-center">
            <div class="col col-lg-6 mb-5 px-3">
              <img src="<?php echo $image['url']; ?>"/>
            </div>
          </div>
        <?php endif; ?>
        <div class="text-justify mb-3 px-3"><?php echo $content; ?></div>
        <div class="px-3"><?php echo $signature; ?></div>
      </div>
    </div>
  </div>
</div>

<?php 
endif; 
?>
<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('about');

if( $data && $data['image'] && $data['content']):
  
    $title = $data['title'];
    $subtitle = $data['subtitle'];
    $content = $data['content'];
    $image = $data['image'];
?>

<section id="off-bach-about" class="py-9 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-6 text-end"><?php echo $title; ?></h2>
      </div>
    </div>
    <div class="row row-cols-1 row-cols-lg-2 g-0 align-items-stretch">
      <div class="col d-block">
        <img src="<?php echo esc_url($image['url']); ?>" class="object-fit-cover h-100 w-100">
      </div>
      <div class="col text-bg-light d-block d-flex align-items-center">
        <div class="p-5">
          <h4><?php echo $subtitle; ?></h4>
          <div class="text-justify"><?php echo $content; ?></div>
        </div>
      </div>
    </div>
  </div>
</section>

<?php 
endif; 
?>
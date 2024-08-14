<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('artistic_director');

if( $data ):
  
    $title = $data['title'];
    $content = $data['content'];
    $signature= $data['signature'];
    $image = $data['image'];
?>

<section id="home-artistic-director" class="py-7 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col text-bg-light" >
        <div class="p-md-5 artistic-director-content">
         <div>
            <img class="w-100 mb-4" src="<?php echo $image['url']; ?>" title="<?php echo $image['url']; ?>"/>
          </div>
          <h3 class="pb-4"><?php echo $title; ?></h3>
          <div class="mb-4"><?php echo $content; ?></div>
          <div><?php echo $signature; ?></div>
          
        </div>
      </div>
    </div>
  </div>
</section>

<?php 
endif; 
?>
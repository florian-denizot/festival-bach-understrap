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


<section id="off-bach-artistic-director" class="py-9 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row align-items-stretch gx-0">
      <div class="<?php echo $image ? 'col-lg-8' : 'col'; ?> d-flex align-items-center text-bg-primary" >
        <div class="p-md-5">
          <h3 class="pb-4"><?php echo $title; ?></h3>
          <div class="mb-4"><?php echo $content; ?></div>
          <div><?php echo nl2br($signature); ?></div>
        </div>
      </div>
      <?php if($image): ?>
        <div class="d-none d-lg-block col-lg-4">
          <img class="w-100 h-100" src="<?php echo $image['url']; ?>" title="<?php echo $image['url']; ?>"/>
        </div>
      <?php endif; ?>
    </div>
  </div>
</section>

<?php 
endif; 
?>
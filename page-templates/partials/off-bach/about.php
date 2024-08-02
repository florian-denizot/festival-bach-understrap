<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('about');

if( $data ):
  
    $title = $data['title'];
    $subtitle = $data['subtitle'];
    $content = $data['content'];

?>

<section id="off-bach-about" class="py-7 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="pb-4 text-end"><?php echo $title; ?></h2>
        <h4><?php echo $subtitle; ?></h4>
        <div class="mb-4"><?php echo $content; ?></div>
      </div>
    </div>
  </div>
</section>

<?php 
endif; 
?>
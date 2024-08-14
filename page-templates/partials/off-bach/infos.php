<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('infos');

if( $data ):
  
    $title = $data['title'];
    $map = $data['google_map'];
    $content = $data['content'];

?>

<section id="off-bach-infos" class="py-7 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-4 text-end"><?php echo $title; ?></h2>
        <div class="row align-items-center">

          <div class="col-md-8 mb-2">
            <iframe src="<?php echo $map; ?>" 
              width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
          <div class="col-md-4">
            <?php echo $content; ?>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</section>

<?php 
endif; 
?>
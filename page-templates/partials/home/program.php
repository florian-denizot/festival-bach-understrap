<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$program = get_field('program');

if( $program ):
  $display = $program['display'];
  
  if($display):
    $header = $program['header'];
    $subheader = $program['subheader'];
    
    $programButton = $program['program_button'];
    $offBachButton = $program['off_bach_button'];

    $image = $program['background_image'];
?>
<section id="home-program" class="top-block" style="background-image:url('<?php echo esc_url( $image['url'] ); ?>')">
  <div class="<?php echo esc_attr( $container ); ?> py-5 d-flex align-items-center h-100">
    <div class="row">
      <h1 class="program-heading display-1 mb-3"><?php echo $header; ?></h>
      <h2 class="program-subheading mb-3"><?php echo $subheader; ?></h2>
      <div class="program-buttons">
        <a class="btn btn-light btn-lg" href="<?php echo esc_attr($programButton['link']); ?>">
          <?php echo esc_html($programButton['label']); ?>
        </a>
        <a class="btn btn-outline-light btn-lg" href="<?php echo esc_attr($offBachButton['link']); ?>">
          <?php echo esc_html($offBachButton['label']); ?>
        </a>
      </div>
    </div>
  </div>
</section> 
<?php 
  endif;
endif; 
?>
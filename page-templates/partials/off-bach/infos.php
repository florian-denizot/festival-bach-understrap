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
          <!--<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.839948778036!2d-73.5732831233913!3d45.5133004301608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91a4a5936d0f1%3A0x84cb923e61c6cd4c!2s3487%20St%20Laurent%20Blvd%2C%20Montreal%2C%20QC%20H2X%202T6!5e0!3m2!1sen!2sca!4v1721770527253!5m2!1sen!2sca" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>-->
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
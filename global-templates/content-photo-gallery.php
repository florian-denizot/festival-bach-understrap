<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

locate_template('/inc/photo-gallery-helper.php', true);

$container = get_theme_mod( 'understrap_container_type' );

if($args && is_array($args) && $args['data'] && is_array($args['data'])) :

  $data = $args['data'];
  $colClass = isset($args['colClass']) ? $args['colClass'] : "col-lg-8";
  $index = isset($args['index']) ? $args['index'] : "";
  
?>

  <div class="row justify-content-center">
    <div class="<?php echo $colClass; ?>">
  
      <div class="gallery-display gallery-display-<?php echo $index; ?>">
        <?php getSlides($data, "ratio-16x9"); ?>
      </div>
    </div>
  </div>

  <div class="gallery-carousel gallery-carousel-<?php echo $index; ?>">    
    <?php getSlides($data, "ratio-1x1"); ?>
  </div>
<?php endif; ?>


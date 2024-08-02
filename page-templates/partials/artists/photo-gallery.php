<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$data = get_field('photo_gallery');

if ( ! empty( $data ) && is_array($data) && $data['title'] && $data['photos']):

$title = $data['title'];
$photos = $data['photos'];
?>

<section id="artists-gallery" class="py-7 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-4"><?php echo $title; ?></h2>

        <?php
        // Photo Gallery
        $args = array(
          "data" => $photos,
          "index" => 29
        );
        get_template_part( 'global-templates/content-photo-gallery', null, $args); 
        ?>
        
      </div>
    </div>
  </div>
</section>
<?php endif; ?>
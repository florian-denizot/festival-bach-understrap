<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('galleries');

$title = $data['title'];
$galleries = $data['galleries'];

if($galleries && is_array( $galleries ) && count( $galleries ) > 0) :
?>
<section id="media-galleries" class="py-9 anchor text-bg-black">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-6"><?php echo $title; ?></h2>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          
          <?php foreach($galleries as $index => $gallery): ?>

            <div class="col">
              <a href="<?php echo $gallery["link"]; ?>">
                <div class="ratio ratio-4x3">
                  <img src="<?php echo esc_url($gallery['image']['url']); ?>" title="<?php echo $gallery['image']['alt']; ?>" class="object-fit-cover">
                  <div class="gallery-title p-4">
                    <h5>
                      <?php echo $gallery['title']; ?>
                      <div class="underline"></div>
                    </h5>
                  </div>
                </div>
              </a>
            </div>
           
          <?php endforeach; ?>
       
        </div>
      </div>
    </div>
  </div>
</section>

<?php endif; ?>
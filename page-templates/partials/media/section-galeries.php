<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('galleries');

$title = $data['title'];
$galleries = $data['galleries'];

if($galleries && is_array( $galleries ) && count( $galleries ) > 0) :
?>
<section id="media-galleries" class="py-7 anchor text-bg-black">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-4"><?php echo $title; ?></h2>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          
          <?php foreach($galleries as $index => $gallery): ?>

            <div class="col">
              <a href="#modal-gallery-<?php echo $index; ?>"  data-bs-toggle="modal">
                <div class="ratio ratio-4x3">
                  <img src="<?php echo esc_url($gallery['gallery']['0']['url']); ?>" title="<?php echo $gallery['gallery']['0']['alt']; ?>" class="object-fit-cover">
                  <div class="gallery-title p-4">
                    <h5><?php echo $gallery['title']; ?></h5>
                  </div>
                </div>
              </a>
            </div> 

            <!-- Modal -->
            <div class="modal modal-gallery modal-lg fade" id="modal-gallery-<?php echo $index; ?>" tabindex="-1" aria-labelledby="gallery-<?php echo $index; ?>-modal-label" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content text-bg-white">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="gallery-<?php echo $index; ?>-modal-label"><?php echo $gallery['title']; ?></h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <?php
                    // Photo Gallery
                    $args = array(
                      "data" => $gallery['gallery'],
                      "colClass" => "col",
                      "index" => $index
                    );
                    get_template_part( 'global-templates/content-photo-gallery', null, $args); 
                    ?>
                  </div>
                </div>
              </div>
            </div>
           
          <?php endforeach; ?>
       
        </div>
      </div>
    </div>
  </div>
</section>

<?php endif; ?>
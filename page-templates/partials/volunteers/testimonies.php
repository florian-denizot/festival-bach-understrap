<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('testimonies');

$title = $data['title'];
$content = $data['testimonies'];
?>

<section id="volunteers-testimonies" class="py-9 anchor text-bg-black">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-6"><?php echo $title; ?></h2>
        <div class="testimony-carousel">
          <?php foreach($content as $testimony):?>
            <div>
              <div class="p-3 mx-1 text-bg-dark h-100 d-flex flex-column justify-content-between">
                <blockquote class="blockquote"><i class="fs-3 text-primary fas fa-quote-left me-2"></i> <?php echo $testimony['testimony']; ?></blockquote>
                <figcaption class="blockquote-footer text-end"><strong><?php echo $testimony['name']; ?></strong></figcaption>
              </div>
            </div>
            
          <?php endforeach; ?>
        </div>
      </div>
    </div>
  </div>
</section>
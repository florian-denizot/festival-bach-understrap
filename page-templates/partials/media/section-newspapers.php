<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('newspapers');

$title = $data['title'];
$stories = $data['stories'];
?>

<?php if($stories && is_array( $stories ) && count( $stories ) > 0) : ?>

<section id="media-newspapers" class="py-9 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-6"><?php echo $title; ?></h2>
        <div class="newspaper-carousel">
          
          <?php foreach($stories as $story): ?>
            <div>
              <div class="card text-bg-black">

                <?php if ($story['image'] && $story['image']['url']): ?>
                  <?php $image = $story['image']['url']; ?>
                <?php endif; ?>
                
                <div class="ratio ratio-4x3 mb-3">
                  <img src="<?php echo $image; ?>" class="object-fit-cover">
                </div>
                <div class="card-body">
                  <div class="card-title">
                    <strong><?php echo $story['title']; ?> - <?php echo $story['newspaper']; ?></strong>
                  </div>
                  <div class="card-text">
                    <?php echo $story['date']; ?>
                  </div>
                </div>
                <div class="card-footer d-grid">
                  <a href="<?php echo $story['link']; ?>" target="_blank" class="btn btn-outline-light">
                    <?php _e('Read the article', 'festival-bach-understrap'); ?>
                  </a>
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
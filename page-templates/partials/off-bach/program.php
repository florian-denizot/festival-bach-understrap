<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$program = get_field('program');

if( $program ):
  $display = $program['display'];
  
  if($display):
    $title = $program['title'];
    $subtitle = $program['subtitle'];
    $description = $program['description'];

    $cards = $program['program_cards'];

    $bottomText = $program['bottom_text'];
    $button = $program['button'];
?>

<section id="off-bach-program" class="py-7 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="pb-4"><?php echo $title; ?></h2>
        <h4><?php echo $subtitle; ?></h4>
        <div class="mb-4"><?php echo $description; ?></div>
        
        <?php if($cards && is_array($cards) && count($cards)): ?>
          <div class="row row-cols-1 row-cols-md-3 text-center g-4 mb-4">
          
            <?php foreach($cards as $entry): ?>
            
              <div class="col">
                <div class="card h-100 text-bg-light">

                  <?php if($entry['image'] && $entry['image']['url']): ?>
                    <img src="<?php echo esc_url($entry['image']['url']); ?>" class="card-img-top"/>
                  <?php endif; ?>

                  <div class="card-body">
                    <h4 class="card-title"><?php echo $entry['title']; ?></h4>
                  
                    <div class="card-text"><?php echo $entry['description']; ?></div>
                  </div>
                </div>
              </div>

            <?php endforeach; ?>

          </div>
        <?php endif; ?>

        <p class="text-center lead">
          <?php echo $bottomText; ?>
        </p>
        <?php if($button && is_array($button) && $button['text'] && $button['link']): ?>
          <div class="text-center">
            <a href="<?php echo esc_url($button['link']); ?>" class="btn btn-lg btn-primary">
              <?php echo $button['text']; ?> <i class="fa fa-chevron-circle-right"></i>
            </a>
          </div>
        <?php endif; ?>
      </div>
    </div>
  </div>
</section>

<?php 
  endif; 
endif;
?>

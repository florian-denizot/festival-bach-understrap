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

<section id="off-bach-program" class="py-9 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-6"><?php echo $title; ?></h2>
        <h4><?php echo $subtitle; ?></h4>
        <div class="lead mb-4"><?php echo $description; ?></div>
        
        <div class="row row-cols-1 row-cols-lg-3 mb-4">
          <?php if($cards && is_array($cards) && count($cards)): ?>
            <?php foreach($cards as $index => $card): ?>
              
              <div class="col mb-3">
                <div class="ratio ratio-16x9 mb-3">
                  <img src="<?php echo esc_url($card['image']['url']); ?>" 
                      alt="<?php echo esc_html($card['image']['alt']); ?>"
                      class="h-100 w-100 object-fit-cover">
                </div>

                <h4><?php echo $card['title']; ?></h4>
                <div><?php echo $card['description']; ?></div>

              </div>

            <?php endforeach; ?>
          <?php endif; ?>
        </div>

      
        <div class="text-center">
          <h4 class="mb-5"><?php echo $bottomText; ?></h4>
          <?php if($button && is_array($button) && $button['text'] && $button['link']): ?>
            <div>
              <a href="<?php echo esc_url($button['link']); ?>" class="btn btn-lg btn-primary">
                <?php echo $button['text']; ?> <i class="fa fa-chevron-right ms-3"></i>
              </a>
            </div>
          <?php endif; ?>
        </div>

      </div>
    </div>
  </div>
</section>

<?php 
  endif; 
endif;
?>

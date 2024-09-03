<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('donate'); 

$title = $data['title'];
$blocks = $data['blocks'];
$footer = $data['footer'];

if($blocks && is_array( $blocks ) && count( $blocks ) > 0) :
?>
<section id="donate-donate" class="py-9 anchor text-bg-black">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <?php if($title): ?>
          <h2 class="mb-6"><?php echo $title; ?></h2>
        <?php endif; ?>
        
        <div class="row row-cols-1 row-cols-lg-3 text-center">
          <?php foreach($blocks as $block): ?>
          
            <div class="col mb-5">
              <div class="text-center text-primary fs-2 mb-4"><?php echo $block['icon']; ?></div>
              <h4><?php echo $block['title']; ?></h4>
              <div><?php echo $block['content']; ?></div>
              <div>
                <a href="<?php echo esc_url($block['button']['link']); ?>" class="btn btn-primary">
                <?php echo $block['button']['label']; ?>
                </a>
              </div>
            </div>
          
          <?php endforeach; ?>
        </div>
      </div>
    </div>
    
    <?php if($footer): ?>    
      <div class="row">
        <div class="col text-center">
          <?php echo $footer; ?>
        </div>
      </div>
    <?php endif; ?>

  </div>
</section>

<?php endif; ?>
<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('info');

$title = $data['title'];
$blocks = $data['blocks'];

if($blocks && is_array( $blocks ) && count( $blocks ) > 0) :
?>

<section id="concerts-infos" class="py-9 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-6"><?php echo $title; ?></h2>
        <div class="row row-cols-1 row-cols-md-2 gx-7 gy-4">
          
          <?php foreach($blocks as $index => $block): ?>
            <div class="col info-block">
              <h3>
                <?php echo $block['title']; ?>
              </h3>
              <div>
                <?php echo $block['content']; ?>
              </div>
              <?php if($index < count($blocks)-1 ): ?>
                <div class="separator" ></div>
              <?php endif; ?>
            </div> 
          <?php endforeach; ?>
       
      </div>
    </div>
  </div>
</section>
<?php endif; ?>
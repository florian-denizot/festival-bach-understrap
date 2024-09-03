<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$title = $args['title'];
$cards = $args['cards'];
$class = isset($args['class']) ? $args['class'] : '';
$id = isset($args['id']) ? $args['id'] : '';

if(is_array($cards) && count($cards)):
?>

<section id="<?php echo $id; ?>" class="py-9 anchor <?php echo $class; ?>">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-6"><?php echo $title; ?></h2>
        
        <?php if($cards && is_array($cards) && count($cards)): ?>
          <?php foreach($cards as $index => $card): ?>
            <?php $args = [
              'image' => $card['image'],
              'title' => $card['title'],
              'content' => $card['content'],
              'button'  => $card['button'],
              'image_right' => false, 
              'row_class' => 'g-0 mb-4',
              'content_bg' => 'text-bg-dark',
              'col_image-class' => 'col-sm-12 col-md-4',
              'col_content_class' => 'col-sm-12 col-md-8',
              ]?>
            <?php get_template_part( 'loop-templates/content-card-side-by-side', null, $args); ?>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </div>
  </div>
</section>

<?php 
endif;
?>

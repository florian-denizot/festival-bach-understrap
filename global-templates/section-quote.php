<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$data = get_field('quote');

$class = isset($args['class']) ? $args['class'] :'';
$id = isset($args['id']) ? $args['id'] :'';
$quoteClass = isset($args['quote_class']) ? $args['quote_class'] : 'text-bg-light';

if($data && is_array($data) && isset($data['content'])) :
  $content = $data['content'];
  $author = isset($data['author']) && !empty($data['author']) ? $data['author'] : false;
?>

<section id="<?php echo $id; ?>" class="py-9 anchor <?php echo $class; ?>">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <div class="p-5 <?php echo $quoteClass; ?>">
          <blockquote class="blockquote fs-3">
            <i class="text-primary fas fa-quote-left me-2"></i> 
            <span><?php echo $content; ?></span>
            <i class="text-primary fas fa-quote-right ms-2"></i> 
          </blockquote>
          <?php if($author): ?>
            <figcaption class="blockquote-footer text-end fs-4 mb-0">
              <strong><?php echo $author; ?></strong>
            </figcaption>
          <?php endif; ?>
        </div>
      </div>

    </div>
  </div>
</section>

<?php endif; ?>
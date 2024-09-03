<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;
$imageRight = isset($args['image_right']) &&  $args['image_right'] ? true : false;
$image = isset($args['image']) && is_array($args['image']) ? $args['image'] : false;
$title = isset($args['title']) && !empty($args['title']) ? $args['title'] : false;
$content = isset($args['content']) && !empty($args['content']) ? $args['content'] : false;
$button = isset($args['button']) && is_array($args['button']) ? $args['button'] : false; 
$rowClass = isset($args['row_class']) && !empty($args['row_class']) ? $args['row_class'] : 'g-0';
$contentBg = isset($args['content_bg']) && !empty($args['content_bg']) ? $args['content_bg'] : '';
$colContentClass = isset($args['col_content_class']) && !empty($args['col_content_class']) ? $args['col_content_class'] : false;
$colImageClass = isset($args['col_image_class']) && !empty($args['col_image_class']) ? $args['col_image_class'] : false;

?>
<div class="row <?php echo $rowClass; ?>">
  <?php if($image): ?>
    <div class="col <?php echo $colImageClass; ?><?php echo $imageRight ? ' order-lg-2': '';?>">
      <img src="<?php echo esc_url($image['url']); ?>" 
          alt="<?php echo esc_html($image['alt']); ?>"
          class="h-100 w-100 object-fit-cover">
    </div>
  <?php endif; ?>

  <div class="col d-flex align-items-center 
          <?php echo $imageRight ? ' order-lg-1': ''; ?> 
          <?php echo $contentBg; ?> 
          <?php echo $colContentClass; ?>">
    <div class="p-5">
      <h4><?php echo $title; ?></h4>
      <div class="mb-3"><?php echo $content; ?></div>
      <div>
        <a href="<?php echo $button['url']; ?>" class="btn btn-primary">
          <?php echo $button['title']; ?>
        </a>
      </div>
    </div>
  </div>
</div>
<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('other_questions'); 

$title = $data['title'];
$content = $data['content'];
?>
<section id="faq-other-questions" class="py-7 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col text-center py-5 text-bg-light">
        
        <?php if($title): ?>
          <h2 class="mb-4"><?php echo $title; ?></h2>
        <?php endif; ?>
        
        <div><?php echo $content; ?></div>
      
      </div>
    </div>
  </div>
</section>
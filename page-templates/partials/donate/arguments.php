<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('arguments'); 

$title = $data['title'];
$arguments = $data['arguments'];

if($arguments && is_array( $arguments ) && count( $arguments ) > 0) :
?>

<section id="donate-arguments" class="py-7 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <?php if($title): ?>
          <h2 class="mb-4"><?php echo $title; ?></h2>
        <?php endif; ?>
        
        <?php foreach($arguments as $index => $argument): ?>
          <div class="row row-cols-1 row-cols-lg-2 g-0">
            <div class="col<?php echo ($index+1) % 2 ? ' order-lg-2': '';?>">
              <img src="<?php echo esc_url($argument['image']['url']); ?>" 
                  alt="<?php echo esc_html($argument['image']['alt']); ?>"
                  class="h-100 w-100 object-fit-cover">
            </div>
            <div class="col text-bg-black d-flex align-items-center<?php echo ($index+1) % 2 ? ' order-lg-1': ''; ?>">
              <div class="p-5">
                <div class="text-center text-primary fs-2 mb-4"><?php echo $argument['icon']; ?></div>
                <h4><?php echo $argument['title']; ?></h4>
                <div><?php echo $argument['content']; ?></div>
              </div>
            </div>
          </div>
        <?php endforeach; ?>
        

      </div>
    </div>
  </div>
</section>

<?php endif; ?>
<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('history');

$title = $data['title'];
$events = $data['events'];

if($events && is_array( $events ) && count( $events ) > 0) :
?>

<section id="orchestra-history" class="py-7 anchor text-bg-black">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-5"><?php echo $title; ?></h2>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 gx-4 gy-5">
          
          <?php foreach($events as $event): ?>
            <div class="col text-center">
              
              <h5>
                <?php echo $event['year']; ?>
              </h5>
              <div>
              <?php echo $event['description']; ?>
              </div>
                
               
            </div> 
          <?php endforeach; ?>
       
        </div>
      </div>
    </div>
  </div>
</section>

<?php endif; ?>
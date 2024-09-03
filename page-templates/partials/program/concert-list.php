<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$concerts = $args['concerts'];

function cmp($a, $b){
  // get a date
  $a_date_time = new DateTime($a['concert_date_time'], new DateTimeZone("US/Eastern"));
  // parse it into Unix timestamp
  $a_date_time_strtotime = strtotime($a_date_time->format("Y-m-d H:i:s"));


  // get b date
  $b_date_time = new DateTime($b['concert_date_time'], new DateTimeZone("US/Eastern"));
  // parse it into Unix timestamp
  $b_date_time_strtotime = strtotime($b_date_time->format("Y-m-d H:i:s"));

  return  $a_date_time_strtotime >= $b_date_time_strtotime ? 1 : -1;
};

usort($concerts, "cmp");
?>

<section id="concerts" class="py-9 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    
    <?php if(count($concerts)): ?>
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <?php foreach($concerts as $concert): ?>
          <?php
          $concert_title = $concert["concert_title"];
          $concert_sub_title = $concert["concert_sub_title"];
          $off_bach_type = $concert["off_bach_type"];
          $concert_image = $concert["concert_image"];
          $hall = get_field("hall", $concert["concert_hall"][0]);
          //$concert_date = date( "d.m.y", strtotime($concert["concert_date_time"]));
          $concert_date = date_i18n( get_option( 'date_format' ), strtotime($concert["concert_date_time"]) );
          $day_of_week = date_i18n( "l", strtotime($concert["concert_date_time"]) );
          $concert_is_live = $concert["concert_is_live"];
          $concert_is_full = $concert["concert_is_full"];
          $concert_is_free = $concert["concert_is_free"];
          $concert_is_pre_opening = $concert["concert_is_pre_opening"];
          $concert_instruments = $concert["instruments"];
          $concert_guid = $concert["guid"];
          $concert_id = $concert["ID"];
          ?>

          <div class="col">
            <a href="<?php echo get_permalink($concert_id);?>" class="card shadow h-100 d-flex">
              <div class="concert-image ratio ratio-16x9 text-white mb-3">
                <img <?php echo $concert_image["url"] ? "src=" . $concert_image["url"] : null; ?> alt="" class="object-fit-cover"/>
                <div class="d-flex align-items-end flex-wrap justify-content-start">
                  <?php if ( $concert_is_free ): ?>
                    <div class="concert-free badge text-bg-primary m-2"><?php _e('Free', 'festival-bach-understrap'); ?></div>
                  <?php endif; ?>
                  <?php if ( $concert_is_pre_opening ): ?>
                    <div class="concert-free badge text-bg-primary m-2"><?php _e('Pre-opening', 'festival-bach-understrap'); ?></div>
                  <?php endif ?>
                  <?php if($concert_is_full): ?>
                  <div class="concert-full badge text-bg-primary m-2"><?php _e('Full', 'festival-bach-understrap'); ?></div>
                  <?php endif; ?>
                  <?php if($concert_is_live): ?>
                    <div class="concert-full badge text-bg-primary m-2"><?php _e('Live available', 'festival-bach-understrap'); ?></div>
                  <?php endif;?>
                </div>
              </div>
              <div class="card-body">
                <h6 class="card-title">
                  <?php echo $concert_title;?>
                  <div class="underline underline-black"></div>
                </h6>
                <div><?php echo $concert_sub_title;?></div>
              </div>
              <div class="card-footer">
                <?php if($hall): ?>
                  <div class="d-flex align-items-center">
                    <i class="far fa-map-marker-alt fa-fw me-2"></i>
                    <div><?php echo $hall["name"];?></div>
                  </div>               
                <?php endif; ?>
                <div class="text-uppercase d-flex align-items-center">
                  <i class="far fa-calendar fa-fw me-2"></i> 
                  <div><strong><?php echo $day_of_week;?> - <?php echo $concert_date;?></strong></div>
                </div>
              </div>
            </a>
          </div>

        <?php endforeach; ?>

      </div>

    <?php else : ?>

      <div class="alert alert-info">
        <?php _e("No concert matching your search was found.", 'festival-bach-understrap'); ?>
      </div>          

    <?php endif; ?>

  </div>
</section>
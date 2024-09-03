<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$concert = get_field('concert');

$hall = get_field("hall", $concert["concert_hall"][0]);

$concert_tickets = $concert["concert_tickets"];
$concert_tickets_indoor_link = $concert["concert_tickets"]["concert_ticket_indoor"]["concert_ticket_indoor_link"];
$concert_tickets_online_link = $concert["concert_tickets"]["concert_ticket_online"]["concert_ticket_online_link"];
?>


<?php if($concert_tickets_indoor_link || $concert_tickets_online_link):?>

  <section id="concert-ticket" class="bg-light py-9">
    <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
      <div class="row justify-content-center">
        <div class="col-16 col-md-8 col-lg-6 col-xl-5">

          <?php if($concert_tickets_indoor_link): ?>
            <a class="ticket-card" href="<?php echo $concert_tickets_indoor_link ?>" target="_blank">
              <div class="p-4">
                <div class="text-uppercase fs-2 mb-5">
                  <strong><?php _e("Buy your tickets", 'festival-bach-understrap'); ?></strong>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-map-marker-alt me-2"></i>
                    <div>
                      <small><?php echo $hall["name"]; ?></small>
                    </div>
                  </div>
                  <div class="ps-4 fs-2">
                    <i class="fas fa-arrow-right" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
            </a>
          <?php endif; ?>

          <?php if($concert_tickets_online_link): ?>
            <a class="ticket-card" href="<?php echo $concert_tickets_online_link ?>" target="_blank">
              <div class="p-4">
                <div class="text-uppercase fs-2 mb-5">
                  <strong><?php _e("Buy your tickets", 'festival-bach-understrap'); ?></strong>
                </div>
                <div class="d-flex justify-content-end">
                  <div class="fs-2">
                    <i class="fas fa-arrow-right" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
            </a>
          <?php endif; ?>

        </div>
      </div>
    </div>
    </div>
  </section>
<?php endif;?>

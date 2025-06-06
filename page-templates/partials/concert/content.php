<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

while ( have_posts() ) : the_post();
  $id = $post->ID;
endwhile;

$concert = get_field('concert');
$subtitle = $concert["concert_sub_title"];
$description = $concert["concert_description"];

$instruments = get_the_terms($id, "instruments");
$has_different_dates = $concert["has_different_dates"];

// concert date format
$date = (new DateTime(str_replace("/", "-", $concert["concert_date_time"])))->format('F d, Y g:i a');
$temp_1 = $date;
$date = (ICL_LANGUAGE_CODE == "fr" ? dateToFrench2($date, 'd F Y - G:i') : $date );

$date_2 = (new DateTime(str_replace("/", "-", $concert["concert_date_time_2"])))->format('F d, Y g:i a');
$temp_2 = $date_2;
$date_2 = (ICL_LANGUAGE_CODE == "fr" ? dateToFrench2($date_2, 'd F Y - G:i') : $date_2 );

$are_concerts_date_time_equal = (date('d F Y H:i', strtotime($temp_1)) == date('d F Y H:i', strtotime($temp_2)) ) ? true : false;
$are_concerts_date_equal = (date('d F Y', strtotime($temp_1)) == date('d F Y', strtotime($temp_2)) ) ? true : false;


$price = $concert["concert_price"];

$concert_tickets = $concert["concert_tickets"];
$concert_tickets_indoor_link = $concert["concert_tickets"]["concert_ticket_indoor"]["concert_ticket_indoor_link"];
$concert_tickets_online_link = $concert["concert_tickets"]["concert_ticket_online"]["concert_ticket_online_link"];

$is_live = $concert["concert_is_live"];
$hall = get_field("hall", $concert["concert_hall"][0]);
$socials = $concert["concert_socials"];
$program_url = $concert["program"];
$produit_par = $concert["produit_par"];
$en_partenariat_avec = $concert["en_partenariat_avec"];
$playlist = isset($concert["concert_playlist_url"]) && !empty($concert["concert_playlist_url"]) ? $concert["concert_playlist_url"] : null;

$hall = get_field("hall", $concert["concert_hall"][0]);
$hall_name = $hall["name"];
$hall_address = $hall["address"];
$hall_address_address = $hall["address"]["address"];
$lat = $hall["address"]["lat"];
$lng = $hall["address"]["lng"];

$sponsors = $concert['concert_sponsors'];
?>

<section id="concert-main" class="py-7">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">

      <div class="col-12 col-md-6">
        <?php if ($produit_par) : ?>
          <h5 class="concert-partner">
            <?php _e("Produced by", "festival-bach-understrap"); ?> : <strong><?php echo $produit_par ?></strong>
          </h5>
        <?php endif; ?>

        <?php if ($en_partenariat_avec): ?>
          <h5 class="concert-partner">
            <?php  _e("In partnership with", "festival-bach-understrap"); ?> : <strong><?php echo $en_partenariat_avec ?></strong>
          </h5>
        <?php endif; ?>

        <?php if($subtitle): ?>
          <div class="display-5 mb-5 text-uppercase">
            <?php echo $subtitle; ?>
          </div>
        <?php endif; ?>
        <div class="text-justify"><?php echo $description; ?></div>

        <?php if ( $program_url ) { ?>
          <h3><a href="<?php echo $program_url; ?>" target="_blank"><?php _e("Evening Program", "festival-bach-understrap");?></a></h3>
        <?php } ?>
      </div>

      <div class="col-12 col-md-6 concert-info">
        <div class="text-bg-light h-100">
          <div class="px-md-4 pt-3">

            <h4><?php _e("concert info", 'festival-bach-understrap'); ?></h4>
            <ul class="list-unstyled">

              <!-- Dates -->
              <?php if($has_different_dates && $are_concerts_date_equal): ?>
                <li class="concert-date">
                  <i class="fas fa-calendar-alt fa-fw"></i>
                  <span><?php echo $date; ?></span>
                  <span>&nbsp;<?php _e("and", 'festival-bach-understrap');?>&nbsp;</span>
                  <span><?php echo date('H:i', strtotime($temp_2)); ?></span>
                </li>
              <?php elseif($has_different_dates && !$are_concerts_date_equal): ?>
                <li class="concert-date">
                  <i class="fas fa-calendar-alt fa-fw"></i>
                  <span><?php echo $date; ?></span>
                </li>
                <li class="concert-date">
                  <i class="fas fa-calendar-alt fa-fw"></i>
                  <span><?php echo $date_2; ?></span>
                </li>
              <?php elseif($date): ?>
                <li class="concert-date">
                  <i class="fas fa-calendar-alt fa-fw"></i>
                  <span><?php echo $date; ?></span>
                </li>
              <?php endif;  ?>

              <!-- Venue -->
              <?php if($hall_name): ?>
                <li class="concert-venue">
                  <i class="far fa-map-marker-alt fa-fw"></i>
                  <span><?php echo $hall_name; ?></span>
                </li>
              <?php endif; ?>
              
              <!-- Instruments -->
              <?php if($instruments && count($instruments) > 0): ?>
                <?php foreach($instruments as $instrument):
                        $instrument_slug = $instrument->slug;
                        $instrument_icon = $instrument->instrument_icon;
                ?>
                  <li class="concert-instrument">
                    <i class="<?php echo get_field( "instrument_icon", "instruments" . '_' . $instrument->term_id); ?> fa-fw"></i>
                    <span><?php echo $instrument->name; ?></span>
                  </li>
                <?php endforeach; ?>
              <?php endif; ?>
              
              <!-- Price -->
              <?php 
              if($price["concert_price_fixed_price"] || 
                (
                  $price["concert_price_variabel_price"] && 
                  $price["concert_price_variabel_price"]["minimum_price"] && 
                  $price["concert_price_variabel_price"]["maximum_price"]  
                )):
              ?>
                <li class="concert-price">
                  <i class="far fa-ticket-alt fa-fw"></i>
                  <span>
                    <?php if($price["concert_price_fixed_price"]): ?>
                      <?php echo $price["concert_price_fixed_price"]; ?> $
                    <?php else: ?> 
                      <?php 
                      echo __("from", 'festival-bach-understrap') . ' ' .
                        $price["concert_price_variabel_price"]["minimum_price"] . ' ' .
                        __("to", 'festival-bach-understrap') . ' ' .
                        $price["concert_price_variabel_price"]["maximum_price"] . 
                        "$"; 
                      ?>
                    <?php endif; ?>
                  </span>
                </li>
              <?php endif; ?>
              
              <!-- Live -->
              <?php if($is_live): ?> 
                <li class="concert-live">
                  <i class="fas fa-circle text-accent fa-fw"></i>
                  <span><?php _e("Live available", "festival-bach-understrap"); ?></span>
                </li>
              <?php endif; ?>
            </ul>
            
            <!-- Socials -->
            <?php if( $socials["concert_social_spotify"] || $socials["concert_social_soundcloud"] || $socials["concert_social_youtube"] ||  
                      $socials["concert_social_website"] || $playlist !== null): ?>
              <div class="concert-social">
                <div class="header">
                  <h4><?php _e("the artist's universe", 'festival-bach-understrap'); ?></h4>
                </div>
                <ul class="list list-unstyled">
                  <?php if($socials["concert_social_spotify"]): ?>
                    <li>
                      <a href="<?php echo $socials["concert_social_spotify"];?>" target="_blank" class="link-dark">
                        <i class="fab fa-spotify"></i>
                        <span class=""> Spotify</span>
                      </a>
                    </li>
                  <?php endif; ?>
                  <?php if($socials["concert_social_soundcloud"]): ?>
                    <li>
                      <a href="<?php echo $socials["concert_social_soundcloud"];?>" target="_blank" class="link-dark"> 
                        <i class="fab fa-soundcloud"></i>
                          <span class=""> Soundcloud</span>
                        </a>
                    </li>
                  <?php endif; ?>
                  <?php if($socials["concert_social_youtube"]): ?>
                    <li class="d-flex align-items-center">
                      <a href="<?php echo $socials["concert_social_youtube"];?>" target="_blank" class="link-dark"> 
                        <i class="fab fa-youtube"></i>
                        <span class=""> Youtube</span>
                      </a>
                    </li>
                  <?php endif; ?>
				          <?php if($socials["concert_social_website"]): ?>
                    <li class="d-flex align-items-center">
                      <a href="<?php echo $socials["concert_social_website"];?>" target="_blank" class="link-dark"> 
                        <i class="fas fa-link"></i>
                        <span class=""> <?php _e("Website", 'festival-bach-understrap'); ?></span>
                      </a>
                    </li>
                  <?php endif; ?>
                </ul>
              </div>

              <!-- Playlist -->
              <?php if($playlist !== null): ?>

                <iframe
                  src="<?php echo $playlist; ?>"
                  width="100%"
                  height="300"
                  class="concert-playlist mb-4">
                  <p>Your browser does not support iframes.</p>
                </iframe>
              <?php endif; ?>
              <!-- End playlist -->
            <?php endif; ?>


            


            <!-- Buy ticket button -->
            <?php if($concert_tickets_indoor_link || $concert_tickets_online_link): ?>
              <div class="mb-4">
                <?php if($concert_tickets_indoor_link): ?>
                  <a class="btn btn-primary btn-lg" 
                      href="<?php echo $concert_tickets_indoor_link ?>" 
                      target="_blank">
                <?php _e("Buy your tickets", 'festival-bach-understrap'); ?>
                  </a>
                <?php endif; ?>

                <?php if($concert_tickets_online_link): ?>
                  <a class="btn btn-primary btn-lg" 
                      href="<?php echo $concert_tickets_online_link ?>" 
                      target="_blank">
                    <?php _e("Buy your tickets", 'festival-bach-understrap'); ?>  
                  </a>
                <?php endif; ?>
              </div>
            <?php endif; ?>
          </div>

          <!-- Google Maps -->
          <?php if($hall): ?>
            <div class="concert-map">  
              <iframe
                src="https://maps.google.com/maps?q=<?php echo $hall_address_address;?>&hl=es;z=5&amp;output=embed"
                width="100%" height="300" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false"
                tabindex="0"></iframe>
            </div>
          <?php endif; ?>

          <!-- Sponsors -->
          <?php if($sponsors && is_array($sponsors) && count($sponsors)): ?>
            <div class="px-md-4 pt-3">
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-1 row-cols-lg-2 g-3">
              <?php foreach($sponsors as $sponsor): ?>
                <div class="col">
                  <div class="border h-100">
                    <?php if(isset($sponsor['concert_sponsor_link']) && !empty($sponsor['concert_sponsor_link'])): ?>
                      <a href="<?php echo esc_url($sponsor['concert_sponsor_link']); ?>" target="_blank">
                    <?php endif; ?>

                    <?php if(isset($sponsor['concert_sponsor_logo']) && isset($sponsor['concert_sponsor_logo']['url'])): ?>
                      <div class="mb-3 p-4 bg-white">
                        <div class="ratio ratio-4x3 ">
                          <img src="<?php echo esc_url($sponsor['concert_sponsor_logo']['url']); ?>"
                              alt="<?php echo esc_url($sponsor['concert_sponsor_logo']['alt']); ?>"
                              class=" w-100 h-100 object-fit-contain"/>
                        </div>
                      </div>
                    <?php endif; ?>

                    <?php if(isset($sponsor['concert_sponsor_link']) && !empty($sponsor['concert_sponsor_link'])): ?>
                    </a>
                    <?php endif; ?>

                    <?php if(isset($sponsor['concert_sponsor_content']) && !empty($sponsor['concert_sponsor_content'])): ?>
                      <div class="mx-3"><?php echo $sponsor['concert_sponsor_content']; ?></div>
                    <?php endif; ?>
                  </div>
                </div>
              <?php endforeach ?>
            </div>
          <?php endif; ?>
        </div>
      </div>

    </div>
  </div>
</section>

<?php
// Convert a date or timestamp into French.
function dateToFrench2($date, $format)
{
    $english_days = array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
    $french_days = array('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche');
    $english_months = array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
    $french_months = array('janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre');
    return str_replace($english_months, $french_months, str_replace($english_days, $french_days, date($format, strtotime($date) ) ) );
}
?>
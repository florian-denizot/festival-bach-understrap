<?php

/* NOW DATE
 ** DESC: Get the current date and time and pase it into Unix timestamp
*/
// Get the current date and time
$now_date_time = new DateTime("now", new DateTimeZone("US/Eastern"));

// Parse it into Unix timestamp
$now_date_time_strtotime = strtotime($now_date_time->format("Y-m-d H:i:s"));

/*
 ** DESC: Get all the concerts using wp_query
*/

$WP_concerts = new WP_Query(
  array(
    'post_type' => 'concerts',
    'posts_per_page' => -1,
    'post_status' => 'publish',
    'orderby' => 'menu_order',
    'order' => 'ASC',
    'tax_query' => array(
      array(
        'taxonomy' => 'concert_types',
        'field' => 'slug',
        'terms' => 'bach'
      )
    )
  )
);

/*
 ** DESC: Create a new concerts array including the concert acf fields
*/

$concerts = array();
if($WP_concerts->have_posts()) :
  while($WP_concerts->have_posts()) : $WP_concerts->the_post();
    $item_post = get_post();
    $concert = get_field('concert');
    // $concert["instruments_taxonomy"] = get_the_terms($concert["ID"]);
    // echo $concert["instruments_taxonomy"];
    $concert["ID"] = $item_post->ID;
    $concert["guid"] = $item_post->guid;
    array_push($concerts ,$concert);
  endwhile;
endif; wp_reset_query();

/*
 ** DESC: Sort the concerts by date-time field
*/

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

//usort($concerts, "cmp");

/*
 ** DESC: Remove the old concerts
*/
$concerts = array_filter($concerts, 'newConcerts');

function newConcerts($concert) {
  // get a date
  $concert_date_time = new DateTime($concert['concert_date_time'], new DateTimeZone("US/Eastern"));

  // parse it into Unix timestamp
  $concert_date_time_strtotime = strtotime($concert_date_time->format("Y-m-d H:i:s"));

  // Get the current date and time
  $now_date_time = new DateTime("now", new DateTimeZone("US/Eastern"));

  // Parse it into Unix timestamp
  $now_date_time_strtotime = strtotime($now_date_time->format("Y-m-d H:i:s"));


  // echo gettype($concert_date_time_strtotime > $now_date_time_strtotime) . " " . ($concert_date_time_strtotime > $now_date_time_strtotime);

  return ($concert_date_time_strtotime >= $now_date_time_strtotime);

}

$concerts  = array_slice($concerts, 0, 5);

?>

<!-- Programs Body -->
<div class="row">
  <?php if($concerts): ?>
    <?php foreach($concerts as $concert): ?>
      <?php
        $concert_title = $concert["concert_title"];
        $concert_sub_title = $concert["concert_sub_title"];
        $concert_description = $concert["concert_description"];
        $concert_image = $concert["concert_image"];
        $concert_date_time = $concert["concert_date_time"];
        $concert_is_live = $concert["concert_is_live"];
      ?>
      <div class="col-12 col-sm-6 col-lg-4 mb-4">
        <div class="ratio ratio-4x3 concert">

          <a href="<?php echo $concert["guid"]?>" 
              class="d-flex align-items-end"
              style="background-image:url('<?php echo $concert["concert_image"]["url"]; ?>');"
              trigger-collapse="collapse-infos-<?php echo $concert["guid"]; ?>">
    
            <div class="concert-body">
              <h4 class="title">
                <?php echo $concert["concert_title"]; ?>
                <div class="underline"></div> 
              </h4>
              <div class="concert-infos collapse" id="collapse-infos-<?php echo $concert["guid"]; ?>">
                <div class="description">
                  <?php echo $concert["concert_sub_title"]; ?>
                </div>
                <div class="date">
                  <i class="fa fa-calendar-o"> </i> <strong><?php echo (ICL_LANGUAGE_CODE == "fr" ? dateToFrench(date( "d F Y", strtotime($concert_date_time)), 'd F Y') : $concert_date_time ); ?></strong>
                </div>
                <?php if($concert_is_live): ?>
                <div class="live">
                  <i class="fas fa-circle"></i> live
                </div>
                <?php endif; ?>
              </div>
            </div>
            
          </a>

        </div>
      </div>
    <?php endforeach; ?>
  <?php endif; ?>
  <div class="col-12 col-sm-6 col-lg-4 mb-4">
    <div class="ratio ratio-4x3 concert calendar-link">
    <a href=""
      class="d-flex align-items-end"
      style="background-image:url('http://localhost:3000/wp-content/uploads/2021/09/FestBachMtl.png'); "></a>

    </a>
    </div>    
  </div>
</div>

<?php
  // Convert a date or timestamp into French.
  function dateToFrench($date, $format) {
    $english_days = array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
    $french_days = array('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche');
    $english_months = array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
    $french_months = array('janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre');
    return str_replace($english_months, $french_months, str_replace($english_days, $french_days, date($format, strtotime($date) ) ) );
  }
?>

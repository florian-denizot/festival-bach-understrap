<?php

$taxonomy_terms = $template_args['taxonomy_terms'];
$instruments_taxonomy_terms = $taxonomy_terms["instruments_taxonomy_terms"];
$concert_types_taxonomy_terms = $taxonomy_terms["concert_types_taxonomy_terms"];

$parameters_matches = $template_args['parameters_matches'];
$instrument_matches = $parameters_matches["instrument"];
$concert_type_matches = $parameters_matches["concert-type"];

$concerts = $template_args['concerts'];

/* NOW DATE
 ** DESC: Get the current date and time and pase it into Unix timestamp
*/
// Get the current date and time
$now_date_time = new DateTime("now", new DateTimeZone("US/Eastern"));

// Parse it into Unix timestamp
$now_date_time_strtotime = strtotime($now_date_time->format("Y-m-d H:i:s"));

/*function get_array_by_key_path($data, $key_path){
  if(count($key_path) == 0){
      return $data;
  }
  $key = array_shift($path_keys);
  // and recursion now
  return get_array_by_key_path($data['properties'][$key], $keys);
}*/

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

usort($concerts, "cmp");


function getYearsIntervalValues($concerts) {

  $start_year = (int) date( "Y", strtotime($concerts[0]["concert_date_time"]));
  $end_year = (int) date( "Y", strtotime($concerts[count($concerts) - 1]["concert_date_time"]));
  $temp = Array();

  for ($x = $start_year; $x <= $end_year; $x++) {
    $temp[$x] = null;
    for ($y = 1; $y <= 12; $y++) {
      $temp[$x][$y] = null;

      for ($z = 1; $z <= weeks($y,$x); $z++) {

        $temp[$x][$y][$z] = null;

        // $temp = week_start_end_by_date(date('Y-m-d', strtotime($temp_date_time->format("Y-m-d"))));
        // echo "test ";
        // print_r($test);

        if($z == 1) {
          // Get the current date and time
          $temp_date_time = new DateTime($x . "-" . $y . "-01", new DateTimeZone("US/Eastern"));
          $temp[$x][$y][$z]["first_day"] = $temp_date_time->format("Y-m-d H:i:s");
          $temp2_date_time = new DateTime($x . "-" . $y . "-01", new DateTimeZone("US/Eastern"));
          $week_start_end = week_start_end_by_date(date('Y-m-d' , strtotime($temp2_date_time->format("Y-m-d"))));
          $temp3_date_time = new DateTime($week_start_end["last_day_of_week"], new DateTimeZone("US/Eastern"));
          $temp[$x][$y][$z]["last_day"] = $temp3_date_time->format("Y-m-d H:i:s");
          $temp[$x][$y][$z]["concerts"] = Array();
        }
        else if($z == weeks($y,$x)) {
          $a_date = $x . "-" . $y . "-27";
          $temp2_date_time = new DateTime($x . "-" . $y . "-28", new DateTimeZone("US/Eastern"));
          $week_start_end = week_start_end_by_date(date('Y-m-d' , strtotime($temp2_date_time->format("Y-m-d"))));
          $temp3_date_time = new DateTime($week_start_end["first_day_of_week"], new DateTimeZone("US/Eastern"));
          $temp[$x][$y][$z]["first_day"] = $temp3_date_time->format("Y-m-d H:i:s");
          $temp[$x][$y][$z]["last_day"] = date("Y-m-t", strtotime($a_date));
          $temp[$x][$y][$z]["concerts"] = Array();
        }

        else {
          $temp2 = ($z - 1) * 7;
          $temp2_date_time = new DateTime($x . "-" . $y . "-" . $temp2, new DateTimeZone("US/Eastern"));
          $week_start_end = week_start_end_by_date(date('Y-m-d' , strtotime($temp2_date_time->format("Y-m-d"))));
          $temp3_date_time = new DateTime($week_start_end["first_day_of_week"], new DateTimeZone("US/Eastern"));
          $temp[$x][$y][$z]["first_day"] = $temp3_date_time->format("Y-m-d H:i:s");
          $temp3_date_time = new DateTime($week_start_end["last_day_of_week"], new DateTimeZone("US/Eastern"));
          $temp[$x][$y][$z]["last_day"] = $temp3_date_time->format("Y-m-d H:i:s");
          $temp[$x][$y][$z]["concerts"] = Array();
        }
      }
    }
  }
  return $temp;
}

$concerts_years = Array();
$concert_years = getYearsIntervalValues($concerts);

for ($x = 0; $x < count($concerts); $x++) {
  $concert = $concerts[$x];
  $concert_date = $concert["concert_date_time"];
  $concert_date_time = new DateTime($concert_date, new DateTimeZone("US/Eastern"));
  $concert_date_timestamp = $concert_date_time->getTimestamp();
  $year = (int) date("Y",strtotime($concert_date_time->format("Y-m-d")));
  $month = (int) date("m",strtotime($concert_date_time->format("Y-m-d")));
  $week = (int) getWeeks($concert_date_time->format("Y/m/d"), 'Monday');
  // echo $concert["concert_date_time"]  . "<br>";
  // echo "week => " . $week  . "<br>";
  // echo "month => " . $month  . "<br>";
  // echo "year => " . $year  . "<br>";

  if($week == 6) $week = 5;
  if($concert_years[$year][$month][$week]["concerts"]) {
    array_push($concert_years[$year][$month][$week]["concerts"], $concert);
  } else {
    $concert_years[$year][$month][$week]["concerts"] = Array($concert);
  }
  // print_r($concert_years[$year][$month][$week]);
}

function getWeeks($date, $rollover) {
  $cut = substr($date, 0, 8);
  $daylen = 86400;

  $timestamp = strtotime($date);
  $first = strtotime($cut . "00");
  $elapsed = ($timestamp - $first) / $daylen;

  $weeks = 1;

  for ($i = 1; $i <= $elapsed; $i++)
  {
      $dayfind = $cut . (strlen($i) < 2 ? '0' . $i : $i);
      $daytimestamp = strtotime($dayfind);

      $day = strtolower(date("l", $daytimestamp));

      if($day == strtolower($rollover))  $weeks ++;
  }

  return $weeks;
}

function weeks($month, $year){
  $num_of_days = date("t", mktime(0,0,0,$month,1,$year));
  $lastday = date("t", mktime(0, 0, 0, $month, 1, $year));
  $no_of_weeks = 0;
  $count_weeks = 0;

  while($no_of_weeks < $lastday){
      $no_of_weeks += 7;
      $count_weeks++;
  }

  return $count_weeks;
}

function week_start_end_by_date($date, $format = 'Ymd') {

  //Is $date timestamp or date?
  if (is_numeric($date) AND strlen($date) == 10) {
      $time = $date;
  }else{
      $time = strtotime($date);
  }

  $week['week'] = date('W', $time);
  $week['year'] = date('o', $time);
  $week['year_week']           = date('oW', $time);
  $first_day_of_week_timestamp = strtotime($week['year']."W".str_pad($week['week'],2,"0",STR_PAD_LEFT));
  $week['first_day_of_week']   = date($format, $first_day_of_week_timestamp);
  $week['first_day_of_week_timestamp'] = $first_day_of_week_timestamp;
  $last_day_of_week_timestamp = strtotime($week['first_day_of_week']. " +6 days");
  $week['last_day_of_week']   = date($format, $last_day_of_week_timestamp);
  $week['last_day_of_week_timestamp']  = $last_day_of_week_timestamp;

  return $week;
}

$week_start_end = week_start_end_by_date(date('Y-m-d', strtotime($now_date_time->format("Y-m-d"))));
$week_start = $week_start_end["first_day_of_week_timestamp"];
$week_end = $week_start_end["last_day_of_week_timestamp"];;

$dateTime = new DateTime('2020-09-01');
$monday = clone $dateTime->modify(('Monday' == $dateTime->format('l')) ? 'Monday last week' : 'Monday this week');
$sunday = clone $dateTime->modify('Sunday this week');

// Get the current date and time
$test_date_time = new DateTime("2020-9-1", new DateTimeZone("US/Eastern"));

// Parse it into Unix timestamp
$test_date_time_strtotime = strtotime($test_date_time->format("Y-m-d H:i:s"));

// echo $test_date_time->format("Y-m-d H:i:s");
?>

<section class="schedule-result">
  <div class="container">

    <?php $disclaimer_text = get_field("disclaimer_text"); ?>

    <?php if ($disclaimer_text): ?>
      <h3 class="heading disclaimer">
        <div class="inner">
          <?php echo $disclaimer_text; ?>
        </div>
      </h3>
    <?php endif; ?>

    <div class="content">

      <?php foreach ($concert_years as $key => $concert_year): ?>

        <?php
          $current_year = 1000;
          $year = $key;
        ?>

        <div class="items">
          <!-- <div class="header">
            <div class="year-intro">
              <p class="year-intro-title">
                <?php /* echo ICL_LANGUAGE_CODE == "fr" ? "début des festivals bach et off-bach montréal " . $year : "beginning of festival bach montréal and off-festival bach " . $year; */ ?>
              </p>
            </div>
            <div class="year-date">
              <p class="year-date-text"><?php echo $year; ?></p>
            </div>
          </div> -->
          <?php foreach ($concert_year as $key => $concert_month):?>
            <?php if (($concert_month && $concert_month[1] && $concert_month[1]["concerts"] && count($concert_month[1]["concerts"]) > 0) || ($concert_month && $concert_month[2] && $concert_month[2]["concerts"] && count($concert_month[2]["concerts"]) > 0) || ($concert_month && $concert_month[3] && $concert_month[3]["concerts"] && count($concert_month[3]["concerts"]) > 0) || ($concert_month && $concert_month[4] && $concert_month[4]["concerts"] && count($concert_month[4]["concerts"]) > 0) || ($concert_month && $concert_month[5] && $concert_month[5]["concerts"] && count($concert_month[5]["concerts"]) > 0)): ?>
              <?php
                $month = $key;
				//echo $key;
                $dateObj   = DateTime::createFromFormat('!m', $month, new DateTimeZone('US/Eastern'));
				//var_dump($dateObj);
                //$monthName = $dateObj->format('F');
				$monthName = date_i18n( 'F', strtotime( $month.'/01/2020' ) );
              ?>
              <div class="items">
                <div class="header">
                  <div class="month">
                    <h3 class="month-date"><?php echo $monthName; ?></h3>
                    <i class="fas fa-angle-up"></i>
                  </div>
                </div>
                <?php foreach ($concert_month as $key => $concert_week): ?>
                  <?php
                    $first_day_timestamp = strtotime($concert_week["first_day"]);
                    $first_day_number = date('d', $first_day_timestamp);
                    $last_day_timestamp = strtotime($concert_week["last_day"]);
                    $last_day_number = date('d', $last_day_timestamp);
                  ?>
                  <?php if ($concert_week["concerts"]): ?>
                    <div class="items">
                      <div class="header">
                        <h3 class="week-date">
                          <span><?php echo $first_day_number . ((ICL_LANGUAGE_CODE == "fr") ? " au " : " to ") . $last_day_number . " " . $monthName?></span>

                          <div class="body">
                            <?php if ($concert_week["concerts"]): ?>
                            <?php foreach ($concert_week["concerts"] as $concert): ?>
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
                              $is_off_bach = isOffBach($concert["concert_types"]) ? "off-bach" : "bach";
                              //$is_off_bach = "bach";
                            ?>
                            <div
                              class="item concert-card shadow live piano <?php echo $concert_is_full ? "complete" : ""; ?> <?php echo $concert_is_free; ?> <?php echo $is_off_bach ?> <?php if ( $is_off_bach == "off-bach" ) { echo "hidden"; }?>">
                              <div class="header">
                                <div class="sections">
                                  <div class="section section-image">
                                    <img <?php echo $concert_image["url"] ? "src=" . $concert_image["url"] : null; ?> alt="" />
                                  </div>
                                  <div class="section section-text bg-accent p-2 pl-3 pr-3">
                                    <div class="parts">
                                      <div class="part">
                                      <?php if ( $concert_is_free ) { ?>
                                          <p class=" title text-white text-uppercase pl-2"><?php echo  (ICL_LANGUAGE_CODE == "fr") ? "gratuit" : "free";?></p>
                                      <?php } ?>
                                      <?php if ( $concert_is_pre_opening ) { ?>
                                          <p class=" title text-white text-uppercase pl-2"><?php echo  (ICL_LANGUAGE_CODE == "fr") ? "pré-ouverture" : "pre-opening";?></p>
                                      <?php } ?>
                                      </div>
                                      <div class="part part-bach">
                                        <img
                                          src="<?php echo get_stylesheet_directory_uri(); ?>/images/logos/<?php echo $is_off_bach;?>.png"
                                          alt="">
                                      </div>
                                      <div class="part part-off-bach">
                                        <img
                                          src="<?php echo get_stylesheet_directory_uri(); ?>/images/logos/<?php echo $is_off_bach;?>.png"
                                          alt="">
                                      </div>
                                    </div>
                                  </div>

                                  <div class="section section-complete bg-accent pl-3 pr-3 pt-2 pb-2">
                                    <p class="text-white text-uppercase normal">
                                      <?php echo  (ICL_LANGUAGE_CODE == "fr") ? "complet" : "full";?>
                                    </p>
                                  </div>

                                  <a href="<?php echo get_permalink($concert_id);?>">
                                    <div class="section section-hover bg-accent-soft">
                                      <div class="part">
                                        <p class="text-white text-capitalize normal">
                                          <?php echo  (ICL_LANGUAGE_CODE == "fr") ? "découvrir" : "discover";?></p>
                                        <i class="title fal fa-angle-right pl-2"></i>
                                      </div>
                                    </div>
                                  </a>
                                </div>
                              </div>
                              <div class="body p-4 pb-5">
                                <div class="sections">
                                  <div class="section pb-3">
                                    <p class="title text-dark text-uppercase bold"><?php echo $concert_title;?></p>
                                    <p class="title text-dark text-uppercase normal"><?php echo $concert_sub_title;?></p>
                                  </div>
                                  <div class="section section-details">
                                    <div class="parts">
                                      <?php if($hall): ?>
                                        <div class="part part-location pb-2">
                                          <i class="title fas fa-map-marker-alt text-dark normal mr-4"></i>
                                          <h5 class="title text-dark text-uppercase normal"><?php echo $hall["name"];?></h5>
                                        </div>
                                      <?php endif; ?>
                                      <div class="part part-date pb-2 ">
                                        <i class="title fas fa-calendar-alt text-dark normal mr-4"></i>
                                        <h5 class="title text-dark bold"><?php echo $day_of_week;?> - <?php echo $concert_date;?></h5>
                                      </div>

                                      <?php if($concert_is_live): ?>
                                      <div class="part part-status pb-2">
                                        <i class="fa fa-circle" aria-hidden="true"></i>
                                        <h5 class="title text-dark text-capitalize normal">
                                          <?php echo  (ICL_LANGUAGE_CODE == "fr") ? "direct disponible" : "direct available";?>
                                        </h5>
                                      </div>
                                      <?php endif;?>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <?php endforeach; ?>
                            <?php endif; ?>
                          </div>
                        </h3>
                      </div>
                    </div>
                  <?php endif; ?>
                <?php endforeach; ?>
              </div>
            <?php endif;?>
          <?php endforeach; ?>
          <!-- <div class="header">
            <div class="year-intro">
              <p class="year-intro-title">
                <?php /*echo ICL_LANGUAGE_CODE == "fr" ? "fin des festivals bach et off-bach montréal " . $year : "end of festival bach montréal and off-festival bach " . $year;*/ ?>
              </p>
            </div>
          </div> -->
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<?php
  // return if the concert is off-bach
  function isOffBach($concert_types) {
    foreach($concert_types as $concert_type) {
      if($concert_type->term_id == 51 || $concert_type->term_id == 71) {
        return true;
      }
    }
    return false;
  }
?>

<?php
  // Convert a date or timestamp into French.
  function dateToFrench($date, $format) 
{
    $english_days = array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
    $french_days = array('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche');
    $english_months = array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
    $french_months = array('janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre');
    return str_replace($english_months, $french_months, str_replace($english_days, $french_days, date($format, strtotime($date) ) ) );
}
?>

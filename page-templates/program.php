<?php 
/** 
 * Template Name: Program
 *
 * The template for displaying the program page
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

require(get_stylesheet_directory() . '/inc/params-from-url.php');
require(get_stylesheet_directory() . '/inc/merge-post-acf-fields.php');

/*
** DESC: Get the instruments taxonomy terms
*/
function get_taxonomy_terms($taxonomy_slug) {
  return get_terms( array(
    'taxonomy' => $taxonomy_slug,
    'hide_empty' => false
  ));
}

$instruments_taxonomy_terms =  get_taxonomy_terms('instruments');
$concert_categories_taxonomy_terms =  get_taxonomy_terms('concert_categories');

/*
** DESC: URL Parameters Configuration
*/
$filter_from_URL = new ParamsFromURL();
$filter_from_URL->set_parameters_by_name('instrument', Array("concert-category"));
$filter_from_URL->set_parameters_by_name('concert-category', Array("instrument"));
$parameters_matches = $filter_from_URL->get_parameters_from_URL();
$instrument_matches = $parameters_matches["instrument"];
$concert_category_matches = $parameters_matches["concert-category"];


/*
** DESC: get concerts
*/
$concerts = MergePostAndACFFields::withPostsAndACFAndTaxonomies("concerts", "concert", Array("instruments", "concert_categories", "concert_types"));

/*
** DESC: adding instrument taxonomy icon; instrument_icon
*/
MergePostAndACFFields::addACFFieldsToTaxonomies($concerts, "instruments", "instrument_icon");

/*
** DESC: filter the concerts by instrument taxonomy
*/
$concerts = MergePostAndACFFields::filterArrayByTaxonomy($concerts, "instruments", $instrument_matches);
$concerts = MergePostAndACFFields::filterArrayByTaxonomy($concerts, "concert_categories", $concert_category_matches);

/*
** DESC: Remove concerts without date
*/
$concerts = array_filter($concerts, 'withDate');

/*
** DESC: Remove concerts that are not OffBach
*/
$concerts = array_filter($concerts, 'Off_Bach');

/*
** DESC: Remove the old concerts
*/
$forthcoming_concerts = array_reverse(array_filter($concerts, 'newConcerts'));

get_header();
?>

<div id="program">
  <?php
  // Main title
  get_template_part( 'global-templates/section-main-title'); 
  ?>

  <?php
  // Introduction
  get_template_part( 'global-templates/section-introduction'); 
  ?>

  <?php
  hm_get_template_part( 'partials/program/content-filter.php', ['parameters_matches' => $parameters_matches, 'taxonomy_terms' => ["instruments_taxonomy_terms" => $instruments_taxonomy_terms, "concert_categpories_taxonomy_terms" => $concert_categories_taxonomy_terms] ] );
  ?>

  <?php
  hm_get_template_part( 'partials/program/content-result.php', ['concerts' => $concerts, 'parameters_matches' => $parameters_matches, 'taxonomy_terms' => ["instruments_taxonomy_terms" => $instruments_taxonomy_terms, "concert_categories_taxonomy_terms" => $concert_categories_taxonomy_terms]]);
  ?>


  <?php
  // Partners
  get_template_part( 'global-templates/section-partners' );
  ?>

  <?php
  // Newsletter
  get_template_part( 'global-templates/section-newsletter' );
  ?>
</div>

<?php
get_footer();


function hm_get_template_part( $file, $template_args = array(), $cache_args = array() ) {
  $template_args = wp_parse_args( $template_args );
  $cache_args = wp_parse_args( $cache_args );
  if ( $cache_args ) {
      foreach ( $template_args as $key => $value ) {
          if ( is_scalar( $value ) || is_array( $value ) ) {
              $cache_args[$key] = $value;
          } else if ( is_object( $value ) && method_exists( $value, 'get_id' ) ) {
              $cache_args[$key] = call_user_method( 'get_id', $value );
          }
      }
      if ( ( $cache = wp_cache_get( $file, serialize( $cache_args ) ) ) !== false ) {
          if ( ! empty( $template_args['return'] ) )
              return $cache;
          echo $cache;
          return;
      }
  }
  $file_handle = $file;
  do_action( 'start_operation', 'hm_template_part::' . $file_handle );
  if ( file_exists( get_stylesheet_directory() . '/' . $file . '.php' ) )
      $file = get_stylesheet_directory() . '/' . $file . '.php';
  elseif ( file_exists( get_template_directory() . '/' . $file . '.php' ) )
      $file = get_template_directory() . '/' . $file . '.php';
  ob_start();
  $return = require( $file );
  $data = ob_get_clean();
  do_action( 'end_operation', 'hm_template_part::' . $file_handle );
  if ( $cache_args ) {
      wp_cache_set( $file, $data, serialize( $cache_args ), 3600 );
  }
  if ( ! empty( $template_args['return'] ) )
      if ( $return === false )
          return false;
      else
          return $data;
  echo $data;
}

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

function withDate($concert) {
  return $concert['concert_date_time'] == "" ? false : true;
}

function Off_Bach($concert) {
  return $concert["off_bach_type"] == "" || $concert["off_bach_type"] == "non-applicable"  ? true : false;
}
?>



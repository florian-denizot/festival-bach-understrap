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
require(get_stylesheet_directory() . '/inc/filter-helper.php');

$instruments_taxonomy_terms =  get_taxonomy_terms('instruments');
$categories_taxonomy_terms =  get_taxonomy_terms('concert_categories');

$concert_type = get_field('concert_type');

// Get the list of Halls
$hallQuery = new WP_Query(
  array(
    'post_type' => 'halls',
    'posts_per_page' => -1,
    'post_status' => 'publish',
  ),
);

$halls = array();
if ( $hallQuery->have_posts() ) {

  while ( $hallQuery->have_posts() ) {
		$hallQuery->the_post();
    $halls[] = array(
      "id" => get_the_ID(),
      "title" => get_the_title(),
      "slug" => get_post_field( 'post_name', get_post() )
    );
  }
}
wp_reset_postdata();


// Setup URL Parameters
$filter_from_URL = new ParamsFromURL();
$filter_from_URL->set_parameters_by_name('instrument', Array("concert_category", "hall"));
$filter_from_URL->set_parameters_by_name('concert_category', Array("instrument", "hall"));
$filter_from_URL->set_parameters_by_name('hall', Array("instrument", "category"));

$parameters_matches = $filter_from_URL->get_parameters_from_URL();
$instrument_matches = isset($parameters_matches["instrument"]) ? $parameters_matches["instrument"] : null;
$concert_category_matches = isset($parameters_matches["concert_category"]) ? $parameters_matches["concert_category"] : null;
$hall_matches = isset($parameters_matches["hall"]) ? $parameters_matches["hall"] : null;

// Get the concertlist
$concerts = MergePostAndACFFields::withPostsAndACFAndTaxonomies("concerts", "concert", Array("instruments", "concert_categories", "concert_types"));

// Filter the concerts by taxonomies
$concerts = MergePostAndACFFields::filterArrayByTaxonomy($concerts, "concert_types", array($concert_type));
$concerts = MergePostAndACFFields::filterArrayByTaxonomy($concerts, "instruments", $instrument_matches);
$concerts = MergePostAndACFFields::filterArrayByTaxonomy($concerts, "concert_categories", $concert_category_matches);

// Filter the concerts by halls
$concerts = FilterHelper::filterArrayByRelation($concerts, "concert_hall", $hall_matches);

// Remove concerts without date
$concerts = array_filter($concerts, 'withDate');

// Remove the old concerts
$forthcoming_concerts = array_reverse(array_filter($concerts, 'newConcerts'));

// Flag that determines if the filter box should be opened of closed
$collapse_filters = is_array($hall_matches) && is_array($concert_category_matches) && is_array($instrument_matches) && 
      (count($hall_matches) + count($concert_category_matches) + count($instrument_matches)) ? 
      false : true;

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
  // Filters
  $args = array(
    'parameters_matches' => $parameters_matches, 
    'taxonomy_terms' => [
      "instruments_taxonomy_terms" => $instruments_taxonomy_terms, 
      "categories_taxonomy_terms" => $categories_taxonomy_terms],
    'halls' => $halls,
    'collapse_filters' => $collapse_filters
  );
  get_template_part( 'page-templates/partials/program/filters', null, $args );
  ?>

  <?php
  // Concert list
  $args = array(
    "concerts" => $concerts
  );
  get_template_part( 'page-templates/partials/program/concert-list', null, $args );
  ?>

  <?php
  // Information
  get_template_part( 'page-templates/partials/program/information', null, $args );
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

/**
 * Check if a concert is after the current date
 * @param mixed $concert The concert
 * @return bool True if the concert is after the current date, false otherwise
 */
function newConcerts($concert) {
  $concert_date_time = new DateTime($concert['concert_date_time'], new DateTimeZone("US/Eastern"));
  $concert_date_time_strtotime = strtotime($concert_date_time->format("Y-m-d H:i:s"));

  $now_date_time = new DateTime("now", new DateTimeZone("US/Eastern"));
  $now_date_time_strtotime = strtotime($now_date_time->format("Y-m-d H:i:s"));

  return ($concert_date_time_strtotime >= $now_date_time_strtotime);
}

/**
 * Check if a concert has a date defined
 * @param mixed $concert The Concert
 * @return bool True if a date is defined, false otherwise
 */
function withDate($concert) {
  return $concert['concert_date_time'] == "" ? false : true;
}

/**
 * Get the instruments taxonomy terms
 * @param mixed $taxonomy_slug
 * @return array|string|WP_Error
 */
function get_taxonomy_terms($taxonomy_slug) {
  return get_terms( array(
    'taxonomy' => $taxonomy_slug,
    'hide_empty' => false
  ));
}
?>



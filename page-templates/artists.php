<?php 
/** 
 * Template Name: Artists
 *
 * The template for displaying the artist page
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();
?>

<div id="artists">
  <?php
  // Main title
  get_template_part( 'global-templates/section-main-title'); 
  ?>

  <?php
  // Menu
  get_template_part( 'page-templates/partials/artists/menu'); 
  ?>

  <?php
  // Introduction
  get_template_part( 'global-templates/section-introduction'); 
  ?>

  <?php
  // Invited Artists
  $args = array(
    "data" => get_field('invited_artists'),
    "id" => "artists-invited",
    "anchor" => "artists-invited-a"
  );

  get_template_part( 'page-templates/partials/artists/artists', null, $args); 
  ?>

  <?php
  // Previous Artists
  $args = array(
    "data" => get_field('previous_artists'),
    "id" => "artists-previous",
    "anchor" => "artists-previous-a",
    "class" => "text-bg-black"
  );
  get_template_part( 'page-templates/partials/artists/artists', null, $args); 
  ?>

  <?php
  // Artist Modal
  get_template_part( 'page-templates/partials/orchestra/component-artist-modal'); 
  ?>

  <?php
  // Photo Gallery
  get_template_part( 'page-templates/partials/artists/photo-gallery'); 
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
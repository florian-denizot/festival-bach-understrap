<?php 
/** 
 * Template Name: About
 *
 * The template for displaying the about page
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();

$container = get_theme_mod( 'understrap_container_type' );
?>
<div id="about">
  <?php
  // Program hero section 
  get_template_part( 'page-templates/partials/main-title'); 
  ?>

  <?php
  // Do the left sidebar check and open div#primary.
  get_template_part( 'page-templates/partials/about/summary' );
  ?>

  <?php
  // Do the left sidebar check and open div#primary.
  get_template_part( 'page-templates/partials/about/history' );
  ?>

  <?php
  // Do the left sidebar check and open div#primary.
  get_template_part( 'page-templates/partials/about/numbers' );
  ?>

<?php
  // Do the left sidebar check and open div#primary.
  get_template_part( 'page-templates/partials/about/mission' );
  ?>
</div>



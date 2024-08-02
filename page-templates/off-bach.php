<?php 
/** 
 * Template Name: Off-Bach
 *
 * The template for displaying the off Bach page
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();
?>

<div id="off-bach">
  <?php
  // Main title
  get_template_part( 'global-templates/section-main-title'); 
  ?>

  <?php
  // Program
  get_template_part( 'page-templates/partials/off-bach/menu'); 
  ?>

  <?php
  // Program
  get_template_part( 'page-templates/partials/off-bach/program'); 
  ?>

  <?php
  // About
  get_template_part( 'page-templates/partials/off-bach/about'); 
  ?>

  <?php
  // The Word of the Artistic Director
  get_template_part( 'page-templates/partials/off-bach/artistic-director'); 
  ?>

  <?php
  // Infos
  get_template_part( 'page-templates/partials/off-bach/infos'); 
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
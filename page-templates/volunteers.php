<?php 
/** 
 * Template Name: Volunteers
 *
 * The template for displaying the volunteer page
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();
?>

<div id="volunteers">
  <?php
  // Main title
  get_template_part( 'global-templates/section-main-title'); 
  ?>

  <?php
  // Menu
  get_template_part( 'global-templates/section-page-menu' );
  ?>

  <?php
  // Introduction
  get_template_part( 'global-templates/section-introduction'); 
  ?>

<?php
  // Au coeur du Festival
  get_template_part( 'page-templates/partials/volunteers/gallery');
  ?>

  <?php
  // Témoignage
  get_template_part( 'page-templates/partials/volunteers/testimonies');
  ?>

  <?php
  // Contact
  get_template_part( 'page-templates/partials/volunteers/contact' );
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
<?php 
/** 
 * Template Name: Partners
 *
 * The template for displaying the partner page
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();
?>

<div id="partners-page">
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
  // Call to action
  get_template_part( 'page-templates/partials/partners/partners' );
  ?>

<?php
  // Other Pages
  $args = [];
  get_template_part( 'global-templates/section-other-pages', null, $args);
  ?>

  <?php
  // Newsletter
  get_template_part( 'global-templates/section-newsletter' );
  ?>
</div>

<?php
get_footer();



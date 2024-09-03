<?php 
/** 
 * Template Name: FAQ
 *
 * The template for displaying the FAQ page
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();
?>

<div id="donate">
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
  // FAQ
  get_template_part( 'page-templates/partials/faq/faq' );
  ?>

  <?php
  // Contact
  get_template_part( 'global-templates/section-contact');
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

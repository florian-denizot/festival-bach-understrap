<?php 
/** 
 * Template Name: Donate
 *
 * The template for displaying the donate page
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
  // Call to action
  get_template_part( 'page-templates/partials/donate/call-to-action' );
  ?>

  <?php
  // Arguments
  get_template_part( 'page-templates/partials/donate/arguments' );
  ?>

  <?php
  // Donate
  get_template_part( 'page-templates/partials/donate/donate' );
  ?>

  <?php
  // FAQ
  get_template_part( 'page-templates/partials/donate/faq' );
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



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
?>

<div id="about">
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
  // History
  // Discover Montreal
  $args = [
    'class' => "text-bg-light",
    'id'    => 'about-history'
  ];
  get_template_part( 'page-templates/partials/about/history', null, $args );
  ?>

  <?php
  // The festival in numbers
  get_template_part( 'page-templates/partials/about/numbers' );
  ?>

  <?php
  // Our mission
  get_template_part( 'page-templates/partials/about/mission' );
  ?>

  <?php
  // Our Values
  get_template_part( 'page-templates/partials/about/values' );
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



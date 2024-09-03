<?php 
/** 
 * Template Name: Festivalgoers
 *
 * The template for displaying the festivalgoers page
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();
?>

<div id="festivalgoers">
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
  // Meet
  $data = get_field('meet');
  $args = [
    'title' => $data['title'],
    'cards' => $data['cards'],
    'class' => 'text-bg-black',
    'id'    => 'festivalgoers-meet'
  ];
  get_template_part( 'page-templates/partials/festivalgoers/meet', null, $args);
  ?>

  <?php
  // Discover Montreal
  $data = get_field('discover');
  $args = [
    'title' => $data['title'],
    'content' => $data['content'],
    'id'    => 'festivalgoers-discover'
  ];
  get_template_part( 'page-templates/partials/festivalgoers/discover', null, $args);
  ?>

  <?php
  // Contact
  $args = [
    'id' => 'festivalgoers-contact',
    'class' => 'text-bg-light'
  ];
  get_template_part( 'global-templates/section-contact', null, $args);
  ?>

  <?php
  // Other Pages
  $args = [];
  get_template_part( 'global-templates/section-other-pages', null, $args);
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



<?php 
/** 
 * Template Name: Media
 *
 * The template for displaying the media page
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();
?>

<div id="media">
  <?php
  // Main title
  get_template_part( 'global-templates/section-main-title' ); 
  ?>

  <?php
  // Menu
  get_template_part( 'global-templates/section-page-menu' ); 
  ?>

  <?php
  // News
  get_template_part( 'page-templates/partials/media/section-news' ); 
  ?>

  <?php
  // Galeries
  get_template_part( 'page-templates/partials/media/section-galeries' ); 
  ?>

  <?php
  // Quote
  $args = [
    'id' => 'media-quote',
    'quote_class' => 'text-bg-light'
  ];
  get_template_part( 'global-templates/section-quote', null, $args); 
  ?>

  <?php
  // Newspapers
  get_template_part( 'page-templates/partials/media/section-newspapers' ); 
  ?>

  <?php
  // Socials
  get_template_part( 'page-templates/partials/media/section-socials' ); 
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
<?php 
/** 
 * Template Name: Orchestra and choir
 *
 * The template for displaying the orchestra and choir page
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();
?>

<div id="orchestra">
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
  get_template_part( 'page-templates/partials/orchestra/section-history'); 
  ?>

  <?php
  // Orchestra artists by instruments
  $args = array(
    'data'=> get_field('orchestra'),
    'id' => 'orchestra-instrument-artists',
    'group_name'=> 'orchestra',
    'category_name' => 'instrument',
    'class' => ''
  );
  get_template_part( 'page-templates/partials/orchestra/section-artist-categories', null, $args); 
  ?>

  <?php
  // Choir artists by voice type
  $args = array(
    'data'=> get_field('choir'),
    'id' => 'orchestra-voice-artists',
    'group_name'=> 'choir',
    'category_name' => 'voice',
    'class' => 'text-bg-light'
  );
  get_template_part( 'page-templates/partials/orchestra/section-artist-categories', null, $args); 
  ?>

  

  <?php
  // Artist Modal
  get_template_part( 'page-templates/partials/orchestra/component-artist-modal'); 
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
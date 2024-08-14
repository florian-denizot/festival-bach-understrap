<?php 
/** 
 * Template Name: Team
 *
 * The template for displaying the team page
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();
?>

<div id="team">
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
  // Conseil d'administration
  $args = array (
    "data" => get_field('admin_board'),
    "class" => 'text-bg-primary',
    "id" => "team-board"
  );
  get_template_part( 'page-templates/partials/team/staff', null, $args);
  ?>

  <?php
  // Equipe
  $args = array (
    "data" => get_field('team'),
    "id" => "team-staff"
  );
  get_template_part( 'page-templates/partials/team/staff', null, $args);
  ?>

  <?php
  // Contact
  get_template_part( 'page-templates/partials/team/contact' );
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



<?php 
/** 
 * The template for displaying a concert page
 *
 * @package understrap/understrap-child
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();
?>

<div id="concert">
  

  <?php
  // Main title
  get_template_part( 'page-templates/partials/concert/main-title'); 
  ?>

<?php
  // Main title
  get_template_part( 'page-templates/partials/concert/content'); 
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
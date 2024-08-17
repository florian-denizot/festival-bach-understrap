<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$concert = get_field('concert');
$title = $concert["concert_title"];
$image_url = isset($concert["concert_image"]["url"]) ? $concert["concert_image"]["url"] : false;
?>

<section id="main-heading" 
      class="top-block" 
      style="background-image:url('<?php echo $image_url ? $image_url :  get_stylesheet_directory_uri() . '/images/main-title-bg.jpg'?>')">
  <div class="main-heading-wrapper">
    <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
      <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-10 main-heading-content">
          <h1 class="display-1"><?php echo $title; ?></h1>
          <div class="underline my-4"></div>
        </div>
      </div>
    </div>
  </div>
</section>
<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('socials'); 

$title = $data['title'];
// $icons = $data['icons'];
$instaShortcode = $data['instagram_shortcode'];
$youtubeShortcode = $data['youtube_shortcode'];
$facebookShortcode = $data['facebook_shortcode'];

?>

<section id="media-socials" class="py-9 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-6"><?php echo $title; ?></h2>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          <!-- <div class="col">
            <ul class="fs-1 list-inline list-unstyled">
              <?php /*foreach($icons as $icon): ?>
                <?php if( isset($icon['link']) && isset($icon['fa-icon']) ) : ?>
                  <li class="list-inline-item">
                    <a href="<?php echo $icon['link']; ?>" target="_blank" class="link-dark">
                      <?php echo $icon['fa-icon']; ?>
                    </a>
                  </li>
                <?php endif; ?>
              <?php endforeach; */?>
            </ul>
          </div> -->
          <div class="col">
            <h3 class="text-center">
              <i class="fab fa-instagram" aria-hidden="true"></i> Instagram
            </h3>
            <?php echo do_shortcode($instaShortcode); ?>
          </div>
          <div class="col">
            <h3 class="text-center">
              <i class="fab fa-youtube" aria-hidden="true"></i> Youtube
            </h3>
            <?php echo do_shortcode($youtubeShortcode); ?>
          </div>
          <div class="col">
            <h3 class="text-center">
              <i class="fab fa-facebook" aria-hidden="true"></i> Facebook
            </h3>
            <?php echo do_shortcode($facebookShortcode); ?>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
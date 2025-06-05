<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$section = get_field('playlist');
$class = isset($args['class']) ? $args['class'] :'';

if($section && is_array($section) && $section['display_playlist'] ) :
  $heading = $section['playlist_heading'] ? $section['playlist_heading'] : false;
  $playlistCode = $section['playlist_url'] ? $section['playlist_url'] : false;
  $image = $section['playlist_image'] ? $section['playlist_image'] : false;
?>

  <section id="home-playlist" class="py-9 anchor <?php echo $class; ?>">
    <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
      <div class="row">
        <div class="col">
          <h2 class="mb-6"><?php echo esc_html($heading); ?></h2>
        </div>
      </div>
      <div class="row g-0" style="height:400px;">
        <?php if($image): ?>
          <div class="d-none d-lg-block col-lg-6">
            <img class="playlist-image h-100 w-100 object-fit-cover" src="<?php echo $image['url']; ?>"/>
          </div>
        <?php endif; ?>
        <div class="<?php echo $image ? 'col-lg-6' : 'col' ?>">
          <iframe
            src="<?php echo $playlistCode; ?>"
            width="100%"
            height="100%"
            class="">
            <p>Your browser does not support iframes.</p>
          </iframe>
        </div>
      </div>
    </div>
  </section>

<?php endif; ?>
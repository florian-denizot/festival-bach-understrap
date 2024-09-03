<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = $args['data'];

$title = $data['title'];
$artists = $data['artists'];

$id = isset($args['id']) ? $args['id'] : 'artists-artists';
$class = isset($args['class']) ? $args['class'] : '';
?>

<section id="<?php echo $id; ?>" class="py-9 anchor <?php echo $class; ?>">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-6"><?php echo $title; ?></h2>
        
        <?php
        $args = [
          'artists' => $artists,
          'rowClass' => 'row-cols-1 row-cols-md-2 row-cols-lg-4', 
          'imageRatio' => 'ratio-1x1' 
        ];
        get_template_part('global-templates/content-artist-grid', null, $args);
        ?>
        
      </div>
    </div>
  </div>
</section>
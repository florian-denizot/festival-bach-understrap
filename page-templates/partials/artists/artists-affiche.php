<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = $args['data'];

$title = isset($data['title']) ? $data['title'] : false;
$artists = isset($data['artists']) ? $data['artists'] : false;
$button = isset($data['program_button']) ? $data['program_button'] : false;

$id = isset($args['id']) ? $args['id'] : 'artists-artists';
$class = isset($args['class']) ? $args['class'] : '';

if(is_array($artists) && count($artists)):
?>

<section id="<?php echo $id; ?>" class="py-9 anchor <?php echo $class; ?>">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">

        <?php if($title): ?>
          <h2 class="mb-6"><?php echo $title; ?></h2>
        <?php endif; ?>
        
        <?php
        $args = [
          'artists' => $artists,
          'rowClass' => 'row-cols-1 row-cols-md-2 row-cols-lg-4 mb-3', 
          'imageRatio' => 'ratio-1x1' 
        ];
        get_template_part('global-templates/content-artist-grid', null, $args);
        ?>
        
        <?php if($button): ?>
          <a href="<?php echo $button['url']; ?>" class="btn btn-outline-primary">
            <?php echo $button['title']; ?>
          </a>
        <?php endif; ?>

      </div>
    </div>
  </div>
</section>
<?php endif; ?>
<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = $args['data'];

$groupName = $args['group_name'] ? $args['group_name'] : 'orchestra';
$categoryName = $args['category_name'] ? $args['category_name'] : 'instrument';

$title = $data['title'];
$group = $data[$groupName];

$id = isset($args['id']) ? $args['id'] : 'orchestra-instrument-artists';
$class = isset($args['class']) ? $args['class'] : '';
?>

<section id="<?php echo $id; ?>" class="py-9 anchor <?php echo $class; ?>">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-6"><?php echo $title; ?></h2>
        
        <?php if($group && is_array($group) && count($group)): ?>

          <?php foreach($group as $category): ?>
            
            <h3><?php echo $category[$categoryName]; ?></h3>
            
            <?php
            $args = ['artists' => $category['artists']];
            get_template_part('global-templates/content-artist-grid', null, $args);
            ?>

          <?php endforeach; ?>

        <?php endif; ?>

      </div>
    </div>
  </div>
</section>


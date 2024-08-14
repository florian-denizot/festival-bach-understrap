<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = $args['data'];

$title = $data['title'];
$categories = $data['category'];

$class = isset($args['class']) ? $args['class'] : '';
$id = isset($args['id']) ? $args['id'] : '';


if($categories && is_array( $categories ) && count( $categories ) > 0) :
?>
<section id="<?php echo $id; ?>" 
      class="py-7 anchor <?php echo $class; ?>">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <h2 class="mb-4"><?php echo $title; ?></h2>
        <div>
          <?php foreach($categories as $category): ?>

            <div><?php echo $category['title']; ?></div>
            
            <ul class="list-unstyled">
              <?php foreach($category['staff'] as $staff): ?>
                <li>
                  <h6>
                    <?php echo $staff['name']; ?>
                    <small><?php echo $staff['extra_infos'] ? ', ' . $staff['extra_infos'] : ''; ?></small>
                  </h6>
                </li>
              <?php endforeach; ?>
            </ul>

          <?php endforeach; ?>
        </div>
      </div>
    </div>
  </div>
</section>

<?php endif; ?>
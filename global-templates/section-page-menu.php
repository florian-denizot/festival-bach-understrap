<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$menu = get_field('menu');

if($menu && is_array($menu) && $menu['display_menu'] && $menu['menu_items'] && is_array($menu['menu_items']) && count($menu['menu_items'])) :
  $menuItems = $menu['menu_items'];
?>

<section id="menu-page" class="pt-5 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <ul class="list-inline text-uppercase">
          <?php foreach($menuItems as $menuItem) : ?>
            <li class="list-inline-item mb-3">
              <a href="#<?php echo esc_html($menuItem['anchor']); ?>" class="btn btn-outline-primary">
                <?php echo esc_html($menuItem['label']); ?>
              </a>
            </li>
          <?php endforeach; ?>
        </ul>
      </div>
    </div>
  </div>
</section>

<?php endif; ?>
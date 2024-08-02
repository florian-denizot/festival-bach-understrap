<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

$pblocks = get_field('permanent_blocks');

if($pblocks):
  $block1 = $pblocks['block_1'];
  $block2 = $pblocks['block_2'];
  $block3 = $pblocks['block_3'];
  $block4 = $pblocks['block_4'];
  $block5 = $pblocks['block_5'];
  $block6 = $pblocks['block_6'];
  $block7 = $pblocks['block_7'];
  $block8 = $pblocks['block_8'];
?>
<section id="home-permanent-blocks" class="py-7 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row justify-content-center">
      <div class="col">

        <div class="grid" style="--bs-columns: 12;">

          <div id="block1" class="block">
            <h3>
              <a href="<?php echo esc_attr($block1['link']); ?>"
                  style="background-image:url('<?php echo esc_url($block1['image']['url']); ?>');">
                <span><?php echo esc_html($block1['title']); ?></span>
              </a>
            </h3>
          </div>

          <div id="block2" class="block">
          <h3>  
              <a href="<?php echo esc_attr($block2['link']); ?>"
                  style="background-image:url('<?php echo esc_url($block2['image']['url']); ?>');">
                <span><?php echo esc_html($block2['title']); ?></span>
              </a>
            </h3>
          </div>

          <div id="block3" class="block">
          <h3>
            <a href="<?php echo esc_attr($block4['link']); ?>"
                style="background-image:url('<?php echo esc_url($block4['image']['url']); ?>');">
              <span><?php echo esc_html($block4['title']); ?></span>
            </a>
          </h3>
          </div>

          <div id="block4" class="block">
            <h3>
              <a href="<?php echo esc_attr($block3['link']); ?>"
                  style="background-image:url('<?php echo esc_url($block3['image']['url']); ?>');">
                <span><?php echo esc_html($block3['title']); ?></span>
              </a>
            </h3>
          </div>

          <div id="block5" class="block">
            <h3>
              <a href="<?php echo esc_attr($block5['link']); ?>"
                  style="background-image:url('<?php echo esc_url($block5['image']['url']); ?>');">
                <span><?php echo esc_html($block5['title']); ?></span>
              </a>
            </h3>
          </div>

          <div id="block6" class="block">
            <h3>
              <a href="<?php echo esc_attr($block6['link']); ?>"
                  style="background-image:url('<?php echo esc_url($block6['image']['url']); ?>');">
                <span><?php echo esc_html($block6['title']); ?></span>
              </a>
            </h3>
          </div>

          <div id="block7" class="block">
            <h3>
              <a href="<?php echo esc_attr($block7['link']); ?>"
                  style="background-image:url('<?php echo esc_url($block7['image']['url']); ?>');">
                <span><?php echo esc_html($block7['title']); ?></span>
              </a>
            </h3>
          </div>

          <div id="block8" class="block">
            <h3>
              <a href="<?php echo esc_attr($block8['link']); ?>"
                  style="background-image:url('<?php echo esc_url($block8['image']['url']); ?>');">
                <span><?php echo esc_html($block8['title']); ?></span>
              </a>
            </h3>
          </div>

        </div> <!-- #permanent-blocks -->
      </div>
    </div>
  </div>
</section>

<?php
endif;
?>
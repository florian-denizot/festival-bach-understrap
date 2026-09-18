<?php
/**
 * Image Slider Partial
 *
 * Partial template for displaying an image slider on the home page.
 *
 * @package festival-bach-understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

// Retrieve the slider data from ACF on the Home page.
$slider_data = get_field( 'image_slider' );
if ( ! $slider_data ) {
	$slider_data = get_field( 'slider' );
}

if ( ! $slider_data ) {
	return;
}

// Option to show or hide the section (defaults to true if not explicitly set to false).
$display = true;
if ( is_array( $slider_data ) ) {
	if ( isset( $slider_data['display'] ) ) {
		$display = (bool) $slider_data['display'];
	} elseif ( isset( $slider_data['display_slider'] ) ) {
		$display = (bool) $slider_data['display_slider'];
	}
} else {
	$display_field = get_field( 'display_image_slider' );
	if ( $display_field === null ) {
		$display_field = get_field( 'display_slider' );
	}
	if ( $display_field !== null ) {
		$display = (bool) $display_field;
	}
}

if ( ! $display ) {
	return;
}

// Resolve items/images from the ACF field.
$items = array();
if ( is_array( $slider_data ) ) {
	if ( isset( $slider_data['images'] ) && is_array( $slider_data['images'] ) ) {
		$items = $slider_data['images'];
	} elseif ( isset( $slider_data['slides'] ) && is_array( $slider_data['slides'] ) ) {
		$items = $slider_data['slides'];
	} elseif ( isset( $slider_data['gallery'] ) && is_array( $slider_data['gallery'] ) ) {
		$items = $slider_data['gallery'];
	} elseif ( isset( $slider_data[0] ) ) {
		$items = $slider_data;
	}
} else {
	$items = get_field( 'image_slider_images' ) ?: get_field( 'slider_images' );
}

if ( empty( $items ) || ! is_array( $items ) ) {
	return;
}

$section_id    = ! empty( $args['id'] ) ? $args['id'] : 'home-image-slider';
$section_class = ! empty( $args['class'] ) ? $args['class'] : 'py-5 text-bg-primary';
?>

<!-- ******************************* Image slider section **************************************** -->
<section id="<?php echo esc_attr( $section_id ); ?>" class="<?php echo esc_attr( $section_class ); ?>">
  <div class="<?php echo esc_attr( $container ); ?>">
    <div class="row">
      <div class="col">
        <div class="image-carousel">

          <?php foreach ( $items as $item ) : ?>
            <?php
            $img_url     = '';
            $img_alt     = '';
            $link_url    = '';
            $link_target = '';
            $height      = '';
            $caption     = '';

            if ( is_array( $item ) ) {
				// Image resolution.
				if ( isset( $item['image'] ) ) {
					if ( is_array( $item['image'] ) ) {
						$img_url = $item['image']['url'] ?? '';
						$img_alt = $item['image']['alt'] ?? '';
					} elseif ( is_numeric( $item['image'] ) ) {
						$img_url = wp_get_attachment_image_url( $item['image'], 'full' ) ?: '';
						$img_alt = get_post_meta( $item['image'], '_wp_attachment_image_alt', true ) ?: '';
					} elseif ( is_string( $item['image'] ) ) {
						$img_url = $item['image'];
					}
				} elseif ( isset( $item['url'] ) ) {
					// ACF Gallery item or direct image array.
					$img_url = $item['url'];
					$img_alt = $item['alt'] ?? '';
				}

				// Link resolution.
				if ( isset( $item['link'] ) ) {
					if ( is_array( $item['link'] ) ) {
						$link_url    = $item['link']['url'] ?? '';
						$link_target = $item['link']['target'] ?? '';
					} elseif ( is_string( $item['link'] ) ) {
						$link_url = $item['link'];
					}
				}

				// Height & caption/name.
				$height  = $item['height'] ?? '';
				$caption = $item['caption'] ?? ( $item['name'] ?? ( $item['title'] ?? '' ) );
            } elseif ( is_numeric( $item ) ) {
				// Attachment ID.
				$img_url = wp_get_attachment_image_url( $item, 'full' ) ?: '';
				$img_alt = get_post_meta( $item, '_wp_attachment_image_alt', true ) ?: '';
            } elseif ( is_string( $item ) ) {
				// Direct URL.
				$img_url = $item;
            }

            // Skip item if there is no image and no caption text.
            if ( empty( $img_url ) && empty( $caption ) ) {
				continue;
            }
            ?>

            <div class="item <?php echo ! empty( $img_url ) ? 'image' : 'no-image'; ?>">
              <div>
                <?php if ( ! empty( $link_url ) ) : ?>
                  <a href="<?php echo esc_url( $link_url ); ?>" <?php if ( ! empty( $link_target ) ) : ?>target="<?php echo esc_attr( $link_target ); ?>" rel="noopener noreferrer"<?php endif; ?>>
                    <?php if ( ! empty( $img_url ) ) : ?>
                      <img src="<?php echo esc_url( $img_url ); ?>" alt="<?php echo esc_attr( $img_alt ); ?>" <?php if ( ! empty( $height ) ) : ?>style="max-height:<?php echo esc_attr( $height ); ?>"<?php endif; ?> />
                    <?php else : ?>
                      <p><?php echo esc_html( $caption ); ?></p>
                    <?php endif; ?>
                  </a>
                <?php else : ?>
                  <?php if ( ! empty( $img_url ) ) : ?>
                    <img src="<?php echo esc_url( $img_url ); ?>" alt="<?php echo esc_attr( $img_alt ); ?>" <?php if ( ! empty( $height ) ) : ?>style="max-height:<?php echo esc_attr( $height ); ?>"<?php endif; ?> />
                  <?php else : ?>
                    <p><?php echo esc_html( $caption ); ?></p>
                  <?php endif; ?>
                <?php endif; ?>
              </div>
            </div>

          <?php endforeach; ?>

        </div>
      </div>
    </div>
  </div>
</section>

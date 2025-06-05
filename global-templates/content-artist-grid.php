<?php 
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;
$artists = isset($args['artists']) && is_array($args['artists']) && count($args['artists']) ? $args['artists'] : false;
$rowClass =  isset($args['rowClass']) && !empty($args['rowClass']) ? $args['rowClass'] : 'row-cols-2 row-cols-sm-3 row-cols-lg-5 mb-5';
$imageRatio =  isset($args['imageRatio']) && !empty($args['imageRatio']) ? $args['imageRatio'] : 'ratio-3x4';
?>
<?php if($artists): ?>

  <div class="row <?php echo $rowClass; ?> g-2">

    <?php foreach($artists as $entry): ?>

      <?php $artist = get_field("artist", intval($entry)); ?>
      <?php $image = $artist['image']; ?>
      <?php $name = $artist['name']; ?>
      <?php $description = $artist['description']; ?>
      <?php
      $youtube = false;
      $spotify = false;
      $soundcloud = false;
      $website = false;
      $socials = isset($artist['socials']) && is_array($artist['socials']) && count($artist['socials']) ? $artist['socials'] : false;
      if($socials && count($socials)) :
        foreach($socials as $social) :
          switch($social['name']):
            case 'youtube': $youtube = $social['link']; break;
            case 'spotify': $spotify = $social['link']; break;
            case 'soundcloud': $soundcloud = $social['link']; break;
            case 'website': $website = $social['link']; break;
          endswitch;
        endforeach;
      endif;
      ?>


      <?php if( $artist && is_array($artist) ): ?>
        <?php if( $artist['image'] && is_array($artist['image']) && $artist['image']['url'] ): ?>

          <div class="col">
            
            <?php $image = $artist['image']; ?>
        
            <div class="artist-card ratio <?php echo $imageRatio; ?> shadow">
              <div>
                <?php if($artist['description'] && $artist['description'] !== ''): ?>
                  <a href="#artist-modal"
                      data-bs-toggle="modal" 
                      data-bs-name="<?php echo $artist['name']; ?>"
                      data-bs-image="<?php echo esc_url($artist['image']['url']); ?>"
                      data-bs-bio="<?php echo esc_html($artist['description']); ?>"
                      data-bs-youtube="<?php echo $youtube; ?>"
                      data-bs-spotify="<?php echo $spotify; ?>"
                      data-bs-soundcloud="<?php echo $soundcloud; ?>"
                      data-bs-website="<?php echo $website; ?>">
                <?php endif; ?>
                <div class="artist-image" style="background-image:url('<?php echo esc_url($artist['image']['url']); ?>')">

                  <div class="artist-content">
                    <h6><?php echo $artist['name']; ?></h6>
                  </div>

                </div>
                <?php if($artist['description'] && $artist['description'] !== ''): ?>
                  </a>
                <?php endif; ?>
              </div>
            </div>
          </div>

        <?php endif; ?>
      <?php endif; ?>

    <?php endforeach; ?>

  </div>
<?php endif; ?>
<?php function getSlides($data, $ratio) { ?>
  <?php foreach($data as $entry): ?>
    <?php if( $entry && is_array($entry) && $entry['url']): ?>
      <?php $image = $entry['url']; ?>
      <div class="item ratio <?php echo $ratio; ?>">
        <div class="p-1">
          <div class="image" style="background-image:url('<?php echo esc_url($entry['url']); ?>')">
          </div>
        </div>
      </div>
    <?php endif; ?>
  <?php endforeach; ?>
<?php } ?>
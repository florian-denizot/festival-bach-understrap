<?php
$title = get_field('newsletter_title', 'option');
$description = get_field('newsletter_description', 'option');
?>

<section id="newsletter" class="py-9 text-bg-primary">
  <div class="container">
    <div class="row">
      
      <div class="col-md-4">
        <h2><?php echo $title; ?></h2>
        <p><?php echo $description; ?></p>   
      </div>
      <div class="col-md-8">
        <?php echo do_shortcode('[contact-form-7 id="6" title="Newsletter"]'); ?>
      </div>
       
    </div>
  </div>
</section>
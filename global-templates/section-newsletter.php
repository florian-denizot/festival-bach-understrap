<?php
$title = get_field('newsletter_title', 'option');
$description = get_field('newsletter_description', 'option');
$form = get_field('newsletter_form', 'option');
?>

<section id="newsletter" class="py-9 text-bg-primary">
  <div class="container">
    <div class="row align-items-center">
      
      <div class="col-md-5">
        <img src="<?php echo get_stylesheet_directory_uri() . '/images/FIBM26---iPad-iPhone_450px.png'; ?>" class="img-fluid" alt="Festival Bach">
      </div>
      <div class="col-md-7">
        <h2><?php echo $title; ?></h2>
        <p><?php echo $description; ?></p>
        <?php echo do_shortcode('[contact-form-7 id="'. $form[0]->ID .'"]'); ?>
      </div>
       
    </div>
  </div>
</section>
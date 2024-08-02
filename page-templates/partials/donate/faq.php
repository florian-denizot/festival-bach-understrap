<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('faq'); 

$title = $data['title'];
$questions = $data['questions'];

if($questions && is_array( $questions ) && count( $questions ) > 0) :
?>
<section id="donate-faq" class="py-7 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <?php if($title): ?>
          <h2 class="mb-4"><?php echo $title; ?></h2>
        <?php endif; ?>
          
          <div class="accordion accordion-primary" id="accordionFAQ">
            <?php foreach($questions as $index => $question): ?>
              
                <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button class="accordion-button collapsed" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        aria-expanded="false" 
                        data-bs-target="#collapse<?php echo $index; ?>" 
                        aria-controls="collapse<?php echo $index; ?>">
                      <?php echo $question['question']; ?>
                    </button>
                  </h2>
                  <div id="collapse<?php echo $index; ?>" class="accordion-collapse collapse" data-bs-parent="#accordionFAQ">
                    <div class="accordion-body">
                    <?php echo $question['answer']; ?>
                    </div>
                  </div>
                </div>
              
            <?php endforeach; ?>
        </div>
      </div>
    </div>

  </div>
</section>

<?php endif; ?>
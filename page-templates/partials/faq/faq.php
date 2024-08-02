<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$data = get_field('faqs'); 

$title = $data['title'];
$groups = $data['groups'];


if($groups && is_array( $groups ) && count( $groups ) > 0) :
?>
<section id="faq-faq" class="py-7 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">

        <?php if($title): ?>
          <h2 class="mb-4"><?php echo $title; ?></h2>
        <?php endif; ?>
        
        <?php foreach($groups as $gIndex => $group): ?>
          <pre><?php //var_dump($group); ?></pre>
          <h3><?php echo $group['title']; ?></h3>
          
          <div class="accordion" id="accordionFAQ<?php echo $gIndex; ?>">
            <?php foreach($group['faq'] as $index => $question): ?>
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapse<?php echo $gIndex . '-' . $index; ?>" 
                      aria-expanded="false" 
                      aria-controls="collapse<?php echo $gIndex . '-' . $index; ?>">
                    <?php echo $question['question']; ?>
                  </button>
                </h2>
                <div id="collapse<?php echo $gIndex . '-' . $index; ?>" 
                    class="accordion-collapse collapse" 
                    data-bs-parent="#accordionFAQ<?php echo $gIndex; ?>">
                  <div class="accordion-body">
                  <?php echo $question['answer']; ?>
                  </div>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        </div>

        <?php endforeach; ?>
        
      </div>
    </div>
  </div>
</section>

<?php endif; ?>
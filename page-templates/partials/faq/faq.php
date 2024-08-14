<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$groups = get_field('faqs'); 

if($groups && is_array( $groups ) && count( $groups ) > 0) :
?>
<section id="faq-faq" class="py-7 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        
        <div class="row">
          <?php foreach($groups as $gIndex => $group): ?>

            <?php if($gIndex == 0 || ( count($groups) > 1 && $gIndex + 1 == ceil(count($groups)/2)+1 )): ?>
            <div class="col-12 col-lg-6">
            <?php endif; ?>
             
              <h3><?php echo $group['title']; ?></h3>
              
              <div class="accordion accordion-primary mb-6" id="accordionFAQ<?php echo $gIndex; ?>">
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
            
            <?php if($gIndex == count($groups)-1 || (count($groups) > 1 && $gIndex + 1 == ceil(count($groups)/2) )): ?>
            </div>
            <?php endif; ?>

          <?php endforeach; ?>
        </div>
        
      </div>
    </div>
  </div>
</section>

<?php endif; ?>
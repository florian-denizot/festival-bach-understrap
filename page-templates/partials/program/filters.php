<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );

//Get Template Params
$taxonomy_terms = $args['taxonomy_terms'];
$instruments_taxonomy_terms = isset($taxonomy_terms["instruments_taxonomy_terms"]) ? $taxonomy_terms["instruments_taxonomy_terms"] : array();
$categories_taxonomy_terms = isset($taxonomy_terms["categories_taxonomy_terms"]) ? $taxonomy_terms["categories_taxonomy_terms"] : array();
$halls = isset($args['halls']) ? $args['halls'] : array();

$parameters_matches = $args['parameters_matches'];
$instrument_matches = isset($parameters_matches["instrument"]) ? $parameters_matches["instrument"] : array();
$category_matches = isset($parameters_matches["concert_category"]) ? $parameters_matches["concert_category"] : array();
$hall_matches = isset($parameters_matches["hall"]) ? $parameters_matches["hall"] : array();

$collapse = $args['collapse_filters'];

$display = get_field('display_filters');

?>
<?php if($display): ?>
<section id="program-filters" class="mt-5 anchor">
  <div class="<?php echo esc_attr( $container ); ?>" tabindex="-1">
    <div class="row">
      <div class="col">
        <div class="accordion" id="accordionFilters">
          <div class="accordion-item">
          <h5 class="accordion-header">
            <button class="accordion-button <?php echo $collapse ? 'collapsed' : ''; ?>" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#collapseFilters" 
                  aria-expanded="<?php echo $collapse ? 'false' : 'true'; ?>" 
                  aria-controls="collapseFilters">
              <?php _e('Filters', 'festival-bach-understrap'); ?>
            </button>
          </h5>
          <form id="collapseFilters" 
                class="accordion-collapse <?php echo $collapse ? 'collapse' : ''; ?>" 
                data-bs-parent="#accordionFilters">
            <div class="accordion-body">
              <div class="row">
                
              <?php if($halls): ?>
                  <div class="col col-12 col-md-6 mb-4">
                    <h6><?php _e('Venue', 'festival-bach-understrap'); ?></h6>
                    <div class="d-flex flex-wrap">
                      <?php foreach($halls as $hall): ?>
                        <div class="flex-fill d-grid">
                          <input type="checkbox"
                              id="<?php echo $hall["slug"]?>"
                              class="btn-check"
                              <?php echo ParamsFromURL::isURLParameterAndInputMatch($hall_matches, $hall["id"]) ? "checked" : "";  ?>
                              name="hall" value="<?php echo $hall["id"] ?>">
                          <label for="<?php echo $hall["slug"] ?>" class="btn btn-outline-primary btn-sm">
                            <?php echo $hall["title"] ?>
                          </label>
                        </div>
                      <?php endforeach; ?>
                    </div>
                  </div>
                <?php endif; ?>

                <div class="col col-12 col-md-6">
                  <?php if($instruments_taxonomy_terms): ?>
                    <div class="mb-4">
                      <h6><?php _e('Instrument', 'festival-bach-understrap'); ?></h6>
                      <div class="d-flex flex-wrap">
                        <?php foreach($instruments_taxonomy_terms as $instrument_taxonomy): ?>
                          <div class="flex-fill d-grid">
                            <input type="checkbox"
                                id="<?php echo $instrument_taxonomy->slug?>"
                                class="btn-check"
                                <?php echo ParamsFromURL::isURLParameterAndInputMatch($instrument_matches, $instrument_taxonomy->term_id) ? "checked" : "";  ?>
                                name="instrument" value="<?php echo $instrument_taxonomy->term_id ?>">
                            <label for="<?php echo $instrument_taxonomy->slug ?>" class="btn btn-outline-primary btn-sm">
                              <?php echo $instrument_taxonomy->name ?>
                            </label>
                          </div>
                        <?php endforeach; ?>
                      </div>
                    </div>
                  <?php endif; ?>
                

                  <?php if($categories_taxonomy_terms): ?>
                    <div  class="mb-4">
                      <h6><?php _e('Category', 'festival-bach-understrap'); ?></h6>
                      <div class="d-flex flex-wrap">
                        <?php foreach($categories_taxonomy_terms as $category_taxonomy): ?>
                          <div class="flex-fill d-grid">
                            <input type="checkbox"
                                class="btn-check"
                                id="<?php echo $category_taxonomy->slug?>"
                                <?php echo ParamsFromURL::isURLParameterAndInputMatch($category_matches, $category_taxonomy->term_id) ? "checked" : "";  ?>
                                name="concert_category" 
                                value="<?php echo $category_taxonomy->term_id ?>">
                            <label for="<?php echo $category_taxonomy->slug ?>" class="btn btn-outline-primary btn-sm">
                              <?php echo $category_taxonomy->name ?>
                            </label>
                          </div>
                        <?php endforeach; ?>
                      </div>
                    </div>
                  <?php endif; ?>

                </div>
              </div>
              
              <div class="submit-button">
                <button type="submit" value="" class="btn btn-primary">
                  <?php _e('Filter', 'festival-bach-understrap'); ?>
                    <i class="pl-3 far fa-arrow-right"></i>
                  </button>
              </div>
            </div>  
          </form>
        </di0v>
      </div>
    </div>
  </div>
</section>
<?php endif; ?>

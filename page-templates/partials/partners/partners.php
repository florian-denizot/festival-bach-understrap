<?php 
$partners_section = get_field('partners_section', 'option');
$partners_section_partners = $partners_section["partners"];
?>

<section id="partners-partners" class="py-7">
  <div class="container">
    <div class="row">
      <div class="col">
          
        <?php if( $partners_section_partners ): ?>
          
          <?php foreach( $partners_section_partners as $partner ) : ?>
            <h2 class="my-4"><?php echo $partner['heading']; ?></h2>
            <div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-5 mb-7 justify-content-center">
              <?php if( $partner["logos"] ): ?>
                <?php foreach( $partner["logos"] as $logo ) : ?>
                  
                  <div class="col d-flex align-items-center">
                    <?php if( is_array($logo["image"]) && $logo["image"]["url"]): ?>
                      <?php $logo_url = $logo["image"]["url"]; ?>
                    <?php endif; ?>
                    <?php $logo_height = $logo["height"]; ?>
                    <?php $logo_name = $logo["name"]; ?>
                    
                    <div class="item flex-fill <?php if($logo["image"]) { echo "image"; } else { echo "no-image"; } ?>">
                      <div>

                        <?php if($logo["link"]) : ?>

                          <a href="<?php echo $logo["link"]["url"]?>" target="_blank">
                            <?php if($logo["image"]) : ?>
                              <img src="<?php echo $logo_url ?>" alt="" class="mx-auto d-block" style="max-height:<?php echo $logo_height; ?>" />
                            <?php else: ?>
                              <p><?php echo $logo_name ?></p>
                            <?php endif; ?>
                          </a>

                        <?php else: ?>

                          <?php if($logo["image"]) : ?>
                              <img src="<?php echo $logo_url ?>" alt="" class="mx-auto d-block" style="max-height:<?php echo $logo_height; ?>" />
                            <?php else: ?>
                              <p class="mb-0 text-center"><?php echo $logo_name ?></p>
                            <?php endif; ?>
                        <?php endif; ?>
                      
                      </div>
                    </div>
                  </div>

                <?php endforeach; ?>
              <?php endif; ?>
            </div>
          <?php endforeach; ?>
        
        <?php endif; ?> 

      </div>
    </div>
  </div>
</section><!-- #partners -->

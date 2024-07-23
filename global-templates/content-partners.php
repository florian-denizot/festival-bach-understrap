<?php $partners_section = get_field('partners_section', 'option');
  $partners_section_partners = $partners_section["partners"];
?>


<!-- ******************************* Partner section **************************************** -->

<div id="partners" class="py-5">
  <div class="container">
    <div class="row">
      <div class="col">
        <h2>Partenaires</h2>
        <div class="partner-carousel">
          
          <?php if( $partners_section_partners ): ?>
            
            <?php foreach( $partners_section_partners as $partner ) : ?>
              <?php if( $partner["logos"] ): ?>
                <?php foreach( $partner["logos"] as $logo ) : ?>
              
                  <?php if( is_array($logo["image"]) && $logo["image"]["url"]): ?>
                    <?php $logo_url = $logo["image"]["url"]; ?>
                  <?php endif; ?>
                  <?php $logo_height = $logo["height"]; ?>
                  <?php $logo_name = $logo["name"]; ?>
                  
                  <div class="item <?php if($logo["image"]) { echo "image"; } else { echo "no-image"; } ?>">

                    <?php if($logo["link"]) : ?>

                      <a href="<?php echo $logo["link"]["url"]?>" target="_blank">
                        <?php if($logo["image"]) : ?>
                          <img src="<?php echo $logo_url ?>" alt="" style="max-height:<?php echo $logo_height; ?>" />
                        <?php else: ?>
                          <p><?php echo $logo_name ?></p>
                        <?php endif; ?>
                      </a>

                    <?php else: ?>

                      <?php if($logo["image"]) : ?>
                          <img src="<?php echo $logo_url ?>" alt="" style="max-height:<?php echo $logo_height; ?>" />
                        <?php else: ?>
                          <p><?php echo $logo_name ?></p>
                        <?php endif; ?>
                    <?php endif; ?>

                  </div>

                <?php endforeach; ?>
              <?php endif; ?>
            <?php endforeach; ?>
          
          <?php endif; ?> 

        </div>
      </div>
    </div>
  </div>
</div><!-- #partners -->

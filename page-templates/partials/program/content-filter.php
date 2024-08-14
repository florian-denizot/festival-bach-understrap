<?php

/*
  ** Desc: Get Template Params
*/
  $taxonomy_terms = $template_args['taxonomy_terms'];
  $instruments_taxonomy_terms = $taxonomy_terms["instruments_taxonomy_terms"];

  $parameters_matches = $template_args['parameters_matches'];
  $instrument_matches = $parameters_matches["instrument"];

  // echo "link: <br>";
  // print_r(unserialize(serialize(parse_url((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]"))));

  // echo "post slug: <br>";
  // global $post;
  // $post_slug = $post->post_name;
  // print_r($post_slug);

?>

<form action=" <?php ICL_LANGUAGE_CODE == "fr" ? "/programmation" : "/program"?> ">

  <?php if($instruments_taxonomy_terms): ?>
    <?php foreach($instruments_taxonomy_terms as $instrument_taxonomy): ?>
      <div>
        <input type="checkbox" data-term-id="<?php echo $instrument_taxonomy->term_id ?>"
            id="<?php echo $instrument_taxonomy->slug?>"
            <?php echo ParamsFromURL::isURLParameterAndInputMatch($instrument_matches, $instrument_taxonomy->term_id) ? "checked" : "";  ?>
            name="instrument" value="<?php echo $instrument_taxonomy->term_id ?>">
        <label for="<?php echo $instrument_taxonomy->slug ?>">
          <i <?php echo $instrument_taxonomy->icon ?>"></i>
          <?php echo $instrument_taxonomy->name ?>
        </label>
      </div>
    <?php endforeach; ?>
  <?php endif; ?>
  
  <div class="submit-button">
    <button type="submit"
      value=""><?php echo ICL_LANGUAGE_CODE == "fr" ? "appliquer le filtre" : "apply the filters"?>
        <i class="pl-3 far fa-arrow-right"></i>
      </button>
  </div>
    
 
</form>


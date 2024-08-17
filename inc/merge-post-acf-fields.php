<?php 


class MergePostAndACFFields {
  
  // Properties
  private $post_slug;
  private $acf_slug;
  private $taxonomy_names;
  private $WP_array;
  private $WP_ACF_array;
  private $WP_ACF_Taxonomy_array;


  public function __construct() {
  }

  /*
    ** DESC: with post
    ** INPUTS: 
    **** $post_slug: archive post_slug => ex: concerts
    ** OUTPUT:
    **** WP post array
  */
  public static function withPosts( $post_slug ) {
    $instance = new self();
    
    return $instance->WP_setup($instance->$post_slug);
  }

  private function WP_setup($post_slug) {
    return new WP_Query(
      array(
        'post_type' => $post_slug,
        'posts_per_page' => -1,
      ),
      
    );
  }

  /*
    ** DESC: with post and acf
    ** INPUTS: 
    **** $post_slug: archive post_slug => ex: concerts
    **** $acf_slug : acf_slug => ex: concert
    ** OUTPUT:
    **** WP ACF post array
  */
  public static function withPostsAndACF($post_slug, $acf_slug) {
    $instance = new self();
    return $instance->WP_ACF_setup($post_slug, $acf_slug);
  }
  
  private function WP_ACF_setup($post_slug, $acf_slug) {
    $WP_array = new WP_Query(
      array(
        'post_type' => $post_slug,
        'posts_per_page' => -1,
        'post_status' => 'publish',
      ),
      
    );
    $temp = array();
    if($WP_array->have_posts()) : 
      while($WP_array->have_posts()) : $WP_array->the_post();
        $item_post = get_post();
        $item = get_field($acf_slug);
        $item["ID"] = $item_post->ID;
        $item["guid"] = $item_post->guid;
        array_push($temp ,$item);      
      endwhile;
    endif; wp_reset_query(); 
  
    return $temp;
  }

  /*
    ** DESC: with post, acf and taxonomies
    ** INPUTS: 
    **** $post_slug: archive post_slug => ex: concerts
    **** $acf_slug : acf_slug => ex: concert
    **** $taxonomy_names : acf_slug => ex: ["instruments, concert_types"...]
    ** OUTPUT:
    **** WP ACF post array
  */
  public static function withPostsAndACFAndTaxonomies($post_slug, $acf_slug, $taxonomy_names) {
    $instance = new self();
    return $instance->WP_ACF_Taxonomies_setup($post_slug, $acf_slug, $taxonomy_names);
  }






  private function WP_ACF_Taxonomies_setup($post_slug, $acf_slug, $taxonomy_names) {
    $WP_array = new WP_Query(
      array(
        'post_type' => $post_slug,
        'posts_per_page' => -1,
        'post_status' => 'publish',
      ),
      
    );
    $temp = array();
    if($WP_array->have_posts()) : 
      while($WP_array->have_posts()) : $WP_array->the_post();
        $item_post = get_post();
        $item = get_field($acf_slug);
        $item["ID"] = $item_post->ID;
        $item["guid"] = get_the_permalink();
        foreach($taxonomy_names as $taxonomy_name) {
          $item[$taxonomy_name] = get_the_terms($item["ID"], $taxonomy_name);
        }
        array_push($temp ,$item);      
      endwhile;
    endif; wp_reset_query(); 
    return $temp;
  }


  /*
    ** DESC: Add ACF fields to taxonomy Objects
    ** 
  */ 
  public static function addACFFieldsToTaxonomies($array, $taxonomy_name, $acf_field_slug)
  {
    foreach($array as $item) {
        $taxonomy_items = $item[$taxonomy_name];
        if($taxonomy_items) {
          foreach($taxonomy_items as $taxonomy_item) {
            $temp_id =  $taxonomy_item->term_id;
            $temp_slug = $taxonomy_item->slug;
            $taxonomy_item->$acf_field_slug = get_field( $acf_field_slug, $taxonomy_name . '_' . $temp_id);
          }
        }
    }
  }

  public static function get_taxonomy_terms($taxonomy_slug) {
    return get_terms( array(
      'taxonomy' => $taxonomy_slug,
      'hide_empty' => false
    ));
  }


  public static function filterArrayByTaxonomy($array, $key, $taxonomy_match) {
    $filtered_array = Array();
  
    if($taxonomy_match && count($taxonomy_match) > 0 ) {
      if($array) { 
        foreach($array as $item) { 
          if($item[$key] && count($item[$key]) > 0) { 
            foreach($item[$key] as $instrument_taxonomy_term) { 
              $instrument_taxonomy_term_id = (int) $instrument_taxonomy_term->term_id;
              foreach($taxonomy_match as $instrument_match_term) { 
                $instrument_match_term = (int) $instrument_match_term;
                if($instrument_taxonomy_term_id == $instrument_match_term) {
                  if(!in_array($item, $filtered_array)) {
                    array_push($filtered_array, $item);
                  }
                }
              }
            }
          }
        }
      }
      else {
        return $array;
      }
    }
    else {
      return $array;
    }
  
    return $filtered_array;
  }

}
?>
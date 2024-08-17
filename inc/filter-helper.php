<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

/**
 * A helper for filters 
 */
class FilterHelper {

  /**
   * Filter an array of custom type Posts by a list of items from one of its relation
   * @param array $array An array of custom type Post
   * @param string $key  The key of the relationship in the custom type Post associative array
   * @param array $matches An array of ids of the relationship items to filter the custom type Post list with  
   * @return array An filtered array of custom type Post
   */
  public static function filterArrayByRelation($array, $key, $matches) {

    $filtered_array = Array();
  
    if($matches && count($matches) > 0 && $array) {
      foreach($array as $item) { 
        if($item[$key] && count($item[$key]) > 0) { 
          foreach($item[$key] as $relation) { 
            $relationId = (int) $relation->ID;
            foreach($matches as $match) { 
              $matchId = (int) $match;
              if($relationId == $matchId) {
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
  
    return $filtered_array;
  }
}
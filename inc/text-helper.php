<?php
/**
 * Return an excerpt from a text
 * @param string $text The original string
 * @param string $length The length in words of the excerpt 
 * @return string The excerpt
 */
function get_excerpt_from_text(string $text='', int $length = 35) {
  if ( $text != '' ) {
    $excerpt = strip_shortcodes( $text );
    $excerpt = apply_filters('the_content', $excerpt);
    $excerpt = str_replace(']]>', ']]>', $excerpt);
    $excerpt = wp_trim_words( $excerpt, $length, ' [...]' );
  }
  return apply_filters('the_excerpt', $excerpt);
}
<?php 


  class ParamsFromURL {
    // Properties
    private $actual_url;
    private $url_obj;
    private $parameters_from_URL;
    public function __construct() {
      $this->actual_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
      $this->url_obj = unserialize(serialize(parse_url((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]")));
      $this->parameters_from_URL = Array();
    }
    
    // API
    public function set_parameters_by_name($parameter_name, $excluded_parameters_name) {    

      if(isset($this->url_obj["query"])) {
        $parameters_matches = Array();
        $parameters_matches_query = preg_replace("/&/i", "", $this->url_obj["query"]);
    
        foreach($excluded_parameters_name as $excluded_parameter_name) {
          $parameters_matches_query = preg_replace("/" . $excluded_parameter_name . "=([0-9]+)/i", "", $parameters_matches_query);
        }
    
        preg_match_all('/' . $parameter_name . '=([0-9]+)\&/', $parameters_matches_query, $parameters_matches);
        $parameters_matches = explode($parameter_name . '=', $parameters_matches_query);
        unset($parameters_matches[0]);
    
        $this->parameters_from_URL[$parameter_name] = $parameters_matches;
      }
    }
  
  
  
    public static function isURLParameterAndInputMatch($parameter_matches, $term_id) {

      if($parameter_matches) {
        foreach($parameter_matches as $instrument_match) {
          if((int) $instrument_match == (int) $term_id) {
            return true;
          }
        }
      }
      return false;
    }


    // Getters and Setters Methods
    private function set_actual_url($actual_url) {
      $this->actual_url = $actual_url;
    }
    private function get_actual_url() {
      return $this->actual_url;
    }
  
    private function set_url_obj($url_obj) {
      $this->url_obj = $url_obj;
    }
    private function get_url_obj() {
      return $this->url_obj;
    }
  
    public function set_parameters_from_URL() {
      $this->parameters_from_URL = Array();
    }
    public function get_parameters_from_URL() {
      return $this->parameters_from_URL;
    }
  }

?>
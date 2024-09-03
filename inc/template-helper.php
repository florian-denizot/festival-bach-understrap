<?php

class TemplateSectionHelper {
  private string $class;
  private string $id;

  function __construct(array $args) { 
    $this->class = isset($args['class']) ? $args['class'] : '';
    $this->id = isset($args['id']) ? $args['id'] : '';
  }


  public function getId(): string {
    return $this->id;
  }
  public function getClass(): string {
    return $this->class;
  }
}
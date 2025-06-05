<?php
// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;
?>

<div class="modal fade" id="artist-modal" aria-hidden="true" aria-labelledby="artist-modal-name" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="text-end">
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">

        <div class="container-fluid">
          <div class="row justify-content-center">
            <div class="col-lg-6">
              <img id="artist-modal-image"/>
            </div>
          </div>
        </div>

        <h3 id="artist-modal-name"></h3>
        <div id="artist-modal-bio"></div>
        <ul class="list-inline mt-3 fs-6">
          <li class="list-inline-item" id="artist-modal-youtube">
            <a target="_blank">
              <span class="fa-stack">
                <i class="fas fa-square fa-stack-2x"></i>
                <i class="fab fa-youtube fa-stack-1x fa-inverse"></i>
              </span>
            </a>
          </li>
          <li class="list-inline-item" id="artist-modal-soundcloud">
            <a target="_blank">
              <span class="fa-stack">
                <i class="fas fa-square fa-stack-2x"></i>
                <i class="fab fa-soundcloud fa-stack-1x fa-inverse"></i>
              </span>
            </a>
          </li>
          <li class="list-inline-item" id="artist-modal-spotify">
            <a target="_blank">
              <span class="fa-stack">
                <i class="fas fa-square fa-stack-2x"></i>
                <i class="fab fa-spotify fa-stack-1x fa-inverse"></i>
              </span>
            </a>
          </li>
          <li class="list-inline-item" id="artist-modal-website">
            <a target="_blank">
              <span class="fa-stack">
                <i class="fas fa-square fa-stack-2x"></i>
                <i class="fas fa-link fa-stack-1x fa-inverse"></i>
              </span>
            </a>
          </li>
        </ul>

      </div>
    </div>
  </div>
</div>
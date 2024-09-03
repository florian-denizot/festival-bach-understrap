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

      </div>
    </div>
  </div>
</div>
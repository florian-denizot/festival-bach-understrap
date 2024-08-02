import Modal from 'bootstrap/js/dist/modal';

/**
 * Increase opacity of main navbar when the page is scrolled down
 */
document.addEventListener('scroll', () => {
    var scrollDown = window.scrollY;
    var navOverlay = document.querySelector('.nav-overlay');
    navOverlay.style.opacity = ((( 1 - (400 - scrollDown) / 400 ) * 0.8 ) + 0.4).toString();
});

jQuery(document).ready(function(){
  
  /**
   * Setup Partner Carousel
   */
  jQuery('.partner-carousel').slick({
    infinite: true,
    arrows: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    centerMode: true,

    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });



  /**
   * Setup Artist Carousel
   */

  jQuery('.artist-carousel').slick({
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,

    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2
        }
      }
    ]
  });


  /**
   * Setup Photo Gallery Carousel
   */
  for(let i = 0; i<30 ; i++){
    jQuery('.gallery-display-' + i).slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: '.gallery-carousel-' + i
    });

    jQuery('.gallery-carousel-' + i).slick({
      infinite: true,
      slidesToShow: 9,
      slidesToScroll: 1,
      asNavFor: '.gallery-display-' + i,
      centerMode: true,
      focusOnSelect: true,
      autoplay: true,
      autoplaySpeed: 3000,

      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 7
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 5
          }
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 3
          }
        }
      ]
    });
    
    var galleryEL = document.getElementById('modal-gallery-' + i);
    if(galleryEL) {
      Modal.getOrCreateInstance(galleryEL);

      galleryEL.addEventListener('shown.bs.modal', event => {


        jQuery('.gallery-carousel-' + i).slick('setPosition');
        jQuery('.gallery-display-' + i).slick('setPosition');
      }); 
    }
  }
});



/**
 *  Update artist modal content depending on the artist link clicked 
 */
const artistModal = document.getElementById('artist-modal');
if (artistModal) {
  artistModal.addEventListener('show.bs.modal', event => {

    // Button that triggered the modal
    const button = event.relatedTarget;

    
    // Extract info from data-bs-* attributes
    const name = button.getAttribute('data-bs-name');
    const image = button.getAttribute('data-bs-image');
    const bio = button.getAttribute('data-bs-bio');

    // Update the modal's content.
    const modalTitle = artistModal.querySelector('#artist-modal-name');
    const modalImage = artistModal.querySelector('#artist-modal-image');
    const modalBio = artistModal.querySelector('#artist-modal-bio');

    modalTitle.textContent = name;
    modalImage.src = image;
    modalBio.textContent = bio;
  })
}

/**
 * Smooth collapse toogle on mouseenter/mouselease for concert infos
 */
/* 
const collapseElementList = document.querySelectorAll('.concert-infos');

collapseElementList.forEach(collapseEl => {
  let elId = collapseEl.id;
  let triggerEl = document.querySelector('a[trigger-collapse="' + elId + '"]');
  
  
  if(triggerEl) {
    let bCollapseEl = bootstrap.Collapse.getOrCreateInstance(collapseEl,{ toggle: false });
    
    triggerEl.addEventListener(
      "mouseenter",
      (event) => {
        bCollapseEl.show();
      }
    );

    triggerEl.addEventListener(
      "mouseleave",
      (event) => {
        bCollapseEl.hide();
      }
    );
    
  }
});
*/

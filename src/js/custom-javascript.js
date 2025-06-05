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
    centerMode: false,

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
    arrows: true,
    dots: true,

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
   * Setup Testimony Carousel
   */

  jQuery('.testimony-carousel').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: true,
    dots: true,

    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1
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
      arrows: true,

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

  /**
   * Setup Newspaper Carousel
   */
  jQuery('.newspaper-carousel').slick({
    infinite: true,
    arrows: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,

    responsive: [
      {
        breakpoint: 1200,
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

  jQuery('.home-carousel').slick({
    infinite: true,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  });
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
    const youtube = button.getAttribute('data-bs-youtube');
    const soundcloud = button.getAttribute('data-bs-soundcloud');
    const spotify = button.getAttribute('data-bs-spotify');
    const website = button.getAttribute('data-bs-website');

    // Update the modal's content.
    const modalTitle = artistModal.querySelector('#artist-modal-name');
    const modalImage = artistModal.querySelector('#artist-modal-image');
    const modalBio = artistModal.querySelector('#artist-modal-bio');
    const modalYoutube = artistModal.querySelector('#artist-modal-youtube');
    const aYoutube = artistModal.querySelector('#artist-modal-youtube>a');
    const modalSoundcloud = artistModal.querySelector('#artist-modal-soundcloud');
    const aSoundcloud = artistModal.querySelector('#artist-modal-soundcloud>a');
    const modalSpotify = artistModal.querySelector('#artist-modal-spotify');
    const aSpotify = artistModal.querySelector('#artist-modal-spotify>a');
    const modalWebsite = artistModal.querySelector('#artist-modal-website');
    const aWebsite = artistModal.querySelector('#artist-modal-website>a');

    modalTitle.textContent = name;
    modalImage.src = image;
    modalBio.textContent = bio;
    
    if(!youtube) {
      modalYoutube.classList.add('d-none');
    } else {
      modalYoutube.classList.remove('d-none');
    }
    aYoutube.href = youtube;
    
    if(!soundcloud) {
      modalSoundcloud.classList.add('d-none');
    } else {
      modalSoundcloud.classList.remove('d-none');
    }
    aSoundcloud.href = soundcloud;
    
    if(!spotify) {
      modalSpotify.classList.add('d-none');
    } else {
      modalSpotify.classList.remove('d-none');
    }
    aSpotify.href = spotify;
    
    if(!website) {
      modalWebsite.classList.add('d-none');
    } else {
      modalWebsite.classList.remove('d-none');
    }
    aWebsite.href = website;


  })
}


 /**
   *  Update photo modal content depending on the photo clicked 
   */
 const photoModal = document.getElementById('photo-modal');
 if (photoModal) {
   photoModal.addEventListener('show.bs.modal', event => {

     // Button that triggered the modal
     const button = event.relatedTarget;
     
     // Extract info from data-bs-* attributes
     const image = button.getAttribute('data-bs-image');

     // Update the modal's content.
     const modalImage = photoModal.querySelector('#photo-modal-image');

     modalImage.src = image;
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

/**
 * Smooth collapse toogle on mouseenter/mouselease for concert infos
 */
/* 
import * as bootstrap from 'bootstrap';

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


/**
 * Increase opacity of main navbar when the page is scrolled down
 */
document.addEventListener('scroll', () => {
    var scrollDown = window.scrollY;
    console.log(scrollDown);
    var navOverlay = document.querySelector('.nav-overlay');
    navOverlay.style.opacity = ((( 1 - (400 - scrollDown) / 400 ) * 0.8 ) + 0.2).toString();
});


/**
 * Setup Partner Carousel
 */
jQuery(document).ready(function(){
  jQuery('.partner-carousel').slick({
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
});

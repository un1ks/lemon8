const totalMediaSlides = document.querySelectorAll('.le__gamepage .media .slider .swiper-slide:not(.swiper-slide-duplicate)').length;

const mediaSlider = new Swiper('.le__gamepage .media .slider', {
  slidesPerView: 1.5,
  spaceBetween: 24,
 
  watchSlidesProgress: true,
 

  navigation: {
    nextEl: ".le__gamepage .media .next",
    prevEl: ".le__gamepage .media .prev",
  },
});
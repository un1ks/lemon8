const totalSlides = document.querySelectorAll('.le__slider .slider .swiper-slide:not(.swiper-slide-duplicate)').length;
const mainSliderEl = document.querySelector('.le__slider .slider');

const mainControl = new Swiper('.le__slider .control', {
  slidesPerView: 4,
  spaceBetween: 0,
  watchSlidesProgress: true,
  slideToClickedSlide: true,
});

const mainSlider = new Swiper('.le__slider .slider', {
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  watchSlidesProgress: true,
  loopedSlides: totalSlides,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },

  navigation: {
    nextEl: ".le__slider .next",
    prevEl: ".le__slider .prev",
  },
});

mainControl.on('click', () => {
  const realIndex = mainControl.clickedIndex;
  if (typeof realIndex !== 'undefined') {
    mainSlider.slideToLoop(realIndex);
  }
});

mainSlider.on('slideChange', () => {
  const realIndex = mainSlider.realIndex;

  mainControl.slideTo(realIndex);

  requestAnimationFrame(() => {
    mainControl.slides.forEach(slide => slide.classList.remove('swiper-slide-active'));

    const activeThumb = mainControl.slides[realIndex];
    if (activeThumb) {
      activeThumb.classList.add('swiper-slide-active');
    }
  });
});


mainSliderEl.addEventListener('mouseenter', () => {
  mainSlider.autoplay.stop();
  mainControl.el.classList.add('paused');
});

mainSliderEl.addEventListener('mouseleave', () => {
  mainSlider.autoplay.start();
  mainControl.el.classList.remove('paused');
});




document.querySelectorAll('.featured ul li').forEach(container => {
  const video = container.querySelector('video');

  container.addEventListener('mouseenter', () => {
    video.play();
  });

  container.addEventListener('mouseleave', () => {
    video.pause();
  });
});


const comingGame = new Swiper('.development .games', {
  slidesPerView: 1,
  spaceBetween: 0,
  watchSlidesProgress: true,
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },

  pagination: {
    el: ".development .pagination",
  },
  
});

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

const mainSliderBg = new Swiper('.le__slider .background', {
  spaceBetween: 0,
  effect: 'fade',
  fadeEffect: { crossFade: true },
  loop: true,
  loopedSlides: totalSlides,
});

mainControl.on('click', () => {
  const realIndex = mainControl.clickedIndex;
  if (typeof realIndex !== 'undefined') {
    mainSlider.slideToLoop(realIndex);
  }
});

mainSlider.on('slideChange', () => {
  const realIndex = mainSlider.realIndex;

  mainSliderBg.slideToLoop(realIndex);
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



//


function playOnlyActive(swiper) {
  swiper.slides.forEach(slide => {
    slide.querySelectorAll('video').forEach(v => {
      v.pause();
    });
  });

  const active = swiper.slides[swiper.activeIndex];
  const vid = active && active.querySelector('video');
  if (!vid) return;

  const start = () => {
    const p = vid.play();
    if (p && p.catch) p.catch(() => { });
  };

  if (vid.readyState >= 2) start();
  else vid.addEventListener('canplay', start, { once: true });
}


const comingControl = new Swiper('.development .control', {
  slidesPerView: "auto",
  spaceBetween: 8,
  direction: "vertical",
  watchSlidesProgress: true,
});

const comingGame = new Swiper('.development .games', {
  slidesPerView: 1,
  spaceBetween: 0,
  watchSlidesProgress: true,
  allowTouchMove: false,
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },

  thumbs: {
    swiper: comingControl,
  },


  on: {
    init() {
      playOnlyActive(this);
    },
    slideChangeTransitionEnd() {
      playOnlyActive(this);
    }
  }
});


const comingGallery = new Swiper('.gallery .gal', {
  slidesPerView: 1.4,
  spaceBetween: 18,
  freeMode: true,
  watchSlidesProgress: true,
});
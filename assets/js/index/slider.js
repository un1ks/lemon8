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
  watchSlidesProgress: true,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },

  navigation: {
    nextEl: ".le__slider .next",
    prevEl: ".le__slider .prev",
  },

  pagination: {
    el: ".le__slider .pagination",
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




//



document.querySelectorAll('.gamelist .featured ul li a').forEach(wrapper => {
  const video = wrapper.querySelector('video');
  const videoSrc = wrapper.dataset.src;

  wrapper.addEventListener('mouseenter', () => {
    if (!video.src) {
      video.src = videoSrc;
      video.play();
    }
  });

  wrapper.addEventListener('mouseleave', () => {
    video.pause();
    video.removeAttribute('src');
    video.load();
  });
});
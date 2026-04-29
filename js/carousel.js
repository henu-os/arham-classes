/**
 * carousel.js — Arham Coaching Classes
 * Initializes Swiper.js testimonials carousel
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initTestimonialsSwiper();
});

function initTestimonialsSwiper() {
  const el = document.querySelector('.swiper-testimonials');
  if (!el || typeof Swiper === 'undefined') return;

  new Swiper('.swiper-testimonials', {
    loop: true,
    grabCursor: true,
    slidesPerView: 1,
    spaceBetween: 24,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 28,
      },
    },
    a11y: {
      prevSlideMessage: 'Previous testimonial',
      nextSlideMessage: 'Next testimonial',
    },
  });
}

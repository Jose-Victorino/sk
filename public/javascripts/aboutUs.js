const slideshow = document.querySelector('.slideshowAbout');
new slider(slideshow, {
  type: 'auto-scroll',
  perPage: 1,
  interval: 12000,
});
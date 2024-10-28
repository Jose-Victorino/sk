const slideshow = document.querySelector('.slideshowAbout');
if(slideshow){
  new slider(slideshow, {
    type: 'auto-scroll',
    perPage: 1,
    interval: 12000,
  }); 
}
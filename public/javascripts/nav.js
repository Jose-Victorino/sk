const nav = document.querySelector('nav[data-nav]');
const burgerBtn = nav.querySelector('.Nav-Burger');
const navA = nav.getElementsByTagName('a');
const mobileUl = nav.querySelector('nav .mobileNav .navLinks');

nav.querySelectorAll('article').forEach((article) => {
  const liNavLinks = article.querySelectorAll('nav[data-nav] .navLinks li');

  liNavLinks.forEach((li) => {
    const subNav = li.querySelector('ul');
    if(!subNav) return;
  
    var div = document.createElement('div');
    var a = li.firstElementChild;
  
    a.parentNode.insertBefore(div, a);
    div.appendChild(a);
    
    if(nav.dataset.nav === 'header' && article.classList.contains('desktopNav') && div.parentNode.parentNode.classList.contains('subNav'))
      div.innerHTML +='<img src="../images/resources/svg/Arrow-Right.svg" alt="arrowDown">';
    else
      div.innerHTML += '<img src="../images/resources/svg/Arrow-Down.svg" alt="arrowDown">';
  
    li.classList.add('hasSubNav');
    subNav.classList.add('subNav');
  });
});

var ul = null;
if(nav.dataset.nav === 'header'){
  ul = nav.querySelectorAll('.mobileNav .navLinks .hasSubNav');
}
else if(nav.dataset.nav === 'sidebar'){
  ul = nav.querySelectorAll('article .navLinks .hasSubNav');
}
ul.forEach((li) => {
  const img = li.querySelector('div > img');
  img.addEventListener('click', () => {
    li.classList.toggle('show');
  });
});

burgerBtn.addEventListener('click', () => {
  burgerBtn.classList.add('on');
  mobileUl.classList.add('show');
});


for(const elA of navA){
  elA.addEventListener('click', () => {
    mobileUl.classList.remove('show');
    burgerBtn.classList.remove('on');
  });
}
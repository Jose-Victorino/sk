const anncForm = document.querySelector('#announcementForm');
const ancMainImg = anncForm.querySelector('#ancMainImg');
const mainLabel = anncForm.querySelector('label[for="ancMainImg"]');
const mainImagePreview = mainLabel.querySelector('.imagePreview');
const mainImgP = mainLabel.querySelector('p');
const errorMsg = anncForm.querySelector('.errorMsg');

ancMainImg.addEventListener('change', (e) => {
  const file = e.target.files[0];

  if(file && file.type.startsWith('image/')){
    mainImagePreview.src = URL.createObjectURL(file);
    mainLabel.classList.add('hasImg');
    mainImagePreview.style.display = 'block';
    mainImgP.style.display = 'none';
  }
  else{
    mainImagePreview.src = '';
    mainLabel.classList.remove('hasImg');
    mainImagePreview.style.display = 'none';
    mainImgP.style.display = 'block';
  }
});

const ancGalleryImg = anncForm.querySelector('#ancGalleryImg');
const galleryUl = anncForm.querySelector('.galleryImages');
const addGalleryImg = galleryUl.querySelector('.addImg');

ancGalleryImg.addEventListener('change', (e) => {
  const files = e.target.files;

  for(const file of files){
    if(file && file.type.startsWith('image/')){
      const li = document.createElement('li');
      const img = document.createElement('img');
      
      img.src = URL.createObjectURL(file);
      li.appendChild(img);
      addGalleryImg.before(li);
    }
  }
});

anncForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const title = anncForm.querySelector('#ancTitle').value;
  const description = anncForm.querySelector('#ancDescription').value;
  const mainImg = document.getElementById('ancMainImg').files[0].name;
  const galleryImgList = document.getElementById('ancGalleryImg').files;
  
  if(!mainImg){
    errorMsg.style.opacity = '1';
    return;
  }
  errorMsg.style.opacity = '0';
  
  const data = {
    title: title,
    description: description,
    mainImg: `../images/${mainImg}`,
    galleryImgs: [],
  };

  for(const img of galleryImgList){
    data.galleryImgs.push(`../images/${img}`);
  }
  
  fetch('/admin/ancAdd', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(res => {
    if(res.success){
      galleryUl.innerHTML =
      `<li class="addImg">
        <label for="ancGalleryImg">
          <div>+</div>
        </label>
      </li>`;

      anncForm.reset();
      mainImagePreview.src = '';
      mainLabel.classList.remove('hasImg');
      mainImagePreview.style.display = 'none';
      mainImgP.style.display = 'block';
    }
  });
});

const mainTabs = document.querySelectorAll('[data-nav-tabs]');
const mainWindows = document.querySelectorAll('[data-nav-windows]');

mainTabs.forEach((tab) => {
	tab.addEventListener('click', () => {
    mainWindows.forEach((window, i) => {
			if(tab.dataset.navTabs === window.dataset.navWindows){
				mainTabs[i].classList.add('selected');
				window.classList.add('show');
			}
			else{
				mainTabs[i].classList.remove('selected');
				window.classList.remove('show');
			}
		});
	});
});
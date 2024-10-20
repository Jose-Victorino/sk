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
      const btn = document.createElement('button');
      
      btn.type = 'button';
      btn.innerHTML = `<img src="../images/svg/xmark.svg" loading="lazy" alt="xmark">`
      img.src = URL.createObjectURL(file);
      li.appendChild(btn);
      li.appendChild(img);
      addGalleryImg.before(li);

      btn.addEventListener('click', () => {
        galleryUl.removeChild(li);
      });
    }
  }
});

const clearForm = () => {
  galleryUl.innerHTML =
    `<li class="addImg">
      <label for="ancGalleryImg">
        <div>+</div>
      </label>
    </li>`;

  anncForm.reset();
  mainImagePreview.src = '';
  mainImagePreview.style.display = 'none';
  mainLabel.classList.remove('hasImg');
  mainImgP.style.display = 'block';
}

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
    data.galleryImgs.push(`../images/${img.name}`);
  }
  
  fetch('/admin/ancAdd', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(res => {
    if(res.success){
      clearForm();
    }
  });
});

const mainTabs = document.querySelectorAll('[data-nav-tabs]');
const mainWindows = document.querySelectorAll('[data-nav-windows]');

mainTabs.forEach((tab) => {
  const activateTab = () => {
    mainWindows.forEach((window, i) => {
      if (tab.dataset.navTabs === window.dataset.navWindows) {
        mainTabs[i].classList.add('selected');
        window.classList.add('show');
      } else {
        mainTabs[i].classList.remove('selected');
        window.classList.remove('show');
      }
    });
  };

  tab.addEventListener('click', activateTab);
  tab.addEventListener('touchstart', activateTab);
});

const anncPreviewUL = document.querySelector('.anncPreview').children;

for(const li of anncPreviewUL){
  const main = li.querySelector('.ancMain');
  const gal = li.querySelector('.ancGallery');
  const edit = li.querySelector('.edit');
  const del = li.querySelector('.delete');
  const id = li.querySelector('input').value;

  new imageViewer(main);
  new imageViewer(gal);

  edit.addEventListener('click', () =>{

  });
  del.addEventListener('click', () =>{
    modalPN().confirm({
      title: 'Delete Announcement',
      text: 'Are you want to delete this announcement?',
      icon: 'warning',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    },
    function(res){
      if(res.isConfirmed){
        fetch('/admin/ancDelete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id }),
        })
        .then(response => response.json())
        .then(res2 => {
          if(res2.success){
            modalPN().alert({
              title: 'Success!',
              text: 'Announcement deleted',
              icon: 'check',
              location: 'center',
            });
          }
        });
      }
    });
  });
}

const courseModal = document.querySelector('.course-modal');
const article = courseModal.querySelectorAll('article');

function openModal(className){
  courseModal.classList.add('show');
  for(const tag of article){
    if(tag.classList.contains(className)){
      tag.classList.add('show');
    }
  }
}
function closeModal(){
  courseModal.classList.remove('show');
  
  for(i = 0; i < article.length; i++){
    article[i].classList.remove('show');
  }
  
  clearForm();
}
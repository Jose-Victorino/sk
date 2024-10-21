const anncForm = document.querySelector('#announcementForm');
const ancMainImg = anncForm.querySelector('#ancMainImg');
const mainLabel = anncForm.querySelector('label[for="ancMainImg"]');
const mainImagePreview = mainLabel.querySelector('.imagePreview');
const mainImgP = mainLabel.querySelector('p');
const errorMsg = anncForm.querySelector('.errorMsg');
let formType;

ancMainImg.addEventListener('change', (e) => {
  const file = e.target.files[0];

  if(file && file.type.startsWith('image/')){
    mainImagePreview.src = `../images/${file.name}`;
    mainImagePreview.style.display = 'block';
    mainLabel.classList.add('hasImg');
    mainImgP.style.display = 'none';
  }
  else{
    mainImagePreview.src = '';
    mainImagePreview.style.display = 'none';
    mainLabel.classList.remove('hasImg');
    mainImgP.style.display = 'block';
  }
});

const ancGalleryImg = anncForm.querySelector('#ancGalleryImg');
const galleryUl = anncForm.querySelector('.galleryImages');
const ancTitle = anncForm.querySelector('#ancTitle');
const ancDescription = anncForm.querySelector('#ancDescription');
const updateId = anncForm.querySelector('[type=hidden]');

ancGalleryImg.addEventListener('change', (e) => {
  const files = e.target.files;
  const addGalleryImg = galleryUl.querySelector('.addImg');
  
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
  
  const title = ancTitle.value;
  const description = ancDescription.value;
  const mainImg = mainImagePreview.src;
  const galleryImgList = ancGalleryImg.files;

  if(!mainImg){
    errorMsg.innerText = '*No cover photo selected.';
    errorMsg.style.opacity = '1';
    return;
  }
  if(galleryUl.children.length > 11){
    errorMsg.innerText = '*Maximum gallery images is 10.';
    errorMsg.style.opacity = '1';
    return;
  }
  errorMsg.style.opacity = '0';
  
  const data = {
    title,
    description,
    mainImg,
    galleryImgs: [],
  };

  for(const img of galleryImgList){
    data.galleryImgs.push(`../images/${img.name}`);
  }
  
  if(formType === 'Add'){
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
  }
  if(formType === 'Edit'){
    data.id = updateId.value;

    fetch('/admin/ancUpdate', {
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
  }
});

const mainTabs = document.querySelectorAll('[data-nav-tabs]');
const mainWindows = document.querySelectorAll('[data-nav-windows]');

mainTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    mainWindows.forEach((window, i) => {
      if (tab.dataset.navTabs === window.dataset.navWindows) {
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

const anncPreviewUL = document.querySelector('.anncPreview').children;
const courseModal = document.querySelector('.course-modal');
const article = courseModal.querySelectorAll('article');
const h1 = courseModal.querySelector('.anncModal h1');

for(const li of anncPreviewUL){
  const main = li.querySelector('.ancMain');
  const gal = li.querySelector('.ancGallery');
  const galImgs = gal.getElementsByTagName('img');
  const edit = li.querySelector('.edit');
  const del = li.querySelector('.delete');
  const id = li.querySelector('input').value;
  const mainImg = li.querySelector('.mainImg').src;
  const h2 = li.querySelector('.txt h2').innerText;
  const p = li.querySelector('.txt p').innerText;
  
  new imageViewer(main);
  new imageViewer(gal);
  
  edit.addEventListener('click', () =>{
    const addGalleryImg = galleryUl.querySelector('.addImg');
    updateId.value = li.querySelector('[type=hidden]').value;
    
    ancTitle.value = h2;
    ancDescription.value = p;
    mainImagePreview.src = mainImg;
    mainImagePreview.style.display = 'block';
    mainLabel.classList.add('hasImg');
    mainImgP.style.display = 'none';
    for(const galImg of galImgs){
      const li = document.createElement('li');
      const img = document.createElement('img');
      const btn = document.createElement('button');
      
      btn.type = 'button';
      btn.innerHTML = `<img src="../images/svg/xmark.svg" loading="lazy" alt="xmark">`
      img.src = galImg.src;
      li.appendChild(btn);
      li.appendChild(img);
      addGalleryImg.before(li);

      btn.addEventListener('click', () => {
        galleryUl.removeChild(li);
      });
    }

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

function openModal(className, type){
  
  courseModal.classList.add('show');
  h1.innerText = `${type} Announcement`;
  formType = type;
  
  for(const tag of article){
    if(tag.classList.contains(className)){
      tag.classList.add('show');
      tag.scrollTop = 0; 
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
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
        closeModal();
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
        closeModal();
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
  const gal = li.querySelector('.ancGallery');
  const galImgs = gal.getElementsByTagName('img');
  const edit = li.querySelector('.edit');
  const mainImg = li.querySelector('.mainImg').src;
  const h2 = li.querySelector('.txt h2').innerText;
  const p = li.querySelector('.txt p').innerText;

  // edit.addEventListener('click', () =>{
  //   const addGalleryImg = galleryUl.querySelector('.addImg');

  //   updateId.value = li.querySelector('[type=hidden]').value;
  //   ancTitle.value = h2;
  //   ancDescription.value = p;
  //   mainImagePreview.src = mainImg;
  //   mainImagePreview.style.display = 'block';
  //   mainLabel.classList.add('hasImg');
  //   mainImgP.style.display = 'none';

  //   for(const galImg of galImgs){
  //     const li = document.createElement('li');
  //     const img = document.createElement('img');
  //     const btn = document.createElement('button');
      
  //     btn.type = 'button';
  //     btn.innerHTML = `<img src="../images/svg/xmark.svg" loading="lazy" alt="xmark">`
  //     img.src = galImg.src;
  //     li.appendChild(btn);
  //     li.appendChild(img);
  //     addGalleryImg.before(li);

  //     btn.addEventListener('click', () => {
  //       galleryUl.removeChild(li);
  //     });
  //   }
  // });
}

function loadAnnouncements(data){
  const { announcements, mainImages, galImages } = data;
  const gal = document.querySelector('.anncPreview');

  for(const annc of announcements){
    const { AnnouncementID, Title, Description, DatePosted } = annc;
    const li = document.createElement('li');
    const h2 = document.createElement('h2');
    const span = document.createElement('span');
    const p = document.createElement('p');
    const ancMain = document.createElement('div');
    const ancGallery = document.createElement('div');
    const txt = document.createElement('div');
    const icon = document.createElement('div');
    const mainImg = document.createElement('img');
    const edit = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    const del = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    const setDate = new Date(DatePosted);
    const formattedDate =
      `${setDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })} ${setDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      })}`;
    
    txt.classList.add('txt');
    ancMain.classList.add('ancMain');
    ancGallery.classList.add('ancGallery');
    icon.classList.add('icon');
    edit.classList.add('edit');
    del.classList.add('delete');

    li.appendChild(ancMain);
    li.appendChild(ancGallery);
    li.appendChild(icon);
    ancMain.appendChild(mainImg);
    ancMain.appendChild(txt);
    txt.appendChild(h2);
    txt.appendChild(span);
    txt.appendChild(p);
    icon.appendChild(edit);
    icon.appendChild(del);
    gal.appendChild(li);

    for(const img of mainImages){
      if(img.AnnouncementID === AnnouncementID){
        mainImg.classList.add('mainImg');
        Object.assign(mainImg, {
          src: img.ImagePath,
          loading: 'lazy',
          alt: 'main image',
        })
      }
    }
    
    h2.innerText = Title;
    span.innerText = formattedDate;
    p.innerText = Description;
    
    for(const img of galImages){
      if(img.AnnouncementID === AnnouncementID){
        const galImg = document.createElement('img');
  
        Object.assign(galImg, {
          src: img.ImagePath,
          loading: 'lazy',
          alt: 'gallery image',
        })
        
        ancGallery.appendChild(galImg);
      }
    }

    edit.setAttributeNS(null, 'viewBox', '0 0 512 512');
    edit.setAttributeNS(null, 'onclick', 'openModal("anncModal", "Edit")');
    edit.innerHTML = '<path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>';
    
    del.setAttributeNS(null, 'viewBox', '0 0 448 512');
    del.innerHTML = '<path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>';

    edit.addEventListener('click', () => {
      const addGalleryImg = galleryUl.querySelector('.addImg');

      updateId.value = AnnouncementID;
      ancTitle.value = h2.innerText;
      ancDescription.value = p.innerText;
      mainImagePreview.src = mainImg.src;
      mainImagePreview.style.display = 'block';
      mainLabel.classList.add('hasImg');
      mainImgP.style.display = 'none';

      for(const galImg of ancGallery.children){
        const galLi = document.createElement('li');
        const img = document.createElement('img');
        const galBtn = document.createElement('button');
        
        galBtn.type = 'button';
        galBtn.innerHTML = `<img src="../images/svg/xmark.svg" loading="lazy" alt="xmark">`
        img.src = galImg.src;
        galLi.appendChild(galBtn);
        galLi.appendChild(img);
        addGalleryImg.before(galLi);

        galBtn.addEventListener('click', () => {
          galleryUl.removeChild(galLi);
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
            body: JSON.stringify({ id: AnnouncementID }),
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

            gal.removeChild(li);
          });
        }
      });
    });
  }
}
async function getAnncData(){
  try{
    const response = await fetch('/admin/ancGet');
    const data = await response.json();
    return data;
  }
  catch(error){
    console.error('Error fetching data:', error);
  }
}

window.onload = () => {
  getAnncData()
  .then(data => {
    loadAnnouncements(data);
  })
  .catch(error => {
    console.error("Error loading data:", error);
  });
};

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
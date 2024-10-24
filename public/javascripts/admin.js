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

const anncForm = document.querySelector('#announcementForm');
const anncUpdateId = anncForm.querySelector('[type=hidden]');
const anncMainImg = anncForm.querySelector('#ancMainImg');
const anncLabel = anncForm.querySelector('label[for="ancMainImg"]');
const mainImg = anncLabel.querySelector('.imagePreview');
const anncP = anncLabel.querySelector('p');
const anncTitle = anncForm.querySelector('#ancTitle');
const anncDesc = anncForm.querySelector('#ancDescription');
const anncGalImg = anncForm.querySelector('#ancGalleryImg');
const galImg = anncForm.querySelector('.galleryImages');
const anncError = anncForm.querySelector('.errorMsg');
let formType;

anncMainImg.addEventListener('change', (e) => {
  const file = e.target.files[0];

  if(file && file.type.startsWith('image/')){
    mainImg.src = `../images/${file.name}`;
    mainImg.style.display = 'block';
    mainImg.dataset.imgName = file.name;
    anncLabel.classList.add('hasImg');
    anncP.style.display = 'none';
  }
  else{
    mainImg.src = '';
    mainImg.style.display = 'none';
    mainImg.dataset.imgName = '';
    anncLabel.classList.remove('hasImg');
    anncP.style.display = 'block';
  }
});
anncGalImg.addEventListener('change', (e) => {
  const files = e.target.files;
  const addGalleryImg = galImg.querySelector('.addImg');
  
  for(const file of files){
    if(file && file.type.startsWith('image/')){
      const li = document.createElement('li');
      const img = document.createElement('img');
      const btn = document.createElement('button');
      
      btn.type = 'button';
      btn.innerHTML = `<img src="../images/svg/xmark.svg" loading="lazy" alt="xmark">`
      img.classList.add('galImg');
      img.src = URL.createObjectURL(file);
      img.dataset.imgName = file.name;
      li.appendChild(btn);
      li.appendChild(img);
      addGalleryImg.before(li);

      btn.addEventListener('click', () => {
        galImg.removeChild(li);
      });
    }
  }
});
function clearAnncForm(){
  galImg.innerHTML =
    `<li class="addImg">
      <label for="ancGalleryImg">
        <div>+</div>
      </label>
    </li>`;

  anncForm.reset();
  mainImg.src = '';
  mainImg.style.display = 'none';
  anncLabel.classList.remove('hasImg');
  anncP.style.display = 'block';
}
anncForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const title = anncTitle.value;
  const description = anncDesc.value;
  const mImg = mainImg.dataset.imgName;
  const galleryImgs = galImg.querySelectorAll('.galImg');

  if(!mImg){
    anncError.innerText = '*No cover photo selected.';
    anncError.style.opacity = '1';
    return;
  }
  if(galleryImgs.length > 10){
    anncError.innerText = '*Maximum gallery images is 10.';
    anncError.style.opacity = '1';
    return;
  }
  anncError.style.opacity = '0';
  
  const data = {
    title,
    description,
    mainImg: `../images/${mImg}`,
    galleryImgs: [],
  };

  for(const img of galleryImgs){
    data.galleryImgs.push(`../images/${img.dataset.imgName}`);
  }
  
  if(formType === 'Add'){
    fetch('/admin/anncAdd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(res => {
      if(res.success){
        clearAnncForm();
        closeModal();
        getData('annc');
      }
    });
  }
  if(formType === 'Edit'){
    data.id = anncUpdateId.value;

    fetch('/admin/anncUpdate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(res => {
      if(res.success){
        clearAnncForm();
        closeModal();
        getData('annc');
      }
    });
  }
});

const conlForm = document.querySelector('#councilForm');
const conlUpdateId = conlForm.querySelector('[type=hidden]');
const memberImg = conlForm.querySelector('#memberImg');
const memberLabel = conlForm.querySelector('label[for="memberImg"]');
const conlFName = conlForm.querySelector('#firstName');
const conlMInitial = conlForm.querySelector('#middleInitial');
const conlLName = conlForm.querySelector('#lastName');
const conlPosition = conlForm.querySelector('#position');

function clearConlForm(){
  conlForm.reset();
  memberImg.src = '';
  // incomplete
}
conlForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const image = memberImg.value;
  const firstName = conlFName.value;
  const mInitial = conlMInitial.value;
  const lastName = conlLName.value;
  const position = conlPosition.value;
 
  // error handle

  const data = {
    image,
    firstName,
    mInitial,
    lastName,
    position,
  };

  if(formType === 'Add'){
    fetch('/admin/councilAdd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(res => {
      if(res.success){
        clearAnncForm();
        closeModal();
        getData('council');
      }
    });
  }
  if(formType === 'Edit'){
    data.id = anncUpdateId.value;

    fetch('/admin/councilUpdate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(res => {
      if(res.success){
        clearAnncForm();
        closeModal();
        getData('council');
      }
    });
  }
});

const modalList = document.querySelector('.course-modal');
const modals = modalList.querySelectorAll('article');
const anncList = document.querySelector('.anncPreview');
const councilList = document.querySelector('.councilPreview');

function loadAnnouncements(data){
  const { announcements, mainImages, galImages } = data;
  anncList.innerHTML = '';

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
        year: 'numeric',
      })} ${setDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
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
    anncList.appendChild(li);

    for(const img of mainImages){
      if(img.AnnouncementID === AnnouncementID){
        mainImg.classList.add('mainImg');
        Object.assign(mainImg, {
          src: img.ImagePath,
          loading: 'lazy',
          alt: 'main image',
        })
        mainImg.dataset.mainImg = "";
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
        galImg.dataset.mainImg = "";

        ancGallery.appendChild(galImg);
      }
    }
    
    new imageViewer(ancMain);
    new imageViewer(ancGallery);

    edit.setAttributeNS(null, 'viewBox', '0 0 512 512');
    edit.setAttributeNS(null, 'onclick', 'openModal("anncModal", "Edit")');
    edit.innerHTML = '<path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>';
    del.setAttributeNS(null, 'viewBox', '0 0 448 512');
    del.innerHTML = '<path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>';

    edit.addEventListener('click', () => {
      const addGalleryImg = galImg.querySelector('.addImg');
      const mainImgName = mainImg.src.split("/");

      anncUpdateId.value = AnnouncementID;
      anncTitle.value = h2.innerText;
      anncDesc.value = p.innerText;
      mainImg.src = mainImg.src;
      mainImg.style.display = 'block';
      mainImg.dataset.imgName = mainImgName[mainImgName.length - 1];
      anncLabel.classList.add('hasImg');
      anncP.style.display = 'none';

      for(const galImg of ancGallery.children){
        const galLi = document.createElement('li');
        const img = document.createElement('img');
        const galBtn = document.createElement('button');
        
        galBtn.type = 'button';
        galBtn.innerHTML = `<img src="../images/svg/xmark.svg" loading="lazy" alt="xmark">`
        img.classList.add('galImg');
        img.src = galImg.src;

        const galImgName = img.src.split("/");
        img.dataset.imgName = galImgName[galImgName.length - 1];

        galLi.appendChild(galBtn);
        galLi.appendChild(img);
        addGalleryImg.before(galLi);

        galBtn.addEventListener('click', () => {
          galImg.removeChild(galLi);
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
          fetch('/admin/anncDelete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: AnnouncementID }),
          })
          .then(response => response.json())
          .then(res2 => {
            if(res2.success){
              anncList.removeChild(li);
            }
          });
        }
      });
    });
  }
}
function loadCouncil(data){
  for(const member of data.data){
    const { CouncilID, FirstName, MiddleInitial, LastName, Position, Image } = member;
    const li = document.createElement('li');
    const memImg = document.createElement('img');
    const txt = document.createElement('div');
    const p = document.createElement('p');
    const span = document.createElement('span');
    const icon = document.createElement('div');
    const edit = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    const del = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    const fullName = `${FirstName} ${MiddleInitial.split('')[0]}. ${LastName}`;
  
    txt.classList.add('txt');
    icon.classList.add('icon');
  
    li.appendChild(memImg);
    li.appendChild(txt);
    li.appendChild(icon);
    txt.appendChild(p);
    txt.appendChild(span);
    icon.appendChild(edit);
    icon.appendChild(del);
    councilList.appendChild(li);
  
    p.innerText = fullName;
    span.innerText = Position;
  
    Object.assign(memImg, {
      src: Image,
      loading: 'lazy',
      alt: LastName,
    });

    edit.setAttributeNS(null, 'viewBox', '0 0 512 512');
    edit.setAttributeNS(null, 'onclick', 'openModal("anncModal", "Edit")');
    edit.innerHTML = '<path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>';
    del.setAttributeNS(null, 'viewBox', '0 0 448 512');
    del.innerHTML = '<path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>';

    edit.addEventListener('click', () => {

    });
    del.addEventListener('click', () =>{
      modalPN().confirm({
        title: 'Delete Member',
        text: 'Are you want to delete this council member?',
        icon: 'warning',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      },
      function(res){
        if(res.isConfirmed){
          fetch('/admin/councilDelete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: CouncilID }),
          })
          .then(response => response.json())
          .then(res2 => {
            if(res2.success){
              councilList.removeChild(li);
            }
          });
        }
      });
    });
  }
}
function getData(name){
  fetch(`/admin/${name}Get`)
  .then(response => response.json())
  .then(data => {
    if(data.success){
      if(name === 'annc') loadAnnouncements(data);
      if(name === 'council') loadCouncil(data);
    }
  })
  .catch(error => {
    console.error("Error loading data:", error);
  });
}
window.onload = () => {
  getData('annc');
  getData('council');
}

function openModal(className, type){
  const modalH1 = modalList.querySelector(`.${className} > h1`);

  modalList.classList.add('show');
  modalH1.innerText = `${type} Announcement`;
  formType = type;
  
  for(const tag of modals){
    if(tag.classList.contains(className)){
      tag.classList.add('show');
      tag.scrollTop = 0; 
    }
  }
}
function closeModal(){
  modalList.classList.remove('show');
  
  for(i = 0; i < modals.length; i++){
    modals[i].classList.remove('show');
  }
}
const form = document.querySelector('form');
const ancMainImg = form.querySelector('#ancMainImg');
const mainLabel = form.querySelector('label[for="ancMainImg"]');
const mainImagePreview = mainLabel.querySelector('.imagePreview');
const mainImgP = mainLabel.querySelector('p');
const errorMsg = form.querySelector('.errorMsg');

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

const ancGalleryImg = form.querySelector('#ancGalleryImg');
const galleryUl = form.querySelector('.galleryImages');
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


form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const title = form.querySelector('#ancTitle');
  const description = form.querySelector('#ancDescription');
  const mainImg = document.getElementById('ancMainImg').files[0]?.name;
  const galleryImgList = document.getElementById('ancGalleryImg').files;
  
  const galleryImgs = [];
  for(const img of galleryImgList){
    galleryImgs.push(`../images/${img.name}`);
  }
  
  if(!mainImg){
    errorMsg.style.opacity = '1';
    return;
  }

  const data = {
    title: title.value,
    description: description.value,
    mainImg: `../images/${mainImg}`,
    galleryImgs,
  };
  
  
  fetch('/admin/ancAdd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
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

      title.value = '';
      description.value = '';
      mainImagePreview.src = '';
      mainLabel.classList.remove('hasImg');
      mainImagePreview.style.display = 'none';
      mainImgP.style.display = 'block';
    }
  });
});
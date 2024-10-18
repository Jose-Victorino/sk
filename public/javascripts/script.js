function loadAnnouncements(){
  fetch('/admin/ancGet')
    .then(response => response.json())
    .then(data => {
      // const { success, message, announcementsData, imagesData } = data;
      // const announcementList = document.getElementById('main-annc-list');
      
      // if(success){
      //   for(const annc of announcementsData){
      //     const li = document.createElement('li');
      //     const { AnnouncementID, Title, Description, DatePosted } = annc;
      //     const setDate = new Date(DatePosted);
      //     const formattedDate = setDate.toLocaleDateString('en-US', {
      //       month: 'long',
      //       day: 'numeric',
      //       year: 'numeric',
      //       hour: 'numeric',
      //       minute: '2-digit',
      //     });

      //     for(const img of imagesData){
      //       const { ImageType, ImagePath } = img;
      //       if(ImageType === 'main' && img.AnnouncementID === AnnouncementID){
      //         const mainImg = document.createElement('img');

      //         Object.assign(mainImg, {
      //           src: ImagePath,
      //           alt: 'main image',
      //           loading: "lazy",
      //         })
      //         mainImg.dataset.anncMainImg = '';
      //         li.appendChild(mainImg);
      //       }
      //     }

      //     const h2 = document.createElement('h2');
      //     const p = document.createElement('p');

      //     h2.innerText = Title;
      //     h2.dataset.anncTitle = '';
      //     p.innerText = formattedDate;
      //     p.dataset.anncDatePosted = '';
      //     li.appendChild(h2);  
      //     li.appendChild(p);

      //     announcementList.appendChild(li);
      //   }
      // }
      // else{
      //   console.error(message);
      // }
    })
    .catch(error => console.error('Error fetching data:', error));
}
// window.onload = loadAnnouncements();


const anncPreviewUL = document.querySelector('.annc-preview').children;

for(const li of anncPreviewUL){
  const main = li.querySelector('.ancMain');
  const gal = li.querySelector('.ancGallery');

  new imageViewer(main);
  new imageViewer(gal);
}
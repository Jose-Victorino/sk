function loadAnnouncements(){
  fetch('/admin/ancGet')
    .then(response => response.json())
    .then(data => {
      
    })
    .catch(error => console.error('Error fetching data:', error));
}
// window.onload = loadAnnouncements();
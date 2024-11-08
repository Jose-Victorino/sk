const anncList = document.querySelector('.redirect');

anncList.addEventListener('click', (e) => {
  const li = e.target.closest('[data-annc-redirect]');
  
  if(li){
    const hiddenInput = li.querySelector('input[type=hidden]');
    
    if(hiddenInput){
      const id = hiddenInput.value;
      
      window.location.href = `/Announcement/${id}`;
    }
  }
}); 
const anncID = document.querySelector('#anncID').value;
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const textarea = form.querySelector('textarea').value;

  fetch(`/Announcement/${anncID}/addComment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: textarea }),
  })
  .then(response => response.json())
  .then(res => {
    if(res.success){
      form.reset();

      fetch(`/Announcement/${anncID}/getComments`)
      .then(response => response.json())
      .then(res => {
        if(res.success){
          loadComments(res.data);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    }
  });
})

const commentUL = document.querySelector('.commentList');

const loadComments = (data) => {
  commentUL.innerHTML = '';
  
  for(const comment of data){
    const { Text, CommentDate } = comment;
    const li = document.createElement('li');
    const img = document.createElement('img');
    const p = document.createElement('p');
    const span = document.createElement('span');
    const txt = document.createElement('div');
    const setDate = new Date(CommentDate);
    const formattedDate =
      `${setDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })} ${setDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })}`;

    p.textContent = Text;
    span.textContent = formattedDate;
    img.src = '../images/svg/circle-user.svg';
    img.alt = 'user';
    
    txt.appendChild(span);
    txt.appendChild(p);
    li.appendChild(img);
    li.appendChild(txt)
    commentUL.appendChild(li);
  }
}
window.onload = () => {
  fetch(`/Announcement/${anncID}/getComments`)
  .then(response => response.json())
  .then(res => {
    if(res.success){
      loadComments(res.data);
    }
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
}
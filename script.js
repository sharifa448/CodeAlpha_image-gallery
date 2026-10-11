const galleryItems   = document.querySelectorAll('.gallery-item');
const filterButtons  = document.querySelectorAll('.filter-btn');
const lightbox       = document.getElementById('lightbox');
const lightboxImg    = document.getElementById('lightboxImg');
const caption        = document.getElementById('caption');
const closeBtn       = document.getElementById('closeBtn');
const prevBtn        = document.getElementById('prevBtn');
const nextBtn        = document.getElementById('nextBtn');

let currentIndex = 0;
let visibleItems = [...galleryItems]; 


filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    
    galleryItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !match);
    });

    visibleItems = [...galleryItems].filter(
      item => !item.classList.contains('hidden')
    );
  });
});


galleryItems.forEach(item => {
  item.addEventListener('click', () => {
   
    visibleItems = [...galleryItems].filter(
      i => !i.classList.contains('hidden')
    );
    currentIndex = visibleItems.indexOf(item);
    showImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; 
  });
});


function showImage() {
  const item = visibleItems[currentIndex];
  const img  = item.querySelector('img');
  const title = item.querySelector('.overlay span').textContent;

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  caption.textContent = title;

  // Re-trigger zoom animation
  lightboxImg.style.animation = 'none';
  void lightboxImg.offsetWidth;
  lightboxImg.style.animation = 'zoomIn 0.35s ease';
}


function nextImage() {
  currentIndex = (currentIndex + 1) % visibleItems.length;
  showImage();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
  showImage();
}

nextBtn.addEventListener('click', nextImage);
prevBtn.addEventListener('click', prevImage);


function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeLightbox);


lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});


document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;

  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft')  prevImage();
});


let touchStartX = 0;
lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

lightbox.addEventListener('touchend', (e) => {
  const diff = e.changedTouches[0].screenX - touchStartX;
  if (diff < -50) nextImage();
  if (diff > 50)  prevImage();
});
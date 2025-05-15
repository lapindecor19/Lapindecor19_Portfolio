
let current = 0;
let currentSlide = 0;

function goToSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');

  slides[current]?.classList.remove('active');
  dots[current]?.classList.remove('active');
  current = index;
  slides[current]?.classList.add('active');
  dots[current]?.classList.add('active');

  dots.forEach(dot => {
    const circle = dot.querySelector('circle');
    if (circle) {
      circle.style.animation = 'none';
      circle.offsetHeight;
      circle.style.animation = null;
    }
  });
}

function initImageSliders() {
  const sliders = document.querySelectorAll('.img-slider');
  sliders.forEach(slider => {
    const images = slider.querySelectorAll('img');
    let index = 0;

    images.forEach((img, i) => {
      img.style.opacity = i === 0 ? "1" : "0";
      img.style.transition = "opacity 1s ease-in-out";
      img.style.position = "absolute";
      img.style.top = "0";
      img.style.left = "0";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.zIndex = i === 0 ? "1" : "0";
    });

    setInterval(() => {
      images[index].style.opacity = "0";
      images[index].style.zIndex = "0";
      index = (index + 1) % images.length;
      images[index].style.opacity = "1";
      images[index].style.zIndex = "1";
    }, 4000);
  });
}

function animateCardsOnScroll() {
  const cards = document.querySelectorAll('.project-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        const delay = (i % 3) * 150;
        entry.target.style.transitionDelay = `${delay}ms`;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
}

function openLightboxFromImageRef(clickedImgSrc) {
  const lightbox = document.getElementById('lightbox');
  const slider = lightbox.querySelector('.lightbox-slider');
  const fileName = clickedImgSrc.split('/').pop();

  const allImgs = Array.from(document.querySelectorAll('img[src*="avif_images"]'));
  const matchingImgs = allImgs
    .filter(img => img.src.includes(fileName))
    .map(img => img.src);

  if (matchingImgs.length === 0) {
    console.warn("No matching images for:", fileName);
    return;
  }

  slider.innerHTML = '';
  currentSlide = 0;

  matchingImgs.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.classList.toggle('active', i === 0);
    slider.appendChild(img);
  });

  lightbox.classList.remove('hidden');
  updateSlider();
}

function updateSlider() {
  const slider = document.querySelector('.lightbox-slider');
  const images = slider.querySelectorAll('img');
  images.forEach((img, i) => {
    img.classList.toggle('active', i === currentSlide);
  });
    // ✅ จัดภาพให้กลางจอ
  const activeImage = images[currentSlide];
  if (activeImage) {
    activeImage.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  goToSlide(0);
  initImageSliders();
  animateCardsOnScroll();

  const lightbox = document.getElementById('lightbox');
  const slider = lightbox.querySelector('.lightbox-slider');
  const closeBtn = lightbox.querySelector('.close');
  const prevBtn = lightbox.querySelector('.prev');
  const nextBtn = lightbox.querySelector('.next');

  document.querySelectorAll('.project-card .view-text').forEach(view => {
    view.addEventListener('click', function (e) {
      e.stopPropagation();
      const container = this.closest('.project-card');
      const img = container.querySelector('img');
      if (img) {
        openLightboxFromImageRef(img.getAttribute('src'));
      }
    });
  });

  prevBtn.onclick = () => {
    const images = slider.querySelectorAll('img');
    if (images.length === 0) return;
    currentSlide = (currentSlide - 1 + images.length) % images.length;
    updateSlider();
  };

  nextBtn.onclick = () => {
    const images = slider.querySelectorAll('img');
    if (images.length === 0) return;
    currentSlide = (currentSlide + 1) % images.length;
    updateSlider();
  };

  closeBtn.onclick = () => {
    lightbox.classList.add('hidden');
    slider.innerHTML = '';
  };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      lightbox.classList.add('hidden');
      slider.innerHTML = '';
    }
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.add('hidden');
      slider.innerHTML = '';
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  slider.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) nextBtn.click();
    if (touchEndX > touchStartX + 50) prevBtn.click();
  });
});

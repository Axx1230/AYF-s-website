// Toggle Mobile Menu
function toggleMenu() {
  const links = document.getElementById("myLinks");
  playVineSound();
  if (links) {
    if (window.getComputedStyle(links).display === "none") {
      links.style.display = "block";
    } else {
      links.style.display = "none";
    }
  }
}

// Play Vine Boom Sound
const vineBoomSound = new Audio('https://www.myinstants.com/media/sounds/vine-boom-sound-effect.mp3');
vineBoomSound.preload = 'auto';

function playVineSound() {
  // Reset the audio to start
  vineBoomSound.currentTime = 0;
  // Play the sound
  vineBoomSound.play().catch(e => {
    console.log('Audio play failed:', e);
    // Fallback: try to load and play again
    vineBoomSound.load();
    vineBoomSound.play().catch(e => console.log('Retry failed:', e));
  });
}

// Add vine sound to all navigation links
document.addEventListener('DOMContentLoaded', () => {
  // Pre-load the sound
  vineBoomSound.load();
  
  const navLinks = document.querySelectorAll('.topnav a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Don't play sound for the menu toggle button
      if (!link.classList.contains('icon')) {
        playVineSound();
      }
    });
  });
  
  // Existing banner slider code
  showSlides();
  setInterval(showSlides, 3000);
  
  // Handle Contact Form Submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      alert(`Thank you, ${name}! Your message has been received. We will get back to you soon.`);
      contactForm.reset();
    });
  }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const element = document.querySelector(this.getAttribute('href'));
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
      });
    }
  });
});

// Auto Banner Slider
let currentSlide = 0;
function showSlides() {
  const slides = document.querySelectorAll('.banner-slide');
  if (slides.length > 0) {
    slides.forEach((slide) => {
      slide.style.display = 'none';
      slide.classList.remove('active');
    });
    slides[currentSlide].style.display = 'block';
    slides[currentSlide].classList.add('active');
    currentSlide = (currentSlide + 1) % slides.length;
  }
}

// Open Fullscreen Modal
function openFullscreen(image, title, price, description = '') {
  const modal = document.getElementById('fullscreenModal');
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');

  if (modal && modalImage && modalCaption) {
    modal.style.display = 'flex';
    modalImage.src = image.startsWith('img/') ? image : `img/${image}`;
    modalCaption.innerHTML = `
      <h3>${title}</h3>
      <p class="price">${price}</p>
      <p class="description">${description}</p>
    `;
    modal.classList.remove('hidden');
  }
}

// Close Fullscreen Modal
function closeFullscreen() {
  const modal = document.getElementById('fullscreenModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.add('hidden');
  }
}

// Close modal when clicking outside the image
window.onclick = function (event) {
  const modal = document.getElementById('fullscreenModal');
  if (event.target === modal) {
    closeFullscreen();
  }
};
// Toggle Mobile Menu
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('hidden');
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth',
    });
  });
});

// Auto Banner Slider
let currentSlide = 0;
function showSlides() {
  const slides = document.querySelectorAll('.banner-slide');
  slides.forEach((slide, index) => {
    slide.style.display = index === currentSlide ? 'block' : 'none';
  });
  currentSlide = (currentSlide + 1) % slides.length;
}
setInterval(showSlides, 3000); // Change banner every 3 seconds
document.addEventListener('DOMContentLoaded', showSlides);

// Open Fullscreen Modal
function openFullscreen(image, title, price) {
  const modal = document.getElementById('fullscreenModal');
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');

  modal.style.display = 'flex';
  modalImage.src = `images/${image}`;
  modalCaption.innerHTML = `<h3>${title}</h3><p>${price}</p>`;
}

// Close Fullscreen Modal
function closeFullscreen() {
  const modal = document.getElementById('fullscreenModal');
  modal.style.display = 'none';
}

// Close modal when clicking outside the image
window.onclick = function (event) {
  const modal = document.getElementById('fullscreenModal');
  if (event.target === modal) {
    closeFullscreen();
  }
};

// Handle Contact Form Submission
function handleContactFormSubmit(event) {
  event.preventDefault(); // Prevents form from submitting the default way

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  // Display a confirmation message (could be an alert, or displayed on the page)
  alert(
    `Thank you, ${name}! Your message has been received. We will get back to you soon.`
  );

  // Optionally, reset the form fields
  document.querySelector('.contact-form').reset();
}

// Attach the form submit handler
document
  .querySelector('.contact-form')
  .addEventListener('submit', handleContactFormSubmit);

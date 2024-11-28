// Smooth Scrolling for Navigation
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth',
    });
  });
});

// Header Transition
window.addEventListener('scroll', () => {
  const header = document.querySelector('.fancy-header');
  header.classList.toggle('scrolled', window.scrollY > 50);
});

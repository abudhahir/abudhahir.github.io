// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
let isLight = false;
themeToggle.addEventListener('click', () => {
  isLight = !isLight;
  html.setAttribute('data-theme', isLight ? 'light' : '');
  themeToggle.textContent = isLight ? '☀️' : '🌙';
});

// Accordion
const accordionHeaders = document.querySelectorAll('.accordion-header');
accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    item.classList.toggle('active');
  });
}); 
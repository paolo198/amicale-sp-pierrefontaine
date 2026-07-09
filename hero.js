const heroWrap = document.getElementById('hero-pin-wrap');
const heroSlides = document.querySelectorAll('.hero-slide');

if (heroWrap && heroSlides.length > 1) {
  heroWrap.style.height = (heroSlides.length * 100) + 'vh';

  function updateHero() {
    const rect = heroWrap.getBoundingClientRect();
    const total = heroWrap.offsetHeight - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    const progress = total > 0 ? scrolled / total : 0;
    const position = progress * (heroSlides.length - 1);

    heroSlides.forEach((slide, i) => {
      const distance = Math.abs(position - i);
      const opacity = Math.max(0, 1 - distance);
      slide.style.opacity = opacity;
    });
  }

  window.addEventListener('scroll', updateHero, { passive: true });
  window.addEventListener('resize', updateHero);
  updateHero();
}

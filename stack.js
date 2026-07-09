const panels = document.querySelectorAll('.stack-panel');
let ticking = false;

function updateStack() {
  const vh = window.innerHeight;

  panels.forEach((panel, i) => {
    const next = panels[i + 1];
    if (!next) return;

    const rect = next.getBoundingClientRect();
    let progress = 1 - (rect.top / vh);
    progress = Math.min(Math.max(progress, 0), 1);

    panel.style.transform = `scale(${1 - 0.08 * progress})`;
    panel.style.filter = `brightness(${1 - 0.35 * progress})`;

    next.style.transform = `scale(${1.06 - 0.06 * progress})`;
  });
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateStack();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateStack);
updateStack();

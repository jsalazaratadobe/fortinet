function addCarouselNav(block) {
  const ul = block.querySelector(':scope > ul');
  if (!ul || ul.children.length < 4) return;

  const wrapper = block.closest('.cards-wrapper');
  if (!wrapper || wrapper.querySelector('.carousel-nav')) return;

  const nav = document.createElement('div');
  nav.className = 'carousel-nav';

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.setAttribute('aria-label', 'Previous');
  prev.textContent = '‹';

  const next = document.createElement('button');
  next.type = 'button';
  next.setAttribute('aria-label', 'Next');
  next.textContent = '›';

  const progress = document.createElement('div');
  progress.className = 'carousel-progress';
  const bar = document.createElement('div');
  bar.className = 'carousel-progress-bar';
  progress.append(bar);

  nav.append(prev, progress, next);
  wrapper.append(nav);

  function updateProgress() {
    const max = ul.scrollWidth - ul.clientWidth;
    const pct = max > 0 ? (ul.scrollLeft / max) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(pct, 5))}%`;
  }

  function getScrollAmount() {
    const li = ul.querySelector(':scope > li');
    return li ? li.offsetWidth + 24 : 400;
  }

  prev.addEventListener('click', () => {
    ul.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });
  next.addEventListener('click', () => {
    ul.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });
  ul.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

export default function decorate(doc) {
  doc.body.classList.add('fortigate');

  const main = doc.querySelector('main');
  if (!main) return;

  const observer = new MutationObserver((_, obs) => {
    const blocks = main.querySelectorAll(
      '.section:nth-of-type(n+8) .cards.block[data-block-status="loaded"]',
    );
    if (!blocks.length) return;

    blocks.forEach((block) => addCarouselNav(block));
    obs.disconnect();
  });
  observer.observe(main, { childList: true, subtree: true });
}

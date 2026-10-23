const button = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
if (button && nav) {
  const close = () => { button.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && button.getAttribute('aria-expanded') === 'true' && !document.querySelector('.photo-album[open]')) {
      close(); button.focus();
    }
  });
  document.documentElement.classList.add('js');
}
const links = [...document.querySelectorAll('.primary-nav a')];
const sections = [...document.querySelectorAll('main > section[id]')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const active = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
    if (!active) return;
    links.forEach(a => {
      if (a.hash === '#' + active.target.id) a.setAttribute('aria-current','location');
      else a.removeAttribute('aria-current');
    });
  }, {rootMargin:'-12% 0px -48% 0px',threshold:0});
  sections.forEach(s => observer.observe(s));
}

const album = document.querySelector('#photo-album');
const albumTrigger = document.querySelector('.portrait-trigger');
const albumData = document.querySelector('#photo-album-data');
if (album && albumTrigger && albumData) {
  const photos = JSON.parse(albumData.textContent);
  let image = album.querySelector('.album-image');
  const caption = album.querySelector('.album-caption');
  let portraitImage = document.querySelector('.portrait-photo');
  const portraitPlace = document.querySelector('.portrait-place');
  const portraitNext = document.querySelector('.portrait-next');
  const counter = album.querySelector('.album-counter');
  const thumbnails = [...album.querySelectorAll('.album-thumbnail')];
  let index = 0;
  let displayedIndex = 0;
  let direction = 1;
  let changing = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Decode before displaying, so the existing photograph stays visible on slow connections.
  const ready = photos.map(photo => {
    const preload = new Image();
    preload.src = photo.src;
    return preload.decode().then(() => true, () => false);
  });

  const slidePhoto = async (current, photo, animate, step) => {
    const incoming = current.cloneNode();
    incoming.src = photo.src;
    incoming.alt = photo.alt;
    incoming.width = photo.width;
    incoming.height = photo.height;
    incoming.style.objectPosition = photo.objectPosition || '50% 42%';
    incoming.setAttribute('aria-hidden', 'true');
    current.after(incoming);
    if (animate && !reducedMotion.matches && incoming.animate) {
      const timing = {duration: 680, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'both'};
      const arriving = incoming.animate([
        {translate:`${step * 100}% 0`}, {translate:'0 0'}
      ], timing);
      const departing = current.animate([
        {translate:'0 0'}, {translate:`${step * -100}% 0`}
      ], timing);
      await Promise.all([arriving.finished, departing.finished]);
      arriving.cancel();
      departing.cancel();
    }
    current.remove();
    incoming.removeAttribute('aria-hidden');
    return incoming;
  };

  const renderPhoto = async () => {
    if (changing) return;
    changing = true;
    try {
      // Finish one slide at a time; rapid clicks coalesce to the latest requested photo.
      while (displayedIndex !== index) {
        const target = index;
        const loaded = await ready[target];
        if (target !== index) continue;
        if (!loaded) { index = displayedIndex; break; }
        const photo = photos[target];
        const step = direction;
        caption.textContent = photo.caption;
        portraitPlace.textContent = photo.caption;
        counter.textContent = `${target + 1} / ${photos.length}`;
        thumbnails.forEach((thumbnail,i) => thumbnail.setAttribute('aria-pressed',String(i === target)));
        [portraitImage, image] = await Promise.all([
          slidePhoto(portraitImage, photo, true, step),
          slidePhoto(image, photo, album.open, step)
        ]);
        displayedIndex = target;
      }
    } finally {
      changing = false;
    }
  };

  const showPhoto = next => {
    direction = next < index ? -1 : 1;
    index = (next + photos.length) % photos.length;
    void renderPhoto();
  };

  albumTrigger.addEventListener('click', () => {
    showPhoto(index);
    album.showModal();
    albumTrigger.setAttribute('aria-expanded','true');
    document.documentElement.classList.add('album-open');
  });
  portraitNext.addEventListener('click', () => showPhoto(index + 1));
  album.querySelector('.album-close').addEventListener('click', () => album.close());
  album.querySelector('.album-previous').addEventListener('click', () => showPhoto(index - 1));
  album.querySelector('.album-next').addEventListener('click', () => showPhoto(index + 1));
  thumbnails.forEach((thumbnail,i) => thumbnail.addEventListener('click', () => showPhoto(i)));
  album.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      const controls = [...album.querySelectorAll('button:not([disabled])')];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      showPhoto(index + (e.key === 'ArrowRight' ? 1 : -1));
    }
  });
  album.addEventListener('click', e => {
    if (e.target !== album) return;
    const rect = album.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) album.close();
  });
  album.addEventListener('close', () => {
    document.documentElement.classList.remove('album-open');
    albumTrigger.setAttribute('aria-expanded','false');
    albumTrigger.focus({preventScroll:true});
  });
}

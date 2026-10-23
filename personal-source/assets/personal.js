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
  const image = album.querySelector('.album-image');
  const caption = album.querySelector('.album-caption');
  const portraitImage = document.querySelector('.portrait-photo');
  const portraitPlace = document.querySelector('.portrait-place');
  const portraitNext = document.querySelector('.portrait-next');
  const counter = album.querySelector('.album-counter');
  const thumbnails = [...album.querySelectorAll('.album-thumbnail')];
  let index = 0;

  const showPhoto = next => {
    index = (next + photos.length) % photos.length;
    const photo = photos[index];
    image.src = photo.src;
    image.alt = photo.alt;
    image.width = photo.width;
    image.height = photo.height;
    image.style.objectPosition = photo.objectPosition || '50% 42%';
    caption.textContent = photo.caption;
    portraitImage.src = photo.src;
    portraitImage.alt = photo.alt;
    portraitImage.width = photo.width;
    portraitImage.height = photo.height;
    portraitImage.style.objectPosition = photo.objectPosition || '50% 42%';
    portraitPlace.textContent = photo.caption;
    counter.textContent = `${index + 1} / ${photos.length}`;
    thumbnails.forEach((thumbnail,i) => thumbnail.setAttribute('aria-pressed',String(i === index)));
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

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.resolve(root, '../personal-site');
const c = JSON.parse(fs.readFileSync(path.join(root, 'content.json'), 'utf8'));
const publication = fs.readFileSync(path.join(root, 'publication.html'), 'utf8').trim();
const esc = s => String(s ?? '').replace(/[&<>"']/g, a => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[a]));
const external = (url, label, cls = '') => `<a href="${esc(url)}"${cls ? ` class="${cls}"` : ''} target="_blank" rel="noopener noreferrer">${label}<span class="sr-only"> (opens in a new tab)</span></a>`;
const month = iso => iso ? `<time datetime="${iso}">${new Intl.DateTimeFormat('en-GB', {month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(iso+'-01T12:00:00Z'))}</time>` : 'Present';
const period = item => `${month(item.start)} <span aria-hidden="true">—</span><span class="sr-only"> to </span> ${month(item.end)}`;
const sections = [['about','About'],['education','Education'],['research','Research'],['publications','Publication'],['awards','Awards & Honours'],['contact','Contact']];
const sectionHead = (id, title, n) => `<div class="section-heading"><span class="section-index" aria-hidden="true">${n}</span><h2 id="${id}-title">${title}</h2></div>`;
const entries = (list, experience = false) => list.map(item => `<li class="record"><div class="record-date">${period(item)}</div><div class="record-content"><h4>${esc(item.title)}${experience && item.jointProgramme ? '<sup class="programme-asterisk"><a href="#joint-programme-note" aria-label="Joint undergraduate programme note">*</a></sup>' : ''}</h4><p class="institution">${esc(item.institution)}</p>${item.note ? `<p class="record-note">${esc(item.note)}</p>` : ''}${experience ? `<p class="record-location"><span class="location-dot" aria-hidden="true"></span><span class="sr-only">Location: </span>${esc(item.location)}</p>` : ''}</div></li>`).join('');
const awards = c.awards.map(a => `<li class="award"><div class="award-date">${month(a.date)}</div><div><h3>${esc(a.name)}</h3><p class="institution">${esc(a.institution)}</p>${a.description ? `<p class="record-note">${esc(a.description)}</p>` : ''}</div></li>`).join('');
const profiles = [['GitHub','yongqi-yuan',c.contact.github],['Google Scholar','Publications & citations',c.contact.scholar],['ORCID','0009-0004-7632-3743',c.contact.orcid],['Nabla Lab','Research community',c.contact.lab]].map(([label,detail,url]) => external(url,`<span class="profile-label">${label}</span><span class="profile-detail">${detail}</span><span class="arrow" aria-hidden="true">↗</span>`,'profile-link')).join('');
const header = `<a class="skip-link" href="#main">Skip to main content</a><header class="site-header"><div class="container header-inner"><a class="brand" href="/#about" aria-label="Yongqi Yuan home">Academic profile</a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav">Menu <span aria-hidden="true">＋</span></button><nav id="main-nav" class="primary-nav" aria-label="Main navigation">${sections.map(([id,title]) => `<a href="/#${id}">${title}</a>`).join('')}</nav></div></header>`;
const footer = `<footer class="site-footer"><div class="container footer-inner"><p>© 2026 Yongqi Yuan. All rights reserved.</p><a href="#about">Back to top <span aria-hidden="true">↑</span></a></div></footer>`;
const hero = `<section id="about" class="hero" aria-labelledby="name">
  <div class="container hero-grid">
    <div class="hero-copy">
      <p class="eyebrow"><span aria-hidden="true"></span> About</p>
      <h1 id="name">${esc(c.name)}</h1>
      <p class="post-nominals">${esc(c.postNominals)}</p>
      <p class="hero-bio">I am currently a graduate student in the Department of Engineering Science and Lady Margaret Hall, University of Oxford.</p>
      <p class="hero-bio">I study nonlinear wave forces and wave–structure interaction, combining computational fluid dynamics with theoretical analysis.</p>
      <p class="hero-bio">I am a co-founder and member of ${external(c.contact.lab,'Nabla Lab')}, an open, independent, and curiosity-driven research community. We share a passion for science and engineering, value collaboration, and embrace the opportunities and challenges of the AI era.</p>
    </div>
    <div class="hero-image">
      <figure class="portrait">
        <button class="portrait-trigger" type="button" aria-haspopup="dialog" aria-controls="photo-album" aria-expanded="false" aria-label="Open photo album, 3 photographs">
          <img class="portrait-photo" src="${esc(c.portrait.src)}" width="${c.portrait.width}" height="${c.portrait.height}" fetchpriority="high" alt="${esc(c.portrait.alt)}" style="object-position:${esc(c.portrait.objectPosition)}">
        </button>
        <figcaption><span class="portrait-place" aria-live="polite" aria-atomic="true">${esc(c.portrait.caption)}</span><button class="portrait-next" type="button" aria-label="Next photograph"><svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7 4 6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button></figcaption>
      </figure>
      <div class="portrait-offset" aria-hidden="true"></div>
    </div>
  </div>
</section>`;
const albumPhotos = [c.portrait, ...c.educationPhotos];
const album = `<dialog class="photo-album" id="photo-album" aria-labelledby="album-title">
  <div class="album-header"><h2 id="album-title">Photographs</h2><div class="album-header-actions"><span class="album-counter" aria-live="polite" aria-atomic="true">1 / ${albumPhotos.length}</span><button class="album-close" type="button" aria-label="Close photo album" autofocus>×</button></div></div>
  <div class="album-stage">
    <button class="album-previous" type="button" aria-label="Previous photo">←</button>
    <div class="album-viewport"><img class="album-image" src="${esc(c.portrait.src)}" width="${c.portrait.width}" height="${c.portrait.height}" alt="${esc(c.portrait.alt)}" style="object-position:${esc(c.portrait.objectPosition)}"></div>
    <button class="album-next" type="button" aria-label="Next photo">→</button>
  </div>
  <div class="album-details"><h3 class="album-caption">${esc(c.portrait.caption)}</h3></div>
  <div class="album-thumbnails" role="group" aria-label="Choose a photograph">${albumPhotos.map((p,i)=>`<button type="button" class="album-thumbnail" data-photo-index="${i}" aria-label="Show photo ${i+1}: ${esc(p.caption)}" aria-pressed="${i===0}"><img src="${esc(p.src)}" width="${p.width}" height="${p.height}" alt="" loading="lazy"></button>`).join('')}</div>
</dialog><script type="application/json" id="photo-album-data">${JSON.stringify(albumPhotos).replace(/</g,'\\u003c')}</script>`;
const education = `<section id="education" class="academic-section container" aria-labelledby="education-title">${sectionHead('education','Education','01')}<div class="section-body"><div class="subsection"><h3 class="subheading">Qualification</h3><ul class="record-list">${entries(c.qualification)}</ul></div><div class="subsection experience"><h3 class="subheading">Experience</h3><ul class="record-list">${entries(c.experience,true)}</ul><p class="joint-note" id="joint-programme-note">* ${esc(c.experienceNote)}</p></div></div></section>`;
const research = `<section id="research" class="research-section" aria-labelledby="research-title"><div class="container academic-section">${sectionHead('research','Research','02')}<div class="section-body research-body"><ul class="research-list">${c.research.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div></div></section>`;
const papers = `<section id="publications" class="academic-section container" aria-labelledby="publications-title">${sectionHead('publications','Publication','03')}<div class="section-body">${publication}</div></section>`;
const honours = `<section id="awards" class="academic-section container" aria-labelledby="awards-title">${sectionHead('awards','Awards & <br>Honours','04')}<div class="section-body"><ul class="awards-list">${awards}</ul></div></section>`;
const contact = `<section id="contact" class="contact-section" aria-labelledby="contact-title"><div class="container academic-section">${sectionHead('contact','Contact','05')}<div class="section-body"><div class="email-block"><p class="contact-label">Academic email</p><a class="email-link" href="mailto:${c.contact.academicEmail}">${c.contact.academicEmail}<span aria-hidden="true">↗</span></a><p class="contact-label secondary-email-label">Personal email</p><a class="secondary-email" href="mailto:${c.contact.personalEmail}">${c.contact.personalEmail}</a></div><div class="profile-links">${profiles}</div></div></div></section>`;
const schema = {'@context':'https://schema.org','@type':'Person',name:c.name,url:'https://yongqi-yuan.com/',image:`https://yongqi-yuan.com${c.portrait.src}`,jobTitle:'Graduate Student',affiliation:[{'@type':'Organization',name:'University of Oxford'},{'@type':'Organization',name:'Lady Margaret Hall'}],sameAs:[c.contact.github,c.contact.scholar,c.contact.orcid]};
fs.mkdirSync(path.join(output,'assets'),{recursive:true});
for (const file of fs.readdirSync(path.join(root,'assets'))) fs.copyFileSync(path.join(root,'assets',file),path.join(output,'assets',file));
const version = createHash('sha256').update(fs.readFileSync(path.join(root,'assets/personal.css'))).digest('hex').slice(0,10);
const scriptVersion = createHash('sha256').update(fs.readFileSync(path.join(root,'assets/personal.js'))).digest('hex').slice(0,10);
const faviconVersion = createHash('sha256').update(fs.readFileSync(path.join(root,'assets/favicon.svg'))).digest('hex').slice(0,10);
const head = (title,description,structured=true) => `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#005375"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website"><meta property="og:url" content="https://yongqi-yuan.com/"><meta property="og:image" content="https://yongqi-yuan.com${c.portrait.src}"><link rel="canonical" href="https://yongqi-yuan.com/"><link rel="icon" href="/assets/favicon.svg?v=${faviconVersion}" type="image/svg+xml"><link rel="stylesheet" href="/assets/personal.css?v=${version}"><script src="/assets/personal.js?v=${scriptVersion}" defer></script>${structured?`<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`:''}</head>`;
fs.writeFileSync(path.join(output,'index.html'),`${head('Yongqi Yuan | Academic Homepage',c.description)}<body>${header}<main id="main">${hero}${education}${research}${papers}${honours}${contact}</main>${footer}${album}</body></html>\n`);
fs.writeFileSync(path.join(output,'404.html'),`${head('Page not found | Yongqi Yuan','The requested page could not be found.',false)}<body>${header}<main id="main" class="container error-page"><p class="eyebrow">404</p><h1>Page not found</h1><p>This address does not point to a page on this website.</p><a href="/">Return to the homepage →</a></main>${footer}</body></html>\n`);
console.log('Built personal-site from personal-source. Local files only; nothing published.');

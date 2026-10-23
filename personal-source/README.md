# Personal homepage

This is the editable source for the GitHub Pages site at https://yongqi-yuan.com/.

- Edit `content.json` for qualifications, experience, research interests, awards, contact links and photo captions.
- Edit `publication.html` for the publication list, preserved from the previous approved version.
- Edit `assets/personal.css` for the design.
- Run `node personal-source/build.mjs` from the repository root to regenerate `personal-site/`.
- Preview with `python3 -m http.server 6180 --bind 127.0.0.1 --directory personal-site`.

The photos and BibTeX file remain in `personal-site/assets/`. All website assets are served locally by GitHub Pages; no external fonts or OpenAI runtime are used. The main photo is DSC04294 from Matriculation Day; the undergraduate photos are DSCF5606 (HIT) and the representative portrait (Strathclyde). The originals remain untouched on the Desktop. Web copies use CSS cropping, and the discreet arrow in the About portrait caption cycles three 4:5 photos labelled Oxford, Weihai and Glasgow. Clicking the portrait opens a matching three-photo modal album with thumbnails, arrow-key navigation and Escape to close. The Weihai photo uses a top-biased CSS crop to trim the lower part. There are no photos at the foot of the page. Research contains text bullets only.

Publishing uses the existing GitHub Pages workflow. Build first, then push the generated personal-site files together with personal-source to master.

# Personal homepage migration

Destination: `yongqi-yuan/yongqi-yuan.github.io`.

The repository is temporarily public for GitHub Free hosting. It is intended to become private after GitHub Pro is active; the website will stay public.
Domain: `https://yongqi-yuan.com/`.

`personal-site/` preserves the latest published personal homepage, including the portrait, five awards, research introduction, publications and Oxford contact email. The HTML was checked against the original Sites publication; only the hosting provider’s injected challenge script is omitted.

The original repository history and academicpages template can remain intact. Set Pages to GitHub Actions and deploy with `.github/workflows/personal-pages.yml`. Only `personal-site/` is deployed; only published website files are included in that artifact. Repository visibility is managed separately. GitHub Pro must be active before converting a Pages source repository to private.

Edit `personal-site/index.html` for page content and `personal-site/assets/personal.css` for appearance. Assets stay under `personal-site/assets/`. No dependencies or build step are needed. Browser-delivered HTML, CSS and images remain accessible to website visitors, even though the source repository is private.

Before switching DNS, verify Pages deployment and the custom-domain settings. Preserve the former DNS records for rollback. The previous Sites DNS configuration is preserved in the local migration notes for rollback.

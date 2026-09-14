# Elias Borer

Personal CV website with an interactive Diversification Lab. Built with Astro,
React and Recharts. Fonts are bundled locally; no analytics or market-data API.

## Model

Two hypothetical assets represent Swiss equities and CHF bonds. Assumed annual
volatilities are 18% and 6%. Equity weight and correlation are adjustable.
Portfolio volatility follows the standard two-asset covariance formula. The
diversification benefit is the difference from a perfect-correlation baseline.
These are illustrative assumptions, not observed returns or investment advice.

## Development

Run the development server in Docker:

```sh
docker compose -f docker-compose.dev.yml up -d
docker compose -f docker-compose.dev.yml exec website-dev npm run check
docker compose -f docker-compose.dev.yml exec website-dev npm test
```

Open http://localhost:4321. For trusted LAN access, set `DEV_BIND_IP` explicitly.
Never expose the development server to the internet.

## GitHub Pages

Select GitHub Actions in repository Settings > Pages. Set the repository Actions
variable `PUBLICATION_APPROVED=true`, then run **Publish GitHub Pages** on `main`
with `publish` checked. Deployments are manual. The workflow audits dependencies,
checks types, runs tests and verifies the generated static output before upload.
GitHub's Pages configuration supplies the canonical URL and asset base path.

CI checks root and project-subdirectory builds. The GitHub hosting privacy notice
is verified, as are local assets, fonts, canonical URLs and absence of old data.
The `/portfolio-risk/` URL is a noindex compatibility alias of the homepage.

For the custom domain `eliasborer.ch`, verify ownership using GitHub's exact TXT
record, configure the Pages custom domain, then update only website DNS records:

| Host | Type | Value |
| --- | --- | --- |
| @ | A | 185.199.108.153 |
| @ | A | 185.199.109.153 |
| @ | A | 185.199.110.153 |
| @ | A | 185.199.111.153 |
| www | CNAME | eljolabs.github.io |

Preserve MX, SPF, DKIM, DMARC and verification records. Remove conflicting web
records only. Enable Enforce HTTPS once GitHub's certificate is ready, and rerun
the workflow after changing the Pages custom domain.

See [GitHub's custom domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Content and maintenance

CV content: `src/components/App.tsx`. Interactive lab:
`src/components/DiversificationLab.tsx`. Model: `src/lib/diversification.ts`.
Tests: `tests/`. The optional Docker production server is for local previews;
its Nginx response headers do not apply to GitHub Pages.

This repository starts with a reviewed clean snapshot. No previous private Git
history, historical financial datasets or personal wiki is included. Publish
only reviewed changes; never mirror another repository's history here.
To roll back, create a `git revert` commit, pass CI and publish it manually.

Original content is UNLICENSED. Dependencies and fonts retain their respective
licenses. See `THIRD_PARTY_NOTICES.md` and `public/licenses/`.

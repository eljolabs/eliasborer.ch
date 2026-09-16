# Elias Borer

Personal CV website with an interactive Diversification Lab. Built with Astro,
React and Recharts. Fonts are bundled locally; no analytics or market-data API.

Live website: [eliasborer.ch](https://eliasborer.ch).

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

Open http://localhost:4321. The development server is bound to localhost by default.

## GitHub Pages

The website is hosted on GitHub Pages. Deployments are manual and run from `main`.
The publishing workflow audits dependencies,
checks types, runs tests and verifies the generated static output before upload.
GitHub's Pages configuration supplies the canonical URL and asset base path.

CI checks root and project-subdirectory builds. The GitHub hosting privacy notice
is verified, as are local assets, fonts and canonical URLs.
The `/portfolio-risk/` URL is a noindex compatibility alias of the homepage.

## Content and maintenance

CV content: `src/components/App.tsx`. Interactive lab:
`src/components/DiversificationLab.tsx`. Model: `src/lib/diversification.ts`.
Tests: `tests/`. The optional Docker production server is for local previews;
its Nginx response headers do not apply to GitHub Pages.

Original content is UNLICENSED. Dependencies and fonts retain their respective
licenses. See `THIRD_PARTY_NOTICES.md` and `public/licenses/`.

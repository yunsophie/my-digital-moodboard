# My Digital Moodboard

help me make a personal website for a computer science studen to highlight my experience and projects. I want it to be inspired by "moodboards" -- think the style of a pinterest inspired web app, editorial style with clean editorial layouts, minimalist high-end typography, modern serif fonts, and neutral aesthetic palettes used for mood boards and social media grids. before starting, make sure it is github compatible and showcases my experience and personality.

This project was built with [Lovable](https://lovable.dev) for CSE 490A at UW (AI-Assisted Software Development).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e749620b-801d-4bd3-a5ea-72e2fe4203d8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## GitHub Pages

The site deploys to [yunsophie.github.io/my-digital-moodboard](https://yunsophie.github.io/my-digital-moodboard/) when changes are pushed to `main`. In the repository's **Settings → Pages**, select **GitHub Actions** as the publishing source.

The workflow installs dependencies from `bun.lock`, runs `bun run build:pages`, and uploads `dist/client`. That build prerenders the homepage to `index.html`, bundles the portfolio images, and uses the base path supplied by GitHub Pages. GitHub Pages serves these files without a running server.

To build the same static site locally:

```sh
npm run build:pages
```

Set `GITHUB_PAGES_BASE_PATH` to override the default `/my-digital-moodboard` path. For a custom domain or a user site hosted at the domain root, set it to `/`. The regular `npm run build` keeps the Lovable server deployment.

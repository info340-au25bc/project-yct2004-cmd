# INFO 340 Project

By: Chuantong Yang, Visar Krasniqi

link to firebase deployment: https://info340-final-project-74082.web.app/ 

link to github pages: https://info340-au25bc.github.io/project-yct2004-cmd/

This repository contains code for an interactive information web app, created for INFO 340 _Client-Side Web Development_ course at the UW iSchool.

## Quick Start (local)

1. Install dependencies

```bash
npm install
```

2. Start the dev server (Vite)

```bash
npm run dev
# then open http://127.0.0.1:5173 in your browser
```

3. Build production bundle

```bash
npm run build
```

4. Preview production build locally

```bash
npm run preview
```

## Firebase Hosting (deploy)

If you want to deploy to Firebase Hosting:

1. Install Firebase CLI (if not installed):
```bash
npm install -g firebase-tools
```
2. Login:
```bash
firebase login
```
3. Initialize hosting (select `dist` as public directory, single-page app = Y):
```bash
firebase init hosting
```
4. Build then deploy:
```bash
npm run build
firebase deploy
```

Note: if you encounter permission errors during `firebase init` (403), ensure your Google account has the necessary permissions for the selected GCP project or create a new Firebase project with `firebase projects:create <project-id>`.

## Tests

This project currently does not include automated tests. To add basic tests, install `jest` and `@testing-library/react` and create simple component/unit tests.

## Contributors & Workflow

- Use feature branches for new work: `git checkout -b feature/your-feature`
- Commit small changes and open pull requests to `main`.
- Avoid force-pushing to shared `main`; if you rebase locally, push with `--force-with-lease` and coordinate with teammates.

## Contact

If you need help running the app or deploying, open an issue or contact the authors listed above.

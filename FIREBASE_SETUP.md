# Firebase Hosting Setup Guide

This guide will help you set up Firebase Hosting for your React project.

## Prerequisites

- Node.js and npm installed
- A Google account (for Firebase)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the prompts to create your project
4. Note your project ID (you'll need this later)

## Step 2: Install Firebase CLI Tools

Run the following command in your terminal:

```bash
npm install -g firebase-tools
```

## Step 3: Login to Firebase

```bash
firebase login
```

This will open a browser window for you to authenticate with your Google account.

## Step 4: Initialize Firebase Hosting

From your project root directory (the same folder as `package.json`), run:

```bash
firebase init
```

**Important configuration options:**
- Select **Hosting** (use arrow keys and spacebar to select)
- Choose your Firebase project from the list (or select "[don't set up a default project]" if it's not there)
- For the **public directory**, type: `dist` (NOT the default `public`)
- Configure as a **single-page app**: Yes (y)
- Set up automatic builds: No (N)
- If asked about overwriting files in dist folder: No (N)

If you didn't set up a default project during init, you can connect it later:

```bash
firebase use --add YOUR-PROJECT-ID
```

## Step 5: Build Your App

Before deploying, you need to create a production build:

```bash
npm run build
```

This creates an optimized version of your app in the `dist` folder.

## Step 6: Deploy to Firebase

```bash
firebase deploy
```

After deployment, you'll see a URL like:
```
https://YOUR-PROJECT-ID.web.app
```

This is your live website!

## Deploying Updates

Whenever you make changes to your app:

1. Commit your changes to git:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```

2. Build the app:
   ```bash
   npm run build
   ```

3. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## Troubleshooting

### Build Errors
If you get build errors, check:
- All dependencies are installed: `npm install`
- No syntax errors in your React components
- All imports are correct

### Deployment Errors
- Make sure you're logged in: `firebase login`
- Verify your project ID is correct: `firebase projects:list`
- Check that the `dist` folder exists and has content

### Routing Issues
Firebase Hosting is configured as a single-page app, so all routes should work. If you have issues:
- Make sure `firebase.json` has `rewrites` configured
- Check that your build completed successfully

## File Structure After Setup

Your project should have:
- `firebase.json` - Firebase configuration
- `.firebaserc` - Firebase project settings (optional)
- `dist/` - Built production files (created by `npm run build`)

## Notes

- The `dist` folder is generated automatically and should be in `.gitignore`
- Don't manually edit files in `dist` - always use `npm run build`
- Your site URL will be `https://YOUR-PROJECT-ID.web.app` or `https://YOUR-PROJECT-ID.firebaseapp.com`


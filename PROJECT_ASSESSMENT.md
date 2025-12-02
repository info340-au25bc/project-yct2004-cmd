# Project Requirements Assessment

## Overall Grade Estimate: **6/10 (Unsatisfactory)**

**Status**: Project meets many requirements but has **CRITICAL** issues that prevent it from being satisfactory. Major fixes needed before submission.

---

## Critical Issues (Must Fix)

### 1. ❌ **Context API Usage (FORBIDDEN)**
**Requirement**: "Note that we will not be learning or using Contexts in this course, so you should not use them in your application."

**Current State**: 
- `src/contexts/AuthContext.jsx` uses React Context API
- `useAuth()` hook is used throughout the app

**Impact**: This is explicitly forbidden and will result in significant point deduction.

**Fix Required**: Refactor to use props and state instead of Context. Pass `currentUser` and auth functions as props from App component down to child components.

---

### 2. ❌ **Firebase Realtime Database Not Used**
**Requirement**: "You should use the realtime database to store data for this course; do not use the Firestore database."

**Current State**:
- `src/firebase/config.js` imports `getFirestore` (Firestore)
- No Realtime Database imports (`getDatabase`, `ref`, `onValue`, `push`, `set`)
- All data persistence uses `localStorage` instead of Firebase

**Impact**: This is a core requirement. Using localStorage does NOT meet the Firebase persistence requirement.

**Fix Required**:
- Import `getDatabase` from `firebase/database`
- Replace all `localStorage` calls with Firebase Realtime Database operations
- Implement `onValue` listeners for reading data
- Implement `push`/`set` for writing data
- Store discussions, replies, course lists, questions, etc. in Firebase

---

### 3. ❌ **Using window.alert() Instead of In-Page Feedback**
**Requirement**: "You may not use the .alert() or .prompt() functions; all displayed content must remain in the same browser window."

**Current State**:
- `src/pages/TestQuestions.jsx`: Lines 27, 52 use `alert()`
- `src/pages/GroupCreation.jsx`: Line 113 uses `alert()`

**Impact**: Violates explicit requirement. Must use React conditional rendering for error/success messages.

**Fix Required**: Replace all `alert()` calls with state-based error/success messages rendered in the DOM.

---

### 4. ❌ **Third-Party React Library Not Used**
**Requirement**: "Your web app must include and use at least one third-party React Component or library (other than react-router or firebaseui)"

**Current State**:
- `recharts` is in `package.json` but **never imported or used** in any component
- No other third-party React library is used

**Impact**: Missing requirement. Must integrate and render a third-party React component.

**Fix Required**: 
- Either use `recharts` to create a data visualization (e.g., quiz scores chart, course ratings chart)
- Or integrate another React library (react-bootstrap, react-leaflet, etc.)

---

### 5. ❌ **Missing HTML Metadata**
**Requirement**: "You'll need to specify the meta data (author and description) for your page in the HTML"

**Current State**:
- `index.html` only has basic viewport meta
- Missing `<meta name="author">` and `<meta name="description">`
- Title is generic "project-yct2004-cmd-main"
- Using default Vite favicon

**Fix Required**: Add author and description meta tags, update title, add custom favicon.

---

## Major Issues

### 6. ⚠️ **Potential Inline .map() in Return Statements**
**Requirement**: "If you inline a .map() function inside of a return statement your project will not be considered satisfactory."

**Current State**: Need to verify all `.map()` calls are assigned to variables before return.

**Action**: Review all components to ensure `.map()` results are stored in variables before rendering.

---

### 7. ⚠️ **Data Persistence Using localStorage**
**Current State**: 
- Forum discussions: `localStorage`
- Replies: `localStorage`
- Course lists: State only (not persisted)
- Questions: State only (not persisted)

**Impact**: Data is lost on refresh. Must use Firebase Realtime Database for persistence.

---

## What's Working Well ✅

### App Content and HTML Structure (~10%)
- ✅ Project built with Vite
- ✅ Header and Footer present
- ✅ Multiple views of data (quizzes, discussions, groups, courses)
- ✅ At least 3 images (Unsplash images in Home.jsx)
- ✅ Form elements present (multiple forms)
- ⚠️ Missing metadata (author, description)
- ⚠️ Using default favicon

**Score**: ~7/10 (missing metadata)

---

### React Components and Structure (~15%)
- ✅ Good component hierarchy
- ✅ Components are appropriately sized
- ✅ Components are self-contained
- ✅ Props and state used appropriately
- ❌ **Using Context API (forbidden)**
- ✅ No DOM manipulation (using React properly)

**Score**: ~8/10 (Context API issue)

---

### React Interactivity (~30%)
- ✅ Multiple interactive features:
  1. **Quiz System**: Take quizzes, answer questions, see results (Full feature)
  2. **Forum Discussions**: Create discussions, post replies (Full feature)
  3. **Course Management**: Add/remove courses, rate courses (Half feature)
  4. **Group Chat**: Chat within study groups (Full feature)
  5. **Question Creator**: Create quiz questions with feedback (Full feature)

- ✅ Features are interactive and state-based
- ✅ Features respond to user input
- ✅ State stored at appropriate levels
- ⚠️ Some features use localStorage (should use Firebase)
- ❌ Using `alert()` for feedback (must be in-page)

**Score**: ~7/10 (good features, but localStorage and alert() issues)

---

### Client-Side Routing and Navigation (~5%)
- ✅ React Router integrated correctly
- ✅ Multiple routes (Home, Quiz, Forum, Groups, Resources, etc.)
- ✅ Path parameter route: `/forum/discussion/:id`
- ✅ Protected routes implemented
- ✅ Handles navigation correctly

**Score**: ~9/10 (excellent)

---

### Integrates Another React Library (~5%)
- ❌ **recharts is installed but NOT USED**
- ❌ No third-party React component rendered

**Score**: 0/10 (critical - requirement not met)

---

### Data Persistence (Firebase) (~10%)
- ❌ Using Firestore instead of Realtime Database
- ❌ Using localStorage instead of Firebase
- ✅ Firebase Auth is configured and working
- ❌ No Firebase database reads/writes implemented
- ❌ Data not persisted across sessions

**Score**: 2/10 (only auth works, no database)

---

### Site Style and CSS Structure (~10%)
- ✅ External CSS files
- ✅ Many CSS rules (2000+ lines in App.css)
- ✅ Colors, fonts, spacing, layout all customized
- ✅ Flexbox/grid used for layouts
- ✅ Polished appearance
- ✅ CSS imported through JavaScript

**Score**: ~9/10 (excellent styling)

---

### Accessibility (~5%)
- ✅ Semantic HTML elements
- ✅ Form labels with `htmlFor` attributes
- ✅ Alt attributes on images
- ✅ ARIA labels where needed
- ✅ Role attributes (footer has `role="contentinfo"`)
- ⚠️ Need to verify heading hierarchy

**Score**: ~8/10 (good, but verify headings)

---

### Responsive Design (~5%)
- ✅ Viewport meta tag present
- ✅ Media queries implemented (multiple files)
- ✅ Mobile-first approach (media queries at bottom)
- ✅ Layout changes on different screen sizes

**Score**: ~9/10 (excellent)

---

### Clean Coding Style (~5%)
- ✅ Well-organized file structure
- ✅ Components in separate files
- ✅ Descriptive variable/function names
- ✅ Using `const`/`let` (not `var`)
- ⚠️ Need to check for inline `.map()` in returns
- ❌ Using `alert()` (forbidden)
- ⚠️ Some console.log may need cleanup

**Score**: ~7/10 (mostly good, but alert() issue)

---

## Required Fixes (Priority Order)

### Priority 1: Critical (Must Fix Before Submission)
1. **Remove Context API** - Refactor AuthContext to use props/state
2. **Implement Firebase Realtime Database** - Replace localStorage with Firebase
3. **Remove all `alert()` calls** - Use React state for error/success messages
4. **Integrate recharts or another React library** - Actually use it in a component
5. **Add HTML metadata** - Author, description, custom favicon

### Priority 2: Important
6. **Verify no inline `.map()` in returns** - Extract to variables
7. **Persist all data to Firebase** - Course lists, questions, etc.
8. **Clean up console.log statements**

---

## Estimated Time to Fix

- Remove Context API: 2-3 hours
- Implement Firebase Realtime Database: 4-6 hours
- Remove alert() calls: 1 hour
- Integrate recharts: 1-2 hours
- Add metadata: 15 minutes
- Verify and clean up: 1 hour

**Total**: ~10-14 hours of work

---

## Final Recommendation

**DO NOT SUBMIT** until critical issues are fixed. The project shows good understanding of React, routing, and styling, but the Context API usage and lack of Firebase Realtime Database will result in an unsatisfactory grade.

Once fixed, the project could achieve **8-9/10** (Satisfactory).




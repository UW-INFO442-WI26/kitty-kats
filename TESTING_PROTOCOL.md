# Testing Protocol

This document outlines how to manually test key features of Learning Without Stigma, the expected outcomes, and known issues/workarounds.

## Testing Environment

- Desktop: Google Chrome (latest), Microsoft Edge (latest)
- Mobile: Chrome DevTools device emulation (iPhone/Pixel presets)
- Backend: Firebase Authentication + Cloud Firestore
- Local app run command: `npm run dev`

---

## 1. Home Page

**Steps:**
1. Start the app and open the home route (`/`).
2. Verify the welcome content and primary navigation/actions.

**Expected Result:**
- Home page loads without console/runtime errors.
- Primary navigation links/buttons are visible and usable.

---

## 2. Modules Page

**Steps:**
1. Navigate to `/modules`.
2. Confirm all six modules are visible.
3. Click at least one module card/link.

**Expected Result:**
- All six modules are rendered.
- Clicking a module routes to its module overview route.

---

## 3. Module Overview + Quiz

**Steps:**
1. Open a module overview page (for example, `/module/1`).
2. Start the quiz from that module.
3. Select answers and submit.
4. Continue to next question until completion.

**Expected Result:**
- Questions load from Firestore.
- Answer submission gives feedback (correct/incorrect).
- Quiz progression works across questions.
- Score/mastery values update after completion.

---

## 4. Flashcards

**Steps:**
1. Navigate to `/flashcards`.
2. Flip a card.
3. Use Next/Prev navigation.
4. Filter by module.
5. Verify optional “More info” link behavior on cards that include links.

**Expected Result:**
- Card flips between term and definition.
- Next/Prev changes cards and wraps correctly at ends.
- Module filter updates displayed flashcards.
- “More info” appears only when a card contains a link.

---

## 5. Authentication (Google + Anonymous)

**Steps:**
1. Sign in with Google.
2. Navigate to Profile.
3. Sign out.
4. Continue as anonymous user (if applicable in flow).

**Expected Result:**
- Google sign-in succeeds and user state updates.
- Profile displays signed-in user context.
- Sign-out returns user to guest/anonymous state.

---

## 6. Profile + Progress Tracking

**Steps:**
1. Complete at least one quiz question/module.
2. Open `/profile`.
3. Verify mastery/progress indicators and streak data.

**Expected Result:**
- Profile displays progress sections and module mastery values.
- Overall metrics (for example mastery/streak) reflect latest data.
- User-specific data is loaded from Firestore for authenticated users.

---

## 7. Daily Prompt Progress

**Steps:**
1. Open the daily prompt experience from the app flow.
2. Submit today’s response.
3. Re-open Profile or related view to verify persistence.

**Expected Result:**
- Response is saved under user app data.
- `lastAnsweredDate` and `streak` update according to business rules.
- Data remains after refresh/reload.

---

## 8. Glossary/Search Experience

**Steps:**
1. Open the glossary/search UI.
2. Search for a known term (for example: “consent”).
3. Search for a term that should return no matches.

**Expected Result:**
- Matching terms appear for valid queries.
- Empty/no-match state appears gracefully for invalid queries.
- No crashes on rapid input changes.

---

## 9. Resources Page

**Steps:**
1. Navigate to `/resources`.
2. Click multiple external links.

**Expected Result:**
- Resource links are present and accessible.
- External links open to expected destinations.

---

## 10. Responsive Layout

**Steps:**
1. Resize browser from desktop to narrow/mobile widths.
2. Navigate through Home, Modules, Flashcards, Quiz, and Profile.

**Expected Result:**
- Layout adapts without overlapping/broken sections.
- Navigation remains usable on smaller screens.
- Interactive elements remain tappable/readable.

---

## Automated Test Coverage (Current)

Current Vitest suite includes:
- `src/tests/Flashcards.test.jsx`
- `src/tests/Modules.test.jsx`
- `src/tests/Profile.test.jsx`
- `src/tests/Quiz.test.jsx`

Run with:

```bash
npm run test
```

---

## Known Issues / Workarounds

1. **Occasional Firestore loading delay** on first load or slow networks.
   - **Workaround:** Wait a few seconds for async fetch completion, then refresh once if needed.

2. **Google sign-in popup blocked** by browser popup settings in some environments.
   - **Workaround:** Allow popups for the site and retry sign-in.

3. **Stale UI after auth/data transition** can occur if navigating very quickly during loading.
   - **Workaround:** Wait for loading state to finish before changing routes; refresh page if needed.

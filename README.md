# Learning Without Stigma

A web app providing stigma-free sexual health education for U.S. high school students through interactive quizzes, flashcards, and scenarios.

**Available at: https://kitty-kats.web.app/**

## About

Learning Without Stigma offers anonymous, judgment-free sexual health education. Students can learn at their own pace, track progress, earn rewards, and access trusted resources—all in a mobile-first experience.

## Features

### Core Learning
- **6 Interactive Modules** - Comprehensive topics with hover-to-flip cards and progress tracking
- **Quiz System** - Module-based quizzes with instant feedback
- **Flashcards** - Shuffle, filter by module, and flip to reveal answers
- **Search & Glossary** - Keyword search across all content

### User Experience
- **Anonymous Learning** - No personal info required to start
- **Progress Tracking** - Visual progress bars and stats
- **Mastery Badges** - Earn badges based on quiz scores
- **Mobile-First** - Optimized for phones and tablets

### Pages
- **Home** - Welcome message, modules button, quick navigation
- **Modules** - Browse all 6 learning modules with progress indicators
- **Flashcards** - Study mode with shuffle and filtering
- **Profile** - Progress tracker, stats, and account info
- **Resources** - Trusted external links and support information
- **About** - Project mission and team info

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router** (`react-router`) - Client-side routing
- **Firebase** (`firebase`) - Authentication, Firestore, and Hosting integration
- **Bootstrap 5** (`bootstrap`) - UI styling utilities
- **Vitest** (`vitest`) - Test runner
- **Testing Library** (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`) - Component and UI testing
- **ESLint** (`eslint`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`) - Linting and code quality
- **JSDOM** (`jsdom`) - Browser-like test environment
- **Firebase Admin SDK** (`firebase-admin`) - Scripted Firestore seeding support

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest tests |
| `npm run seed:daily-prompts` | Seed daily prompts into Firestore |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

Clone the repository:

```bash
git clone https://github.com/UW-INFO442-WI26/kitty-kats.git
cd kitty-kats
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Project Structure

```
src/
├── components/              # React components
│   ├── AuthModal.jsx
│   ├── DailyQuestion.jsx
│   ├── GlossarySearch.jsx
│   ├── Navbar.jsx
│   ├── ProgressBar.jsx
│   └── tests/               # Component tests
├── context/                 # React context
│   └── AuthContext.jsx
├── pages/                   # Page components
│   ├── About.jsx
│   ├── Flashcards.jsx
│   ├── Home.jsx
│   ├── ModuleOverview.jsx
│   ├── Modules.jsx
│   ├── Profile.jsx
│   ├── Quiz.jsx
│   └── Resources.jsx
├── utils/                   # Utility functions
│   ├── dailyPromptProgress.js
│   └── masteryUtils.js
├── data/                    # Static data
│   └── defaultDailyPrompts.js
├── assets/                  # Static assets
├── tests/                   # App-level tests
├── App.jsx                  # Main app component
├── firebase.js              # Firebase configuration
├── index.css                # Global styles
└── main.jsx                 # App entry point
```

## Firebase Services

- **Firebase Authentication** - Google OAuth and anonymous sign-in
- **Cloud Firestore** - Stores user progress, scores, mastery levels, flashcards, daily prompts, and question bank
- **Firebase Hosting** - Production deployment with automatic PR previews

### Data Structure

Learning content and user progress are stored in Firestore with the following structure:

```text
flashcards/
└── {cardId}/
	├── term: string
	├── definition: string
	├── module: string
	└── link: string

questions/
└── {questionId}/
	├── question: string
	├── module: string
	├── order: number
	├── feedback: string
	└── answers: array
		└── {index}
			├── text: string
			└── correct: boolean

mastery/
└── {docId}/
	├── userId: string
	├── moduleId: number
	├── mastery: number
	├── rawScore: number
	├── questionCount: number
	└── updatedAt: timestamp

users/
└── {userId}/
	└── appData/
		└── dailyPromptProgress
			├── answersByDate: map<string, string>
			├── lastAnsweredDate: string (YYYY-MM-DD)
			├── streak: number
			└── updatedAt: timestamp
```

### Firebase Setup

This project uses Firebase with configuration in `src/firebase.js`. Setup steps:

1. Created a Firebase project at console.firebase.google.com.
2. Enabled Firebase Authentication with Google sign-in (and anonymous auth support).
3. Created a Cloud Firestore database in production mode.
4. Added the Firebase web config to `src/firebase.js`.
5. Deployed Firestore rules:

   ```bash
   firebase deploy --only firestore:rules
   ```

6. Deployed the app:

   ```bash
   npm run build
   firebase deploy --only hosting
   ```

### Security Rules

Firestore security rules ensure users can only access their own protected data while public learning content remains readable:

```js
rules_version = '2';
service cloud.firestore {
	match /databases/{database}/documents {

		// 1. Questions: Publicly readable
		match /questions/{questionId} {
			allow read: if true;
			allow write: if false;
		}

		// 2. Flashcards: Publicly readable
		match /flashcards/{cardId} {
			allow read: if true;
			allow write: if false;
		}

		// 3. Daily prompts: Publicly readable
		match /dailyPrompts/{promptId} {
			allow read: if true;
			allow write: if false;
		}

		// 4. User Profiles: Only the owner can see/edit their own profile
		match /users/{userId} {
			allow read, write: if request.auth != null && request.auth.uid == userId;
		}

		// 5. Nested User Data: Covers subcollections under users
		match /users/{userId}/{document=**} {
			allow read, write: if request.auth != null && request.auth.uid == userId;
		}

		// 6. Mastery Tracking: Restricts access to data matching the user's ID
		match /mastery/{docId} {
			allow read: if request.auth != null
				&& (resource == null || resource.data.userId == request.auth.uid);

			allow create: if request.auth != null
				&& request.resource.data.userId == request.auth.uid;

			allow update: if request.auth != null
				&& resource.data.userId == request.auth.uid
				&& request.resource.data.userId == request.auth.uid;
		}
	}
}
```

Key security features:

- Public read-only access for shared learning content (`questions`, `flashcards`, `dailyPrompts`)
- Authenticated user isolation for `/users/{userId}` and all nested subcollections
- Mastery documents restricted to the authenticated owner via `userId` checks

## Testing

This project uses Vitest and React Testing Library for unit and integration testing.

### Running Tests

```bash
# Run all tests
npm run test
```

### Test Structure

- App/page tests - Located in `src/tests/`
	- `Flashcards.test.jsx` - Verifies flashcard rendering and study interactions.
	- `Modules.test.jsx` - Verifies module list rendering and navigation behavior.
	- `Profile.test.jsx` - Verifies profile progress/stats display behavior.
	- `Quiz.test.jsx` - Verifies quiz flow, answer handling, and scoring behavior.
- Test setup - `src/tests/setup.js`

## Contributing

This project is developed for INFO 442. See the team for contribution guidelines.

## Work Distribution

Work was distributed across both **software development (frontend, backend, testing, and infrastructure)** and **content creation (educational materials, flashcards, and questions)**. All team members contributed meaningfully to the project.

### Software Development Contributions

- **clamm92**
  - Core application architecture (React + Vite setup)
  - Module and quiz data flow (Firestore → UI)
  - Mastery tracking logic and calculations
  - Unit testing setup (Vitest, Testing Library)
  - Bug fixes across authentication, routing, and UI behavior

- **SahraMohamad**
  - Authentication flows (sign-in, sign-out, auth state handling)
  - Daily prompts feature with persistent streak tracking
  - Firebase data synchronization for user activity
  - UI improvements and responsive navbar behavior
  - Homepage UI refinements

- **alissalau**
  - Flashcard feature support (UI wireframes and implementation assistance)
  - Navigation enhancements (learn dropdown, routing fixes)
  - Data consistency improvements for flashcards

- **fchung26**
  - Profile page development (user stats, progress, streaks)
  - Module progress tracking UI and calculations
  - UI bug fixes and layout improvements

- **alchung1**
  - About page implementation and multimedia integration (video)
  - Module overview page UI
  - Daily prompt feature integration
  - Favicon and application metadata updates

- **kelishightower**
  - Resources page implementation and content integration
  - External resource curation and linking

---

### Content & Data Contributions (Firestore)

Educational content was created and structured directly in Firestore. This required designing questions, answer choices, feedback, and flashcard definitions.

- **kelishightower**
  - Initial concept and ideation of the application
  - Created early wireframes and product direction
  - Inserted questions and flashcards into Firestore
  - Curated and added external resources for the Resources page

- **alchung1**
  - Designed Figma mockups for modules and module overview
  - Contributed to daily streak UX design
  - Inserted a large portion of flashcards into Firestore

- **alissalau**
  - Created and inserted questions and flashcards into Firestore
  - Ensured schema consistency and data quality across entries

- **fchung26**
  - Added questions and flashcards to Firestore
  - Assisted with content structuring and organization

> Note: All contributors who added questions and flashcards were responsible for **authoring the educational content**, including writing prompts, answer choices, and explanations.

## License

Private project - All rights reserved.

import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const DAILY_PROMPT_STORAGE_KEY = 'dailyPromptProgress.v1';

const DAILY_PROMPT_PROGRESS_DEFAULTS = {
  streak: 0,
  lastAnsweredDate: null,
  answersByDate: {},
};

const hasMeaningfulProgress = (progress) =>
  (progress?.streak ?? 0) > 0 ||
  Boolean(progress?.lastAnsweredDate) ||
  Object.keys(progress?.answersByDate ?? {}).length > 0;

const normalizeProgress = (progress) => ({
  streak: Number(progress?.streak) || 0,
  lastAnsweredDate: progress?.lastAnsweredDate || null,
  answersByDate:
    progress?.answersByDate && typeof progress.answersByDate === 'object'
      ? progress.answersByDate
      : {},
});

function getDailyPromptProgressDocRef(userId) {
  return doc(db, 'users', userId, 'appData', 'dailyPromptProgress');
}

export function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadDailyPromptProgressFromLocal() {
  try {
    const savedProgress = localStorage.getItem(DAILY_PROMPT_STORAGE_KEY);
    if (!savedProgress) {
      return DAILY_PROMPT_PROGRESS_DEFAULTS;
    }

    const parsed = JSON.parse(savedProgress);
    return normalizeProgress(parsed);
  } catch (error) {
    console.error('Failed to load daily prompt progress from localStorage:', error);
    return DAILY_PROMPT_PROGRESS_DEFAULTS;
  }
}

export function saveDailyPromptProgressToLocal(progress) {
  try {
    localStorage.setItem(DAILY_PROMPT_STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save daily prompt progress to localStorage:', error);
  }
}

export async function loadDailyPromptProgress(userId = null) {
  if (!userId) {
    return loadDailyPromptProgressFromLocal();
  }

  try {
    const docRef = getDailyPromptProgressDocRef(userId);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const normalized = normalizeProgress(snapshot.data());
      saveDailyPromptProgressToLocal(normalized);
      return normalized;
    }

    const localProgress = loadDailyPromptProgressFromLocal();
    if (hasMeaningfulProgress(localProgress)) {
      await saveDailyPromptProgress(localProgress, userId);
      return localProgress;
    }

    return DAILY_PROMPT_PROGRESS_DEFAULTS;
  } catch (error) {
    console.error('Failed to load daily prompt progress from Firestore:', error);
    return loadDailyPromptProgressFromLocal();
  }
}

export async function saveDailyPromptProgress(progress, userId = null) {
  const normalized = normalizeProgress(progress);
  saveDailyPromptProgressToLocal(normalized);

  if (!userId) return;

  try {
    const docRef = getDailyPromptProgressDocRef(userId);
    await setDoc(
      docRef,
      {
        ...normalized,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Failed to save daily prompt progress to Firestore:', error);
  }
}

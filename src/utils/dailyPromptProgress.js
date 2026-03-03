import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const DAILY_PROMPT_STORAGE_KEY = 'dailyPromptProgress.v1';
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const DAILY_PROMPT_PROGRESS_DEFAULTS = {
  streak: 0,
  lastAnsweredDate: null,
  answersByDate: {},
};

const hasMeaningfulProgress = (progress) =>
  (progress?.streak ?? 0) > 0 ||
  Boolean(progress?.lastAnsweredDate) ||
  Object.keys(progress?.answersByDate ?? {}).length > 0;

function getDailyPromptStorageKey(userId = null) {
  return userId ? `${DAILY_PROMPT_STORAGE_KEY}.${userId}` : DAILY_PROMPT_STORAGE_KEY;
}

function applyStreakRules(progress) {
  const normalized = normalizeProgress(progress);
  const todayKey = getDateKey(new Date());
  const yesterdayKey = getDateKey(new Date(Date.now() - DAY_IN_MS));

  if (!normalized.lastAnsweredDate) {
    return { ...normalized, streak: 0 };
  }

  if (normalized.lastAnsweredDate !== todayKey && normalized.lastAnsweredDate !== yesterdayKey) {
    return { ...normalized, streak: 0 };
  }

  return normalized;
}

function hasRecentActivity(progress) {
  const todayKey = getDateKey(new Date());
  const yesterdayKey = getDateKey(new Date(Date.now() - DAY_IN_MS));

  return (
    progress?.lastAnsweredDate === todayKey ||
    progress?.lastAnsweredDate === yesterdayKey ||
    Boolean(progress?.answersByDate?.[todayKey]) ||
    Boolean(progress?.answersByDate?.[yesterdayKey])
  );
}

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

export function loadDailyPromptProgressFromLocal(userId = null) {
  try {
    const userStorageKey = getDailyPromptStorageKey(userId);
    let savedProgress = localStorage.getItem(userStorageKey);

    if (!savedProgress && userId) {
      savedProgress = localStorage.getItem(DAILY_PROMPT_STORAGE_KEY);
    }

    if (!savedProgress) {
      return DAILY_PROMPT_PROGRESS_DEFAULTS;
    }

    const parsed = JSON.parse(savedProgress);
    return applyStreakRules(parsed);
  } catch (error) {
    console.error('Failed to load daily prompt progress from localStorage:', error);
    return DAILY_PROMPT_PROGRESS_DEFAULTS;
  }
}

export function saveDailyPromptProgressToLocal(progress, userId = null) {
  try {
    const storageKey = getDailyPromptStorageKey(userId);
    localStorage.setItem(storageKey, JSON.stringify(progress));
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
      const normalized = applyStreakRules(snapshot.data());
      saveDailyPromptProgressToLocal(normalized, userId);
      return normalized;
    }

    const localProgress = loadDailyPromptProgressFromLocal(userId);
    if (hasMeaningfulProgress(localProgress) && hasRecentActivity(localProgress)) {
      await saveDailyPromptProgress(localProgress, userId);
      return localProgress;
    }

    return DAILY_PROMPT_PROGRESS_DEFAULTS;
  } catch (error) {
    console.error('Failed to load daily prompt progress from Firestore:', error);
    return loadDailyPromptProgressFromLocal(userId);
  }
}

export async function saveDailyPromptProgress(progress, userId = null) {
  const normalized = applyStreakRules(progress);
  saveDailyPromptProgressToLocal(normalized, userId);

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

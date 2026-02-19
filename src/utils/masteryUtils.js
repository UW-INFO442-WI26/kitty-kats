// masteryUtils.js
// ─────────────────────────────────────────────────────────────────────────────
// Mastery formula
//   points per correct (first try) = Math.round(100 / questionCount) + 2
//   points per miss                = -Math.round(perCorrect / 3)
//   mastery threshold              = 100  (hard capped 0–100, never exceeds 100)
//
// With 12 questions:  +10 per correct, -3 per miss
// With 30 questions:  +5  per correct, -2 per miss
// With 10 questions:  +12 per correct, -4 per miss
// ─────────────────────────────────────────────────────────────────────────────

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const MASTERY_THRESHOLD = 100;

export function getPointValues(questionCount) {
  const perCorrect = Math.round(100 / questionCount) + 2;
  const perMiss    = -Math.round(perCorrect / 3);   // negative, divisor /3
  return { perCorrect, perMiss };
}

/**
 * Clamps a raw score to 0–100 and rounds it.
 * Score can never go below 0 or above 100.
 */
export function scoreToMastery(rawScore) {
  return Math.min(100, Math.max(0, Math.round(rawScore)));
}

// ─── Firestore helpers ───────────────────────────────────────────────────────

export async function loadModuleMastery(userId, moduleId) {
  const ref  = doc(db, 'mastery', `${userId}_${moduleId}`);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data();
}

export async function loadAllMastery(userId, moduleIds) {
  const results = {};
  await Promise.all(
    moduleIds.map(async (id) => {
      const data = await loadModuleMastery(userId, id);
      results[id] = data || { rawScore: 0, mastery: 0, questionCount: 0 };
    })
  );
  return results;
}

/**
 * Save mastery for a user+module.
 * rawScore is hard-clamped 0–100 before saving — score can never go below 0
 * or exceed 100 in the database, and once at 100 wrong answers only lower it.
 */
export async function saveModuleMastery(userId, moduleId, rawScore, questionCount) {
  const clampedScore = scoreToMastery(rawScore);
  const ref = doc(db, 'mastery', `${userId}_${moduleId}`);
  await setDoc(
    ref,
    {
      userId,
      moduleId,
      rawScore:  clampedScore,
      mastery:   clampedScore,
      questionCount,
      updatedAt: new Date(),
    },
    { merge: true }
  );
}
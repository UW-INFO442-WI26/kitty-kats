import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { defaultDailyPrompts } from '../src/data/defaultDailyPrompts.js';

initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();
const collectionRef = db.collection('dailyPrompts');

async function seedDailyPrompts() {
  const batch = db.batch();

  defaultDailyPrompts.forEach((item, index) => {
    const docRef = collectionRef.doc(`prompt-${String(index + 1).padStart(2, '0')}`);
    batch.set(docRef, {
      category: item.category,
      prompt: item.prompt,
      order: item.order ?? index + 1,
      active: true,
      updatedAt: new Date().toISOString(),
    });
  });

  await batch.commit();
  console.log(`Seeded ${defaultDailyPrompts.length} daily prompts into Firestore.`);
}

seedDailyPrompts().catch((error) => {
  console.error('Failed to seed daily prompts:', error);
  process.exit(1);
});

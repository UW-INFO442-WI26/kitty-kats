import { collection, getDocs } from "firebase/firestore";
import { db } from "../src/firebase.js";

const field = process.argv[2] || "link";
const needle = (process.argv[3] || "cleveland").toLowerCase();

const snapshot = await getDocs(collection(db, "flashcards"));
const matches = [];

snapshot.forEach((doc) => {
  const data = doc.data();
  const value = data?.[field];
  if (typeof value === "string") {
    if (value.toLowerCase().includes(needle)) {
      matches.push({ id: doc.id, value });
    }
  } else if (Array.isArray(value)) {
    const hit = value.find(
      (item) => typeof item === "string" && item.toLowerCase().includes(needle)
    );
    if (hit) {
      matches.push({ id: doc.id, value: hit });
    }
  }
});

if (matches.length === 0) {
  console.log(`No matches for "${needle}" in field "${field}".`);
} else {
  console.log(`Found ${matches.length} match(es) for "${needle}" in field "${field}":`);
  for (const match of matches) {
    console.log(`- ${match.id}: ${match.value}`);
  }
}

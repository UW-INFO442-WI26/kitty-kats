import { collection, getDocs } from "firebase/firestore";
import { db } from "../src/firebase.js";

const field = process.argv[2] || "link";
const timeoutMs = 15000;

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

async function checkUrl(url) {
  try {
    const head = await withTimeout(fetch(url, { method: "HEAD", redirect: "follow" }), timeoutMs);
    return head.status;
  } catch {
    const get = await withTimeout(fetch(url, { method: "GET", redirect: "follow" }), timeoutMs);
    return get.status;
  }
}

const snapshot = await getDocs(collection(db, "flashcards"));
const links = [];

snapshot.forEach((doc) => {
  const data = doc.data();
  const value = data?.[field];
  if (typeof value === "string") {
    links.push({ id: doc.id, url: value });
  } else if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === "string") links.push({ id: doc.id, url: item });
    }
  }
});

if (links.length === 0) {
  console.log(`No links found in field "${field}".`);
  process.exit(0);
}

for (const { id, url } of links) {
  const cleaned = url.trim();
  if (!/^https?:\/\//i.test(cleaned)) {
    console.log(`INVALID - ${id} - ${url}`);
    continue;
  }
  try {
    const status = await checkUrl(cleaned);
    console.log(`${status} - ${id} - ${cleaned}`);
  } catch {
    console.log(`ERROR - ${id} - ${cleaned}`);
  }
}

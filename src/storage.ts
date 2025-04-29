// Storage logic for StudyLog browser extension
// Handles CRUD operations for study log entries using chrome.storage.local

export interface StudyLogEntry {
  id: string; // Unique identifier
  domain: string; // Domain of the page
  url: string; // Page URL
  title: string; // Page title
  memo?: string; // Optional memo
  updatedAt: number; // Last updated timestamp (ms since epoch)
}

const STORAGE_KEY = 'studylog_entries';

// Fetch all entries from storage
export async function getEntries(): Promise<StudyLogEntry[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      resolve(result[STORAGE_KEY] || []);
    });
  });
}

// Save a new entry to storage
export async function saveEntry(entry: StudyLogEntry): Promise<void> {
  const entries = await getEntries();
  entries.push(entry);
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: entries }, () => resolve());
  });
}

// Update an existing entry by id
export async function updateEntry(id: string, update: Partial<StudyLogEntry>): Promise<void> {
  const entries = await getEntries();
  const updated = entries.map(e => e.id === id ? { ...e, ...update, updatedAt: Date.now() } : e);
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: updated }, () => resolve());
  });
}

// Delete an entry by id
export async function deleteEntry(id: string): Promise<void> {
  const entries = await getEntries();
  const filtered = entries.filter(e => e.id !== id);
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: filtered }, () => resolve());
  });
}

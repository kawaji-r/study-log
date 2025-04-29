import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getEntries, saveEntry, updateEntry, deleteEntry, StudyLogEntry } from '../storage';

global.chrome = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
} as any;

describe('storage.ts', () => {
  const entry: StudyLogEntry = {
    id: 'test-id',
    domain: 'example.com',
    url: 'https://example.com/page',
    title: 'Test Title',
    updatedAt: Date.now(),
  };

  beforeEach(() => {
    (chrome.storage.local.get as any).mockReset();
    (chrome.storage.local.set as any).mockReset();
  });

  it('getEntries returns empty array if nothing stored', async () => {
    (chrome.storage.local.get as any).mockImplementation((keys, cb) => cb({}));
    const result = await getEntries();
    expect(result).toEqual([]);
  });

  it('saveEntry adds an entry', async () => {
    (chrome.storage.local.get as any).mockImplementation((keys, cb) => cb({ studylog_entries: [] }));
    (chrome.storage.local.set as any).mockImplementation((obj, cb) => cb());
    await saveEntry(entry);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ studylog_entries: [entry] }, expect.any(Function));
  });

  it('updateEntry updates the correct entry', async () => {
    const updated = { ...entry, title: 'Updated' };
    (chrome.storage.local.get as any).mockImplementation((keys, cb) => cb({ studylog_entries: [entry] }));
    (chrome.storage.local.set as any).mockImplementation((obj, cb) => cb());
    await updateEntry(entry.id, { title: 'Updated' });
    expect(chrome.storage.local.set).toHaveBeenCalledWith(
      { studylog_entries: [expect.objectContaining({ title: 'Updated' })] },
      expect.any(Function)
    );
  });

  it('deleteEntry removes the correct entry', async () => {
    (chrome.storage.local.get as any).mockImplementation((keys, cb) => cb({ studylog_entries: [entry] }));
    (chrome.storage.local.set as any).mockImplementation((obj, cb) => cb());
    await deleteEntry(entry.id);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ studylog_entries: [] }, expect.any(Function));
  });
});

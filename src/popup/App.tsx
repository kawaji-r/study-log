import React, { useEffect, useState } from 'react';
import { StudyLogEntry, getEntries, saveEntry, updateEntry, deleteEntry } from '../storage';

// Helper to get domain from URL
function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

// Modal for editing/confirming title and memo
function EntryModal({
  open,
  initialTitle,
  initialMemo,
  onSave,
  onClose,
}: {
  open: boolean;
  initialTitle: string;
  initialMemo?: string;
  onSave: (title: string, memo?: string) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [memo, setMemo] = useState(initialMemo || '');

  useEffect(() => {
    setTitle(initialTitle);
    setMemo(initialMemo || '');
  }, [initialTitle, initialMemo, open]);

  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Edit Title</h3>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
        />
        <textarea
          placeholder="Memo (optional)"
          value={memo}
          onChange={e => setMemo(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={() => onSave(title, memo)}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const StudyLogPopup: React.FC = () => {
  const [entries, setEntries] = useState<StudyLogEntry[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMemo, setModalMemo] = useState('');
  const [currentTab, setCurrentTab] = useState<{ url: string; title: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load entries on mount
  useEffect(() => {
    getEntries().then(setEntries);
  }, []);

  // Get current tab info
  const fetchCurrentTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab && tab.url && tab.title) {
        setCurrentTab({ url: tab.url, title: tab.title });
        setModalTitle(tab.title);
        setModalMemo('');
        setModalOpen(true);
      }
    });
  };

  // Create new record
  const handleCreate = async (title: string, memo?: string) => {
    if (!currentTab) return;
    const entry: StudyLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      domain: getDomain(currentTab.url),
      url: currentTab.url,
      title: title.trim() || currentTab.title,
      memo: memo?.trim() || undefined,
      updatedAt: Date.now(),
    };
    await saveEntry(entry);
    setEntries(await getEntries());
    setModalOpen(false);
  };

  // Update progress (update URL to current tab)
  const handleUpdate = async (id: string) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      if (tab && tab.url) {
        await updateEntry(id, { url: tab.url, domain: getDomain(tab.url) });
        setEntries(await getEntries());
      }
    });
  };

  // Delete entry (with confirmation)
  const handleDelete = async (id: string) => {
    setDeletingId(id);
  };
  const confirmDelete = async () => {
    if (deletingId) {
      await deleteEntry(deletingId);
      setEntries(await getEntries());
      setDeletingId(null);
    }
  };

  return (
    <div className="studylog-popup">
      <h2>Study Log</h2>
      <button onClick={fetchCurrentTab}>New Study Log</button>
      <ul className="entry-list">
        {entries.map(entry => (
          <li key={entry.id} className="entry-item">
            <a href={entry.url} target="_blank" rel="noopener noreferrer">{entry.title}</a>
            <span className="entry-domain">({entry.domain})</span>
            {entry.memo && <div className="entry-memo">{entry.memo}</div>}
            <div className="entry-actions">
              <button onClick={() => handleUpdate(entry.id)}>Update Progress</button>
              <button onClick={() => handleDelete(entry.id)}>Delete</button>
            </div>
            <div className="entry-updated">Last updated: {new Date(entry.updatedAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
      <EntryModal
        open={modalOpen}
        initialTitle={modalTitle}
        initialMemo={modalMemo}
        onSave={handleCreate}
        onClose={() => setModalOpen(false)}
      />
      {/* Delete confirmation modal */}
      {deletingId && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>Are you sure you want to delete this record?</p>
            <div className="modal-actions">
              <button onClick={confirmDelete}>Yes, Delete</button>
              <button onClick={() => setDeletingId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyLogPopup;

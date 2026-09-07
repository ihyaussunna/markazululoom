'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './AuthorSelector.module.css';

export default function AuthorSelector({
  initialAuthors = [],
  defaultValue = '',
  name = 'authorId',
  id = 'authorId',
  required = true,
}) {
  const [authors, setAuthors] = useState(initialAuthors);
  const [selectedId, setSelectedId] = useState(defaultValue);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBio, setNewBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [flashMessage, setFlashMessage] = useState('');

  const nameInputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);
    } else {
      setErrorMessage('');
      setNewName('');
      setNewBio('');
    }
  }, [isModalOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleSelectChange = (e) => {
    const val = e.target.value;
    if (val === '__add_new_author__') {
      // User picked the "+ Add New Author..." option inside the dropdown
      setIsModalOpen(true);
    } else {
      setSelectedId(val);
    }
  };

  const handleQuickAdd = async (e) => {
    if (e) e.preventDefault();
    if (!newName.trim()) {
      setErrorMessage('Please enter author name');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName.trim(),
          bio: newBio.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create author');
      }

      const createdAuthor = data.author;

      // Suddenly add to the list and auto-select
      setAuthors((prev) => [createdAuthor, ...prev]);
      setSelectedId(createdAuthor.id);

      // Close modal smoothly
      setIsModalOpen(false);

      // Show temporary flash confirmation
      setFlashMessage(`✓ Added "${createdAuthor.name}"`);
      setTimeout(() => {
        setFlashMessage('');
      }, 3500);
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while creating author');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.labelRow}>
        <label htmlFor={id} className={styles.label}>
          Author {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {flashMessage && (
            <span className={styles.flashSuccess}>{flashMessage}</span>
          )}
          <button
            type="button"
            className={styles.addAuthorBadge}
            onClick={() => setIsModalOpen(true)}
            title="Quickly add a new author"
          >
            <span>+</span> New Author
          </button>
        </div>
      </div>

      <select
        id={id}
        name={name}
        value={selectedId}
        onChange={handleSelectChange}
        required={required}
        className={styles.select}
      >
        <option value="">Select Author...</option>
        {authors.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
        <option
          value="__add_new_author__"
          style={{
            fontWeight: 'bold',
            color: 'var(--primary-color)',
            backgroundColor: 'rgba(0, 43, 91, 0.05)',
          }}
        >
          ➕ Add New Author...
        </option>
      </select>

      {/* Quick Add Author Modal */}
      {isModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className={styles.modalCard} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add New Author</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              {errorMessage && (
                <div className={styles.errorBanner}>{errorMessage}</div>
              )}

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Author Name <span className={styles.required}>*</span>
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  placeholder="e.g. Shafeeq Rahman / മുഹമ്മദ് അലി"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleQuickAdd();
                    }
                  }}
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Bio / Designation <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal', fontSize: '0.8rem' }}>(Optional)</span>
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Scholar, Writer, Columnist..."
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  className={styles.textarea}
                  disabled={isSubmitting}
                ></textarea>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.saveBtn}
                onClick={handleQuickAdd}
                disabled={isSubmitting || !newName.trim()}
              >
                {isSubmitting ? 'Saving...' : 'Save & Select'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

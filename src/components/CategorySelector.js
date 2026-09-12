'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './CategorySelector.module.css';

export default function CategorySelector({
  initialCategories = [],
  defaultValue = '',
  name = 'categoryId',
  id = 'categoryId',
  required = true,
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [selectedId, setSelectedId] = useState(defaultValue);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [flashMessage, setFlashMessage] = useState('');

  const nameInputRef = useRef(null);

  // Auto-generate slug when name changes, unless user modified slug
  const handleNameChange = (val) => {
    setNewName(val);
    const slugified = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\u0600-\u06FF\u0D00-\u0D7F]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setNewSlug(slugified);
  };

  // Focus input when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);
    } else {
      setErrorMessage('');
      setNewName('');
      setNewSlug('');
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
    if (val === '__add_new_category__') {
      setIsModalOpen(true);
    } else {
      setSelectedId(val);
    }
  };

  const handleQuickAdd = async (e) => {
    if (e) e.preventDefault();
    if (!newName.trim()) {
      setErrorMessage('Please enter category name');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName.trim(),
          slug: newSlug.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create category');
      }

      const createdCategory = data.category;

      // Update categories list and select the new category
      setCategories((prev) => {
        const exists = prev.some((c) => c.id === createdCategory.id);
        if (exists) return prev;
        return [...prev, createdCategory];
      });
      setSelectedId(createdCategory.id);

      // Close modal smoothly
      setIsModalOpen(false);

      // Show temporary flash confirmation
      setFlashMessage(`✓ Added "${createdCategory.name}"`);
      setTimeout(() => {
        setFlashMessage('');
      }, 3500);
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while creating category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.labelRow}>
        <label htmlFor={id} className={styles.label}>
          Category {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {flashMessage && (
            <span className={styles.flashSuccess}>{flashMessage}</span>
          )}
          <button
            type="button"
            className={styles.addCategoryBadge}
            onClick={() => setIsModalOpen(true)}
            title="Quickly add a new category"
          >
            <span>+</span> New Category
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
        <option value="">Select Category...</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
        <option
          value="__add_new_category__"
          style={{
            fontWeight: 'bold',
            color: 'var(--primary-color)',
            backgroundColor: 'rgba(0, 43, 91, 0.05)',
          }}
        >
          ➕ Add New Category...
        </option>
      </select>

      {/* Quick Add Category Modal */}
      {isModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className={styles.modalCard} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add New Category</h3>
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
                  Category Name <span className={styles.required}>*</span>
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  placeholder="e.g. SAQAFA / ثقافة / TECHNOLOGY"
                  value={newName}
                  onChange={(e) => handleNameChange(e.target.value)}
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
                  Slug (URL Friendly)
                </label>
                <input
                  type="text"
                  placeholder="e.g. saqafa"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleQuickAdd();
                    }
                  }}
                  className={styles.input}
                  disabled={isSubmitting}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Used for URLs: /category/{newSlug || 'example'}
                </span>
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

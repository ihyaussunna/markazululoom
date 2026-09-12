'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './RichTextEditor.module.css';

export default function RichTextEditor({
  defaultValue = '',
  name = 'content',
  id = 'content',
  placeholder = 'Write your story or article here... (Type content, select text to format side-headings, bold, etc.)',
  required = true,
}) {
  const [content, setContent] = useState(defaultValue || '');
  const [viewMode, setViewMode] = useState('visual'); // 'visual' | 'html'
  const [currentBlock, setCurrentBlock] = useState('p');
  const [direction, setDirection] = useState('auto'); // 'auto' | 'ltr' | 'rtl'

  const editorRef = useRef(null);

  // Initialize content inside contentEditable on mount
  useEffect(() => {
    if (editorRef.current && defaultValue) {
      editorRef.current.innerHTML = defaultValue;
    }
  }, [defaultValue]);

  // Sync content from contentEditable
  const handleEditorInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    setContent(html);
  };

  // Sync content when switching back from HTML mode to visual
  const handleRawHtmlChange = (e) => {
    const val = e.target.value;
    setContent(val);
    if (editorRef.current) {
      editorRef.current.innerHTML = val;
    }
  };

  // Execute standard formatting commands
  const executeCommand = (command, value = null) => {
    if (viewMode === 'html') return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    handleEditorInput();
  };

  // Format block (Paragraph, H2, H3, Blockquote)
  const handleFormatBlock = (tag) => {
    setCurrentBlock(tag);
    if (viewMode === 'html') return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand('formatBlock', false, `<${tag}>`);
    handleEditorInput();
  };

  // Link Insertion
  const handleInsertLink = () => {
    if (viewMode === 'html') return;
    const url = prompt('Enter web link URL (e.g. https://...):', 'https://');
    if (url && url.trim() && url !== 'https://') {
      executeCommand('createLink', url.trim());
    }
  };

  // Toggle Text Direction (useful for Arabic posts)
  const toggleDirection = () => {
    const nextDir = direction === 'rtl' ? 'ltr' : 'rtl';
    setDirection(nextDir);
    if (editorRef.current) {
      editorRef.current.setAttribute('dir', nextDir);
    }
  };

  // Calculate word count
  const getWordCount = () => {
    const text = content.replace(/<[^>]*>/g, ' ').trim();
    if (!text) return 0;
    return text.split(/\s+/).length;
  };

  return (
    <div className={styles.container}>
      {/* Formatting Toolbar */}
      <div className={styles.toolbar}>
        {/* Headings & Block Formats */}
        <div className={styles.toolbarGroup}>
          <select
            className={styles.headingSelect}
            value={currentBlock}
            onChange={(e) => handleFormatBlock(e.target.value)}
            disabled={viewMode === 'html'}
            title="Choose Heading or Paragraph style"
          >
            <option value="p">Paragraph (Normal Text)</option>
            <option value="h2">Heading 2 (Side Heading / വലിയ തലക്കെട്ട്)</option>
            <option value="h3">Heading 3 (Sub Heading / ചെറിയ തലക്കെട്ട്)</option>
            <option value="blockquote">Quote (ഉദ്ധരണി / ഇൻസെറ്റ്)</option>
          </select>
        </div>

        {/* Text Styles */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executeCommand('bold')}
            disabled={viewMode === 'html'}
            title="Bold (കട്ടി കൂട്ടുക) [Ctrl+B]"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executeCommand('italic')}
            disabled={viewMode === 'html'}
            title="Italic (ചെരിക്കുക) [Ctrl+I]"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executeCommand('underline')}
            disabled={viewMode === 'html'}
            title="Underline (അടിവര) [Ctrl+U]"
          >
            <u>U</u>
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executeCommand('strikeThrough')}
            disabled={viewMode === 'html'}
            title="Strikethrough (വെട്ടുക)"
          >
            <s>S</s>
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executeCommand('insertUnorderedList')}
            disabled={viewMode === 'html'}
            title="Bullet List (ലിസ്റ്റ്)"
          >
            •≡
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executeCommand('insertOrderedList')}
            disabled={viewMode === 'html'}
            title="Numbered List (നമ്പർ ലിസ്റ്റ്)"
          >
            1≡
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => handleFormatBlock('blockquote')}
            disabled={viewMode === 'html'}
            title="Blockquote (ഉദ്ധരണി)"
          >
            ❝
          </button>
        </div>

        {/* Alignments */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executeCommand('justifyLeft')}
            disabled={viewMode === 'html'}
            title="Align Left (ഇടത്തോട്ട്)"
          >
            ⇤
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executeCommand('justifyCenter')}
            disabled={viewMode === 'html'}
            title="Align Center (മധ്യത്തിൽ)"
          >
            ≡
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executeCommand('justifyRight')}
            disabled={viewMode === 'html'}
            title="Align Right (വലത്തോട്ട് / അറബിക്)"
          >
            ⇥
          </button>
        </div>

        {/* Links & Direction */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={handleInsertLink}
            disabled={viewMode === 'html'}
            title="Insert Link (ലിങ്ക് ചേർക്കുക)"
          >
            🔗
          </button>
          <button
            type="button"
            className={`${styles.toolBtn} ${direction === 'rtl' ? styles.active : ''}`}
            onClick={toggleDirection}
            disabled={viewMode === 'html'}
            title="Toggle RTL Direction (അറബിക് ദിശ)"
          >
            ⇄ {direction === 'rtl' ? 'RTL' : 'LTR'}
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => executeCommand('removeFormat')}
            disabled={viewMode === 'html'}
            title="Clear Formatting (ഫോർമാറ്റ് ഒഴിവാക്കുക)"
          >
            🧹
          </button>
        </div>

        {/* Mode Switcher */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            className={`${styles.modeBtn} ${viewMode === 'visual' ? styles.activeMode : ''}`}
            onClick={() => {
              if (viewMode === 'html' && editorRef.current) {
                editorRef.current.innerHTML = content;
              }
              setViewMode('visual');
            }}
          >
            Visual
          </button>
          <button
            type="button"
            className={`${styles.modeBtn} ${viewMode === 'html' ? styles.activeMode : ''}`}
            onClick={() => setViewMode('html')}
          >
            HTML
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      {viewMode === 'visual' ? (
        <div
          ref={editorRef}
          className={styles.editorArea}
          contentEditable
          dir={direction}
          onInput={handleEditorInput}
          onBlur={handleEditorInput}
          data-placeholder={placeholder}
          suppressContentEditableWarning={true}
        />
      ) : (
        <textarea
          className={styles.rawHtmlTextarea}
          value={content}
          onChange={handleRawHtmlChange}
          placeholder="Edit raw HTML code..."
          dir="auto"
        />
      )}

      {/* Hidden textarea to seamlessly submit with Next.js Server Action */}
      <textarea
        name={name}
        id={id}
        value={content}
        onChange={() => {}}
        required={required}
        style={{ display: 'none' }}
        readOnly
      />

      {/* Footer Info Bar */}
      <div className={styles.footerInfo}>
        <div className={styles.footerTips}>
          <span>💡 Select any line & click <strong>Heading 2</strong> for Side Headings</span>
        </div>
        <div>
          <span>{getWordCount()} words</span>
        </div>
      </div>
    </div>
  );
}

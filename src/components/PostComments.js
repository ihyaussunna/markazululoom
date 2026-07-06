'use client';

import { useState, useEffect } from 'react';
import styles from './PostComments.module.css';

export default function PostComments({ postId }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName, content })
      });

      if (res.ok) {
        const data = await res.json();
        setComments([data.comment, ...comments]);
        setAuthorName('');
        setContent('');
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.commentsSection}>
      <h3 className={styles.title}>Comments ({comments.length})</h3>

      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <div className={styles.inputGroup}>
          <input 
            type="text" 
            placeholder="Your Name" 
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <textarea 
            placeholder="Write a comment..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="3"
            className={styles.textarea}
          />
        </div>
        <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {isLoading ? (
        <p className={styles.loading}>Loading comments...</p>
      ) : (
        <div className={styles.commentsList}>
          {comments.length === 0 ? (
            <p className={styles.empty}>No comments yet. Be the first to share your thoughts!</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className={styles.commentItem}>
                <div className={styles.commentHeader}>
                  <div className={styles.avatar}>{comment.authorName.charAt(0).toUpperCase()}</div>
                  <div className={styles.meta}>
                    <strong>{comment.authorName}</strong>
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className={styles.commentContent}>{comment.content}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

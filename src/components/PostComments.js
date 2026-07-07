'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Trash2 } from 'lucide-react';
import styles from './PostComments.module.css';

export default function PostComments({ postId }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    if (!session) {
      signIn('google');
      return;
    }
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      if (res.ok) {
        const data = await res.json();
        setComments([data.comment, ...comments]);
        setContent('');
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setComments(comments.filter(c => c.id !== commentId));
      } else {
        console.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className={styles.commentsSection}>
      <h3 className={styles.title}>Comments ({comments.length})</h3>

      {session ? (
        <form onSubmit={handleSubmit} className={styles.commentForm}>
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
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>You must be logged in to post a comment.</p>
          <button onClick={() => signIn('google')} className={styles.submitBtn} style={{ margin: '0 auto' }}>
            Sign in with Google
          </button>
        </div>
      )}

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
                  {comment.user?.image ? (
                    <img src={comment.user.image} alt={comment.user.name} className={styles.avatar} style={{ border: 'none', borderRadius: '50%' }} />
                  ) : (
                    <div className={styles.avatar}>{(comment.user?.name || 'U').charAt(0).toUpperCase()}</div>
                  )}
                  <div className={styles.meta}>
                    <strong>{comment.user?.name || 'Anonymous User'}</strong>
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  {session?.user?.id === comment.userId && (
                    <button 
                      onClick={() => handleDeleteComment(comment.id)}
                      className={styles.deleteBtn}
                      title="Delete your comment"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
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

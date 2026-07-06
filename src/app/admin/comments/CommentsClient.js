'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { Trash2 } from 'lucide-react';

export default function CommentsClient() {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch('/api/admin/comments', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setComments(comments.filter(c => c.id !== id));
      } else {
        alert('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading comments...</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Author</th>
            <th>Comment</th>
            <th>Post</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td style={{ whiteSpace: 'nowrap' }}><strong>{comment.authorName}</strong></td>
              <td style={{ maxWidth: '300px' }}>
                <p style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {comment.content}
                </p>
              </td>
              <td>
                <a href={`/post/${comment.post.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
                  {comment.post.title}
                </a>
              </td>
              <td style={{ whiteSpace: 'nowrap' }}>{new Date(comment.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className={styles.deleteBtn}
                  title="Delete Comment"
                  disabled={isDeleting === comment.id}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
          {comments.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                No comments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import styles from './PostReactions.module.css';

export default function PostReactions({ postId, initialLikes, initialDislikes }) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [hasReacted, setHasReacted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReact = async (action) => {
    if (hasReacted || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/posts/${postId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
        setDislikes(data.dislikes);
        setHasReacted(true);
      }
    } catch (error) {
      console.error('Failed to react:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.reactionsContainer}>
      <button 
        className={`${styles.reactButton} ${hasReacted ? styles.disabled : ''}`} 
        onClick={() => handleReact('like')}
        disabled={hasReacted || isSubmitting}
      >
        <ThumbsUp size={20} />
        <span>{likes}</span>
      </button>

      <button 
        className={`${styles.reactButton} ${hasReacted ? styles.disabled : ''}`} 
        onClick={() => handleReact('dislike')}
        disabled={hasReacted || isSubmitting}
      >
        <ThumbsDown size={20} />
        <span>{dislikes}</span>
      </button>
    </div>
  );
}

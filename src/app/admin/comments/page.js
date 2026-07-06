import CommentsClient from './CommentsClient';
import styles from '../admin.module.css';

export default function AdminCommentsPage() {
  return (
    <div>
      <div className={styles.header}>
        <h1>Manage Comments</h1>
      </div>
      
      <CommentsClient />
    </div>
  );
}

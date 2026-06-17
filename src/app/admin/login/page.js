'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/app/actions/auth';
import styles from './login.module.css';

export default function LoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(formData) {
    const res = await login(formData);
    if (res?.error) {
      setError(res.error);
    } else {
      router.push('/admin');
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Admin Login</h2>
        <form action={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.btn}>Login</button>
        </form>
      </div>
    </div>
  );
}

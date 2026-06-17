'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_USER = 'uMarkazululoomm';
const ADMIN_PASS = 'passuMarkazululoomm';

export async function login(formData) {
  const username = formData.get('username');
  const password = formData.get('password');

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return { success: true };
  }

  return { error: 'Invalid username or password' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin/login');
}

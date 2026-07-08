'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSiteSettings() {
  const settings = await prisma.siteSetting.findMany();
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
  
  // Defaults
  if (!settingsMap['titleFont']) settingsMap['titleFont'] = 'fkl-dhikk';
  if (!settingsMap['textFont']) settingsMap['textFont'] = 'anek-malayalam';
  if (!settingsMap['uiFont']) settingsMap['uiFont'] = 'inter';
  
  return settingsMap;
}

export async function updateSiteSettings(formData) {
  const titleFont = formData.get('titleFont');
  const textFont = formData.get('textFont');
  const uiFont = formData.get('uiFont');

  if (titleFont) {
    await prisma.siteSetting.upsert({
      where: { key: 'titleFont' },
      update: { value: titleFont },
      create: { key: 'titleFont', value: titleFont }
    });
  }

  if (textFont) {
    await prisma.siteSetting.upsert({
      where: { key: 'textFont' },
      update: { value: textFont },
      create: { key: 'textFont', value: textFont }
    });
  }

  if (uiFont) {
    await prisma.siteSetting.upsert({
      where: { key: 'uiFont' },
      update: { value: uiFont },
      create: { key: 'uiFont', value: uiFont }
    });
  }

  revalidatePath('/');
  revalidatePath('/admin/settings');
  // Revalidate post pages
  revalidatePath('/post/[slug]', 'page');
}

export async function uploadBanner(formData) {
  const file = formData.get('image');
  const link = formData.get('link') || '';
  
  if (!file || file.size === 0) return { error: 'No image provided' };

  const imgbbFormData = new FormData();
  imgbbFormData.append('image', file);
  
  const apiKey = process.env.IMGBB_API_KEY || '065aaa8352796b4792cda33d9de4b2eb';
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: imgbbFormData,
  });
  
  const data = await response.json();
  if (data.success) {
    const imageUrl = data.data.url;
    
    // Get highest order
    const lastBanner = await prisma.banner.findFirst({
      orderBy: { order: 'desc' }
    });
    const order = lastBanner ? lastBanner.order + 1 : 0;

    await prisma.banner.create({
      data: {
        imageUrl,
        link,
        order
      }
    });

    revalidatePath('/');
    revalidatePath('/admin/settings');
    return { success: true };
  } else {
    return { error: 'ImgBB upload failed' };
  }
}

export async function deleteBanner(formData) {
  const id = formData.get('id');
  await prisma.banner.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin/settings');
}

export async function toggleBannerStatus(formData) {
  const id = formData.get('id');
  const isActive = formData.get('isActive') === 'true';
  await prisma.banner.update({
    where: { id },
    data: { isActive: !isActive }
  });
  revalidatePath('/');
  revalidatePath('/admin/settings');
}

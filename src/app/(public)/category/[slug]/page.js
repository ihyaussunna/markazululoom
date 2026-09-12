import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import styles from '../../home.module.css';
import { isArabic, getTextStyle } from '@/lib/typography';

export const revalidate = 60;


export default async function CategoryPage(props) {
  const { slug } = await props.params;

  const category = await prisma.category.findUnique({
    where: { slug }
  });

  if (!category) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1>Category not found</h1>
        <Link href="/" style={{ color: 'var(--primary-color)', marginTop: '1rem', display: 'inline-block' }}>Go Home</Link>
      </div>
    );
  }

  const isSaqafa = category.slug === 'saqafa';

  const posts = await prisma.post.findMany({
    where: { categoryId: category.id, published: true },
    include: { author: true, category: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={`container ${styles.homeContainer}`}>
      <div style={{ marginBottom: '3rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '1rem', display: 'inline-block', width: '100%' }}>
        {isSaqafa ? (
          <div>
            <h1 style={{ fontFamily: "var(--font-arabic-heading), 'Cairo', 'Alexandria', 'Tajawal', sans-serif", fontSize: '2.8rem', fontWeight: 800, color: 'var(--text-primary)', direction: 'rtl', textAlign: 'right' }}>
              ثقافة | SAQAFA
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginTop: '0.4rem', direction: 'rtl', textAlign: 'right', fontFamily: "var(--font-arabic), 'Tajawal', sans-serif", fontWeight: 500 }}>
              المقالات الأدبية، القصص والشعر العربي
            </p>
          </div>
        ) : (
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', color: 'var(--text-primary)' }}>
            {category.name.toUpperCase()}
          </h1>
        )}
      </div>

      {posts.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', ...(isSaqafa ? { direction: 'rtl', textAlign: 'right', fontFamily: "var(--font-arabic), 'Tajawal', sans-serif", fontSize: '1.2rem', fontWeight: 500 } : {}) }}>
          {isSaqafa ? 'لا توجد مقالات منشورة في هذا القسم حتى الآن.' : 'No posts available in this category yet.'}
        </p>
      ) : (
        <section className={styles.gridSection}>
          <div className={styles.postGrid}>
            {posts.map(post => (
              <article key={post.id} className={styles.postCard}>
                <div className={styles.cardImage}>
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt={post.title} />
                  ) : (
                    <div className={styles.placeholderImgSmall}>{isSaqafa ? 'ثقافة' : 'THINK'}</div>
                  )}
                </div>
                <div className={styles.cardContent} dir={isSaqafa || isArabic(post.title) ? 'rtl' : 'ltr'}>
                  <Link href={`/post/${post.slug}`}>
                    <h3 className={styles.cardTitle} style={getTextStyle(post.title, category.slug, { isHeading: true, lineHeight: 1.45 })}>
                      {post.title}
                    </h3>
                  </Link>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: 1.6, ...getTextStyle(post.excerpt, category.slug) }}>
                    {post.excerpt}
                  </p>
                  <div className={styles.authorMetaSmall}>
                    <span style={getTextStyle(post.author.name)}>{post.author.name}</span> • {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}


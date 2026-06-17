import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import styles from '../../home.module.css';

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

  const posts = await prisma.post.findMany({
    where: { categoryId: category.id, published: true },
    include: { author: true, category: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={`container ${styles.homeContainer}`}>
      <div style={{ marginBottom: '3rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '1rem', display: 'inline-block' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', color: 'var(--text-primary)' }}>
          {category.name.toUpperCase()}
        </h1>
      </div>

      {posts.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No posts available in this category yet.</p>
      ) : (
        <section className={styles.gridSection}>
          <div className={styles.postGrid}>
            {posts.map(post => (
              <article key={post.id} className={styles.postCard}>
                <div className={styles.cardImage}>
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt={post.title} />
                  ) : (
                    <div className={styles.placeholderImgSmall}>THINK</div>
                  )}
                </div>
                <div className={styles.cardContent}>
                  <Link href={`/post/${post.slug}`}>
                    <h3 className={styles.cardTitle}>{post.title}</h3>
                  </Link>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                    {post.excerpt}
                  </p>
                  <div className={styles.authorMetaSmall}>
                    {post.author.name} • {new Date(post.createdAt).toLocaleDateString()}
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

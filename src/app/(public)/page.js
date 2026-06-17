import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import styles from './home.module.css';

export default async function HomePage() {
  const latestPosts = await prisma.post.findMany({
    where: { published: true },
    include: { category: true, author: true },
    orderBy: { createdAt: 'desc' },
    take: 12
  });

  const featuredPost = latestPosts[0];
  const gridPosts = latestPosts.slice(1);

  return (
    <div className={`container ${styles.homeContainer}`}>
      {featuredPost && (
        <section className={styles.featuredSection}>
          <div className={styles.featuredImage}>
             {featuredPost.imageUrl ? (
               <img src={featuredPost.imageUrl} alt={featuredPost.title} />
             ) : (
               <div className={styles.placeholderImg}>No Image</div>
             )}
          </div>
          <div className={styles.featuredContent}>
            <Link href={`/category/${featuredPost.category.slug}`} className={styles.categoryLabel}>
              {featuredPost.category.name}
            </Link>
            <Link href={`/post/${featuredPost.slug}`}>
              <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
            </Link>
            <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
            <div className={styles.authorMeta}>
              {featuredPost.author.name} • {new Date(featuredPost.createdAt).toLocaleDateString()}
            </div>
          </div>
        </section>
      )}

      <section className={styles.gridSection}>
        <div className={styles.postGrid}>
          {gridPosts.map(post => (
            <article key={post.id} className={styles.postCard}>
              <div className={styles.cardImage}>
                {post.imageUrl ? (
                  <img src={post.imageUrl} alt={post.title} />
                ) : (
                  <div className={styles.placeholderImgSmall}>THINK</div>
                )}
              </div>
              <div className={styles.cardContent}>
                <Link href={`/category/${post.category.slug}`} className={styles.categoryLabelSmall}>
                  {post.category.name}
                </Link>
                <Link href={`/post/${post.slug}`}>
                  <h3 className={styles.cardTitle}>{post.title}</h3>
                </Link>
                <div className={styles.authorMetaSmall}>
                  {post.author.name} • {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

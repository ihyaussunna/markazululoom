import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import styles from './home.module.css';
import BannerCarousel from '@/components/BannerCarousel';

export default async function HomePage() {
  // Fetch latest 5 posts for the hero section
  const latestPosts = await prisma.post.findMany({
    where: { published: true },
    include: { category: true, author: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Fetch top 3 categories with their latest 4 posts
  const categories = await prisma.category.findMany({
    include: {
      posts: {
        where: { published: true },
        include: { author: true, category: true },
        orderBy: { createdAt: 'desc' },
        take: 4
      }
    },
    take: 3
  });

  const activeBanners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });

  const featuredPost = latestPosts[0];
  const sidePosts = latestPosts.slice(1, 4); // 3 posts for the sidebar

  return (
    <div className={`container ${styles.homeContainer}`}>
      {activeBanners.length > 0 && <BannerCarousel banners={activeBanners} />}
      
      {/* Top Blogs Section (Magazine Hero Layout) */}
      {featuredPost && (
        <div className={styles.heroWrapper}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>LATEST</h2>
          </div>
          
          <div className={styles.heroGrid}>
            <section className={styles.featuredHero}>
              <Link href={`/post/${featuredPost.slug}`}>
                <div className={styles.heroImageWrapper}>
                  {featuredPost.imageUrl ? (
                    <img src={featuredPost.imageUrl} alt={featuredPost.title} className={styles.heroImg} />
                  ) : (
                    <div className={styles.placeholderHeroImg}>NO IMAGE</div>
                  )}
                </div>
              </Link>
              <div className={styles.heroContent}>
                <Link href={`/category/${featuredPost.category.slug}`} className={styles.applePill}>
                  {featuredPost.category.name}
                </Link>
                <Link href={`/post/${featuredPost.slug}`}>
                  <h1 className={styles.heroTitle}>{featuredPost.title}</h1>
                </Link>
                <div className={styles.heroMeta}>
                  <strong>{featuredPost.author.name}</strong>
                  <span>{new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </section>

            <aside className={styles.heroSidebar}>
              {sidePosts.map(post => (
                <article key={post.id} className={styles.sidebarPost}>
                  <Link href={`/post/${post.slug}`}>
                    <div className={styles.sidebarImgWrapper}>
                      {post.imageUrl ? (
                        <img src={post.imageUrl} alt={post.title} />
                      ) : (
                        <div className={styles.placeholderSmallImg}>IMG</div>
                      )}
                    </div>
                  </Link>
                  <div className={styles.sidebarContent}>
                    <Link href={`/category/${post.category.slug}`} className={styles.applePillSmall}>
                      {post.category.name}
                    </Link>
                    <Link href={`/post/${post.slug}`}>
                      <h3 className={styles.sidebarTitle}>{post.title}</h3>
                    </Link>
                    <div className={styles.sidebarMeta}>
                      <span>{post.author.name}</span>
                    </div>
                  </div>
                </article>
              ))}
            </aside>
          </div>
        </div>
      )}

      {/* Category Blocks */}
      {categories.map(category => category.posts.length > 0 && (
        <section key={category.id} className={styles.categorySection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{category.name.toUpperCase()}</h2>
          </div>
          <div className={styles.categoryGrid}>
            {category.posts.map(post => (
              <article key={post.id} className={styles.gridCard}>
                <Link href={`/post/${post.slug}`}>
                  <div className={styles.gridImageWrapper}>
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title} />
                    ) : (
                      <div className={styles.placeholderGridImg}>IMG</div>
                    )}
                  </div>
                </Link>
                <div className={styles.gridContent}>
                  <Link href={`/category/${category.slug}`} className={styles.applePillSmall}>
                    {category.name}
                  </Link>
                  <Link href={`/post/${post.slug}`}>
                    <h3 className={styles.gridTitle}>{post.title}</h3>
                  </Link>
                  <div className={styles.gridMeta}>
                    <span>{post.author.name}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

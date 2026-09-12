import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import styles from './home.module.css';
import BannerCarousel from '@/components/BannerCarousel';
import { isArabic, getTextStyle } from '@/lib/typography';

export const revalidate = 60; // Cache page for 60 seconds

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
              <div className={styles.heroContent} dir={featuredPost.category?.slug === 'saqafa' || isArabic(featuredPost.title) ? 'rtl' : 'ltr'}>
                <Link href={`/category/${featuredPost.category.slug}`} className={styles.applePill}>
                  {featuredPost.category.slug === 'saqafa' ? 'ثقافة | SAQAFA' : featuredPost.category.name}
                </Link>
                <Link href={`/post/${featuredPost.slug}`}>
                  <h1 className={styles.heroTitle} style={getTextStyle(featuredPost.title, featuredPost.category?.slug, { isHeading: true, lineHeight: 1.35 })}>
                    {featuredPost.title}
                  </h1>
                </Link>
                <div className={styles.heroMeta}>
                  <span className={styles.authorName} style={getTextStyle(featuredPost.author.name)}>{featuredPost.author.name}</span>
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
                  <div className={styles.sidebarContent} dir={post.category?.slug === 'saqafa' || isArabic(post.title) ? 'rtl' : 'ltr'}>
                    <Link href={`/category/${post.category.slug}`} className={styles.applePillSmall}>
                      {post.category.slug === 'saqafa' ? 'ثقافة' : post.category.name}
                    </Link>
                    <Link href={`/post/${post.slug}`}>
                      <h3 className={styles.sidebarTitle} style={getTextStyle(post.title, post.category?.slug, { isHeading: true, lineHeight: 1.35 })}>
                        {post.title}
                      </h3>
                    </Link>
                    <div className={styles.sidebarMeta}>
                      <span className={styles.authorName} style={getTextStyle(post.author.name)}>{post.author.name}</span>
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
            <h2 className={styles.sectionTitle} style={category.slug === 'saqafa' ? { fontFamily: "var(--font-arabic-heading), 'Cairo', 'Alexandria', sans-serif", direction: 'rtl', textAlign: 'right' } : {}}>
              {category.slug === 'saqafa' ? 'ثقافة | SAQAFA' : category.name.toUpperCase()}
            </h2>
          </div>
          <div className={styles.categoryGrid}>
            {category.posts.map(post => (
              <article key={post.id} className={styles.gridCard}>
                <Link href={`/post/${post.slug}`}>
                  <div className={styles.gridImageWrapper}>
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title} />
                    ) : (
                      <div className={styles.placeholderGridImg}>{category.slug === 'saqafa' ? 'ثقافة' : 'IMG'}</div>
                    )}
                  </div>
                </Link>
                <div className={styles.gridContent} dir={category.slug === 'saqafa' || isArabic(post.title) ? 'rtl' : 'ltr'}>
                  <Link href={`/category/${category.slug}`} className={styles.applePillSmall}>
                    {category.slug === 'saqafa' ? 'ثقافة' : category.name}
                  </Link>
                  <Link href={`/post/${post.slug}`}>
                    <h3 className={styles.gridTitle} style={getTextStyle(post.title, category.slug, { isHeading: true, lineHeight: 1.35 })}>
                      {post.title}
                    </h3>
                  </Link>
                  <div className={styles.gridMeta}>
                    <span className={styles.authorName} style={getTextStyle(post.author.name)}>{post.author.name}</span>
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


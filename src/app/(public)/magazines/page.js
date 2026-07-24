import { prisma } from '@/lib/prisma';
import styles from './magazines.module.css';
import Link from 'next/link';

export const metadata = {
  title: 'Digital Magazines | Globeats',
  description: 'Read the latest issues of our premium digital magazines with a realistic flipbook experience.',
};

export const dynamic = 'force-dynamic';

export default async function MagazinesPage({ searchParams }) {
  // Simple search and filter implementation
  const search = searchParams?.q || '';
  const yearFilter = searchParams?.year || '';
  const sort = searchParams?.sort || 'desc';

  const where = {
    isActive: true,
    ...(search ? {
      OR: [
        { title: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } }
      ]
    } : {}),
    ...(yearFilter ? { year: parseInt(yearFilter) } : {})
  };

  const magazines = await prisma.magazine.findMany({
    where,
    orderBy: { publishedAt: sort === 'asc' ? 'asc' : 'desc' }
  });

  const featured = magazines.find(m => m.isFeatured) || magazines[0];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Digital Magazines</h1>
        <p className={styles.subtitle}>
          Immerse yourself in our premium collection. Experience realistic page-turning reading right in your browser.
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className={styles.filtersBar}>
        <form className={styles.searchForm} method="GET" action="/magazines">
          <input type="text" name="q" placeholder="Search magazines, topics, tags..." defaultValue={search} className={styles.searchInput} />
          <select name="year" defaultValue={yearFilter} className={styles.selectInput}>
            <option value="">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
          <select name="sort" defaultValue={sort} className={styles.selectInput}>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
          <button type="submit" className={styles.searchBtn}>Apply</button>
        </form>
      </div>

      {featured && !search && !yearFilter && (
        <div className={styles.featuredSection}>
          <div className={styles.featuredCover}>
            <img src={featured.coverImage} alt={featured.title} />
          </div>
          <div className={styles.featuredInfo}>
            <span className={styles.featuredBadge}>Featured Issue</span>
            <h2>{featured.title}</h2>
            {featured.edition && <div className={styles.edition}>{featured.edition} • {featured.year}</div>}
            <p>{featured.description}</p>
            <div className={styles.metaData}>
              <span>Language: {featured.language}</span>
              {featured.author && <span>Editor: {featured.author}</span>}
            </div>
            <Link href={`/magazines/${featured.slug}`} className={styles.readNowBtn}>
              Read Magazine
            </Link>
          </div>
        </div>
      )}

      {magazines.length > 0 ? (
        <div className={styles.grid}>
          {magazines.map((mag) => (
            <Link key={mag.id} href={`/magazines/${mag.slug}`} className={styles.magazineCard}>
              <div className={styles.coverContainer}>
                <img src={mag.coverImage} alt={mag.title} className={styles.coverImage} />
                <div className={styles.readOverlay}>
                  <span>Read Now</span>
                </div>
              </div>
              <div className={styles.info}>
                <div className={styles.metaTop}>
                  <span className={styles.date}>{mag.edition || mag.year}</span>
                  <span className={styles.lang}>{mag.language}</span>
                </div>
                <h3 className={styles.magazineTitle}>{mag.title}</h3>
                {mag.description && (
                  <p className={styles.description}>{mag.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          No magazines found matching your criteria.
        </div>
      )}
    </div>
  );
}

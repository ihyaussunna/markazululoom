import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import styles from './post.module.css';
import PostReactions from '@/components/PostReactions';
import PostComments from '@/components/PostComments';

export default async function SinglePostPage(props) {
  const { slug } = await props.params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true, category: true }
  });

  if (!post) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1>Post not found</h1>
        <Link href="/" style={{ color: 'var(--primary-color)', marginTop: '1rem', display: 'inline-block' }}>Go Home</Link>
      </div>
    );
  }

  // A simple function to safely render video embeds from YouTube or Instagram URLs
  const renderVideo = (url) => {
    if (!url) return null;
    
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch) {
      return (
        <div className={styles.videoContainer}>
          <iframe 
            src={`https://www.youtube.com/embed/${ytMatch[1]}`} 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
          </iframe>
        </div>
      );
    }

    // Instagram (requires embed script, but simple iframe approach for basic needs)
    if (url.includes('instagram.com')) {
       // Convert to embed URL if it's a standard post link
       const igUrl = url.split('?')[0].replace(/\/$/, '') + '/embed';
       return (
        <div className={styles.videoContainer}>
          <iframe 
            src={igUrl}
            frameBorder="0" 
            scrolling="no" 
            allowTransparency="true" 
            allow="encrypted-media">
          </iframe>
        </div>
      );
    }

    return null;
  };

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className="container">
          <Link href={`/category/${post.category.slug}`} className={styles.categoryLabel}>
            {post.category.name}
          </Link>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <div className={styles.authorInfo}>
              {post.author.profileImageUrl ? (
                <img src={post.author.profileImageUrl} alt={post.author.name} className={styles.authorImg} />
              ) : (
                <div className={styles.authorPlaceholder}>{post.author.name.charAt(0)}</div>
              )}
              <div className={styles.authorText}>
                <strong>{post.author.name}</strong>
                <p>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {post.imageUrl && !post.videoUrl && (
        <div className={styles.heroImage}>
          <img src={post.imageUrl} alt={post.title} />
        </div>
      )}

      {post.videoUrl && renderVideo(post.videoUrl)}

      <div className={`container ${styles.contentContainer}`}>
        <div 
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Reactions Section */}
        <PostReactions 
          postId={post.id} 
          initialLikes={post.likes} 
          initialDislikes={post.dislikes} 
        />

        {/* Comments Section */}
        <PostComments postId={post.id} />
        
        {post.author.bio && (
          <div className={styles.authorBioCard}>
            <div className={styles.bioHeader}>
              {post.author.profileImageUrl ? (
                <img src={post.author.profileImageUrl} alt={post.author.name} className={styles.authorImgLarge} />
              ) : (
                <div className={styles.authorPlaceholderLarge}>{post.author.name.charAt(0)}</div>
              )}
              <h3>About {post.author.name}</h3>
            </div>
            <p className={styles.bioText}>{post.author.bio}</p>
          </div>
        )}
      </div>
    </article>
  );
}

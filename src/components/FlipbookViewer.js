'use client';

import React, { useState, useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ZoomIn, ZoomOut, Maximize, X, ChevronLeft, ChevronRight, Menu, Share2, Download, Bookmark } from 'lucide-react';
import styles from './FlipbookViewer.module.css';
import { saveReadingHistory } from '@/app/actions/magazines';

// Configure PDF worker to use local Next.js Webpack integration instead of external CDN
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const pdfOptions = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
};

const PageContainer = React.forwardRef(({ pageNumber, width, height, type, url, isVisible = true }, ref) => {
  return (
    <div className={styles.page} ref={ref}>
      <div className={styles.pageContent}>
        {type === 'pdf' ? (
          isVisible ? (
            <Page 
              pageNumber={pageNumber} 
              scale={1.5}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={<div className={styles.pageLoading}>Loading page...</div>}
            />
          ) : (
            <div className={styles.pageLoading}></div>
          )
        ) : (
          <img src={url} alt={`Page ${pageNumber}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        )}
      </div>
      <div className={styles.pageNumberIndicator}>{pageNumber}</div>
    </div>
  );
});
PageContainer.displayName = 'PageContainer';

export default function FlipbookViewer({ magazine, userId, initialPage = 0 }) {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const bookRef = useRef();
  const containerRef = useRef();

  // Parse page images if not using PDF
  let images = [];
  try {
    if (magazine.pageImages) {
      images = JSON.parse(magazine.pageImages);
    }
  } catch (e) {}

  const isPdf = !!magazine.pdfLink;

  useEffect(() => {
    if (!isPdf && images.length > 0) {
      setNumPages(images.length);
    }
  }, [isPdf, images]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function onDocumentLoadProgress({ loaded, total }) {
    if (total) {
      setLoadingProgress(Math.round((loaded / total) * 100));
    }
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const playFlipSound = () => {
    try {
      const audio = new Audio('/page-flip.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (e) {}
  };

  const onFlip = (e) => {
    setCurrentPage(e.data);
    playFlipSound();
    if (userId) {
      saveReadingHistory(userId, magazine.id, e.data);
    }
  };

  const goToPage = (pageNum) => {
    if (bookRef.current && bookRef.current.pageFlip()) {
      bookRef.current.pageFlip().turnToPage(pageNum);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: magazine.title,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Dimensions based on screen size (rough estimation for responsive initial render)
  const [dimensions, setDimensions] = useState({ width: 400, height: 600, isMobile: true });
  
  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 768;
      const pdfRatio = 2550 / 3300;
      
      let width, height;
      if (isMobile) {
        width = window.innerWidth * 0.95;
        height = width / pdfRatio;
        
        const maxHeight = window.innerHeight * 0.75;
        if (height > maxHeight) {
          height = maxHeight;
          width = height * pdfRatio;
        }
      } else {
        height = window.innerHeight * 0.8;
        width = height * pdfRatio;
      }
      setDimensions({ width, height, isMobile });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className={styles.viewerContainer} ref={containerRef}>
      
      {/* Top Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={styles.iconBtn} title="Table of Contents">
            <Menu size={20} />
          </button>
          <span className={styles.title}>{magazine.title}</span>
        </div>
        
        <div className={styles.toolbarGroup}>
          <button onClick={handleZoomOut} className={styles.iconBtn} title="Zoom Out"><ZoomOut size={20} /></button>
          <span className={styles.zoomLevel}>{Math.round(zoom * 100)}%</span>
          <button onClick={handleZoomIn} className={styles.iconBtn} title="Zoom In"><ZoomIn size={20} /></button>
          <button onClick={toggleFullscreen} className={styles.iconBtn} title="Fullscreen"><Maximize size={20} /></button>
          <button onClick={handleShare} className={styles.iconBtn} title="Share"><Share2 size={20} /></button>
          {isPdf && (
            <a href={magazine.pdfLink} download target="_blank" rel="noreferrer" className={styles.iconBtn} title="Download PDF">
              <Download size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Sidebar (Table of Contents / Thumbnails) */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h3>Contents</h3>
          <button onClick={() => setSidebarOpen(false)} className={styles.iconBtn}><X size={20} /></button>
        </div>
        <div className={styles.sidebarBody}>
          <div className={styles.thumbnailGrid}>
            {numPages && Array.from(new Array(numPages), (el, index) => (
              <div 
                key={index} 
                className={`${styles.thumbnailItem} ${currentPage === index ? styles.activeThumb : ''}`}
                onClick={() => { goToPage(index); setSidebarOpen(false); }}
              >
                Page {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flipbook Area */}
      <div className={styles.flipbookWrapper}>
        {isPdf ? (
          <Document
            file={`/api/proxy-pdf?url=${encodeURIComponent(magazine.pdfLink)}`}
            options={pdfOptions}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadProgress={onDocumentLoadProgress}
            loading={
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div style={{ marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Downloading Magazine... {loadingProgress}%</div>
                <div style={{ width: '250px', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${loadingProgress}%`, height: '100%', backgroundColor: 'var(--primary-color)', transition: 'width 0.3s ease-out' }}></div>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>This may take a minute for large files.</div>
              </div>
            }
            className={styles.pdfDocument}
          >
            {numPages && (
              <HTMLFlipBook 
                width={dimensions.width * zoom} 
                height={dimensions.height * zoom}
                size="fixed"
                minWidth={315}
                maxWidth={2000}
                minHeight={400}
                maxHeight={3000}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                usePortrait={dimensions.isMobile}
                useMouseEvents={zoom === 1} /* Disable swipe when zoomed to allow native panning/scrolling */
                onFlip={onFlip}
                ref={bookRef}
                className={styles.flipbook}
              >
                {Array.from(new Array(numPages), (el, index) => {
                  const isVisible = Math.abs(currentPage - index) <= 3;
                  return (
                    <PageContainer 
                      key={`page_${index + 1}`} 
                      pageNumber={index + 1} 
                      type="pdf"
                      width={dimensions.width * zoom}
                      height={dimensions.height * zoom}
                      isVisible={isVisible}
                    />
                  );
                })}
              </HTMLFlipBook>
            )}
          </Document>
        ) : (
          numPages > 0 ? (
            <HTMLFlipBook 
                width={dimensions.width * zoom} 
                height={dimensions.height * zoom}
                size="fixed"
                minWidth={315}
                maxWidth={2000}
                minHeight={400}
                maxHeight={3000}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                usePortrait={dimensions.isMobile}
                useMouseEvents={zoom === 1}
                onFlip={onFlip}
                ref={bookRef}
                className={styles.flipbook}
              >
                {images.map((url, index) => (
                  <PageContainer 
                    key={`img_page_${index + 1}`} 
                    pageNumber={index + 1} 
                    type="img"
                    url={url}
                    width={dimensions.width * zoom}
                    height={dimensions.height * zoom}
                  />
                ))}
              </HTMLFlipBook>
          ) : (
            <div className={styles.errorState}>No pages found for this magazine.</div>
          )
        )}
      </div>
      
      {/* Bottom Navigation */}
      <div className={styles.bottomNav}>
        <button 
          className={styles.navBtn} 
          onClick={() => { if (bookRef.current) bookRef.current.pageFlip().flipPrev() }}
          disabled={currentPage === 0}
        >
          <ChevronLeft size={24} /> Prev
        </button>
        <span className={styles.pageInfo}>
          {numPages ? `${currentPage + 1} / ${numPages}` : '...'}
        </span>
        <button 
          className={styles.navBtn} 
          onClick={() => { if (bookRef.current) bookRef.current.pageFlip().flipNext() }}
          disabled={numPages && currentPage >= numPages - 1}
        >
          Next <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}

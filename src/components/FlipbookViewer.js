'use client';

import React, { useState, useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ZoomIn, ZoomOut, Maximize, X, ChevronLeft, ChevronRight, Menu, Share2, Download, Bookmark } from 'lucide-react';
import styles from './FlipbookViewer.module.css';
import { saveReadingHistory } from '@/app/actions/magazines';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PageContainer = React.forwardRef(({ pageNumber, width, height, type, url }, ref) => {
  return (
    <div className={styles.page} ref={ref}>
      <div className={styles.pageContent} style={{ width, height }}>
        {type === 'pdf' ? (
          <Page 
            pageNumber={pageNumber} 
            width={width}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            loading={<div className={styles.pageLoading}>Loading...</div>}
          />
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

  const onFlip = (e) => {
    setCurrentPage(e.data);
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
  const [dimensions, setDimensions] = useState({ width: 400, height: 600 });
  
  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 768;
      const height = window.innerHeight * 0.8;
      const width = isMobile ? window.innerWidth * 0.9 : height * 0.75;
      setDimensions({ width, height });
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
      <div className={styles.flipbookWrapper} style={{ transform: `scale(${zoom})` }}>
        {isPdf ? (
          <Document
            file={magazine.pdfLink}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className={styles.loadingState}>Loading Document...</div>}
            className={styles.pdfDocument}
          >
            {numPages && (
              <HTMLFlipBook 
                width={dimensions.width} 
                height={dimensions.height}
                size="stretch"
                minWidth={315}
                maxWidth={1000}
                minHeight={400}
                maxHeight={1533}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={onFlip}
                ref={bookRef}
                className={styles.flipbook}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <PageContainer 
                    key={`page_${index + 1}`} 
                    pageNumber={index + 1} 
                    type="pdf"
                    width={dimensions.width}
                    height={dimensions.height}
                  />
                ))}
              </HTMLFlipBook>
            )}
          </Document>
        ) : (
          numPages > 0 ? (
            <HTMLFlipBook 
                width={dimensions.width} 
                height={dimensions.height}
                size="stretch"
                minWidth={315}
                maxWidth={1000}
                minHeight={400}
                maxHeight={1533}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
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
                    width={dimensions.width}
                    height={dimensions.height}
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

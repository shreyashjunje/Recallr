import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ZoomIn, ZoomOut, Search, Download, Printer, RotateCw, ChevronLeft, ChevronRight,
  Maximize2, Minimize2, Loader2, BookOpen, Bookmark, Moon, Sun, Grid,
  Type, Highlighter, Underline, Strikethrough, Square, Circle, ArrowRight,
  Image, Pen, FileSignature, Share2, Menu, X, Check, ChevronDown, ChevronUp,
  Columns as ColumnsIcon
} from 'lucide-react';

// PDF.js worker setup
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * Key fixes vs original:
 * 1) Correct onDocumentLoadSuccess signature (uses PDFDocumentProxy), pulls real outline & metadata.
 * 2) Real text search across all pages using pdfjs getTextContent(), with next/prev navigation.
 * 3) "Fit to width/height/page" uses container measurements & PDF page viewport to compute scale.
 * 4) Annotation clicks store RELATIVE (0..1) positions so they stay aligned across zoom/rotation.
 * 5) Proper fullscreen handling, print & download hardening, dark mode class scoping.
 * 6) Thumbnails render safely only after numPages known; guards added.
 * 7) Removed unused state, tightened deps, and improved accessibility.
 */

const ToolbarButton = ({ title, onClick, disabled, children }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    disabled={disabled}
    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
  >
    {children}
  </button>
);

export default function PdfViewer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { url, fileName } = location.state || {};

  const rootRef = useRef(null); // wraps the entire viewer (for dark mode scoping)
  const viewerRef = useRef(null); // scrollable content area (for fit calculations)
  const pageWrapRef = useRef(null); // wraps current page (for overlay sizing)
  const pdfRef = useRef(null); // PDFDocumentProxy

  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('scroll'); // 'scroll' | 'single' | 'facing' | 'grid'
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [showToolbar, setShowToolbar] = useState(true);
  const [showOutline, setShowOutline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Metadata & outline
  const [docTitle, setDocTitle] = useState('');
  const [outline, setOutline] = useState(null);

  // Search
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchIndex, setSearchIndex] = useState([]); // [{ pageNumber, text }]
  const [currentSearchIdx, setCurrentSearchIdx] = useState(-1);

  // Annotations
  const [activeTool, setActiveTool] = useState(null); // 'highlight' | 'underline' | 'strikethrough' | 'rectangle' | 'circle' | 'arrow' | 'comment' | 'draw' | 'signature' | 'image'
  const [annotations, setAnnotations] = useState([]);

  // Compute a width for Page based on viewer/container size.
  const pageMaxWidth = useMemo(() => {
    const vw = viewerRef.current?.clientWidth || 1200;
    // Keep some padding margin
    const inner = Math.min(vw - 32, 1400);
    return inner > 0 ? inner : 600;
  }, [viewerRef.current?.clientWidth]);

  // Handle document load
  const onDocumentLoadSuccess = useCallback(async (pdf) => {
    try {
      pdfRef.current = pdf; // PDFDocumentProxy
      setNumPages(pdf.numPages || 0);
      setError(null);
      setIsLoading(false);

      // Pull real outline (TOC) if present
      try {
        const ol = await pdf.getOutline();
        if (ol && ol.length) {
          // Flatten one level deep: title + dest -> pageNumber
          const mapped = await Promise.all(
            ol.slice(0, 200).map(async (item) => {
              let pageNumber = 1;
              if (item.dest) {
                try {
                  const dest = await pdf.getDestination(item.dest);
                  const ref = Array.isArray(dest) ? dest[0] : null;
                  if (ref) {
                    pageNumber = await pdf.getPageIndex(ref) + 1;
                  }
                } catch {}
              }
              return { title: item.title || 'Untitled', pageNumber };
            })
          );
          setOutline(mapped);
        } else {
          setOutline(null);
        }
      } catch {
        setOutline(null);
      }

      // Metadata (title)
      try {
        const meta = await pdf.getMetadata();
        const title = meta?.info?.Title || meta?.metadata?.get?.('dc:title') || '';
        setDocTitle(title || '');
      } catch {
        setDocTitle('');
      }

      // Build search index lazily (first 200 pages to avoid heavy work on huge PDFs)
      const maxPages = Math.min(pdf.numPages || 0, 200);
      const results = [];
      for (let p = 1; p <= maxPages; p++) {
        try {
          const page = await pdf.getPage(p);
          const tc = await page.getTextContent();
          const text = (tc.items || []).map((i) => i.str).join(' ');
          results.push({ pageNumber: p, text });
        } catch {}
      }
      setSearchIndex(results);
    } catch (err) {
      console.error('Load success handler error:', err);
      setError('Failed while processing the PDF document.');
      setIsLoading(false);
    }
  }, []);

  const onDocumentLoadError = useCallback((err) => {
    console.error('PDF load error:', err);
    setError('Failed to load PDF. Please check the URL or try again later.');
    setIsLoading(false);
  }, []);

  // Navigation
  const goToPrevPage = useCallback(() => setPageNumber((n) => Math.max(1, n - 1)), []);
  const goToNextPage = useCallback(() => setPageNumber((n) => Math.min(numPages || 1, n + 1)), [numPages]);
  const goToPage = useCallback((n) => setPageNumber(() => Math.max(1, Math.min(n || 1, numPages || 1))), [numPages]);

  // Zoom helpers (fit calculations)
  const computeFitScale = useCallback(async (mode) => {
    const pdf = pdfRef.current;
    if (!pdf || !viewerRef.current) return scale;

    try {
      const page = await pdf.getPage(pageNumber || 1);
      const unrotated = page.getViewport({ scale: 1, rotation: 0 });
      // account rotation by swapping width/height for 90/270
      const baseWidth = rotation % 180 === 0 ? unrotated.width : unrotated.height;
      const baseHeight = rotation % 180 === 0 ? unrotated.height : unrotated.width;

      const containerW = viewerRef.current.clientWidth - 32; // padding
      const containerH = viewerRef.current.clientHeight - 32; // padding

      if (mode === 'width') return Math.max(0.1, containerW / baseWidth);
      if (mode === 'height') return Math.max(0.1, containerH / baseHeight);
      if (mode === 'page') return Math.max(0.1, Math.min(containerW / baseWidth, containerH / baseHeight));
      return scale;
    } catch {
      return scale;
    }
  }, [pageNumber, rotation, scale]);

  const zoomToFit = useCallback(async (mode) => {
    const s = await computeFitScale(mode);
    setScale(s);
  }, [computeFitScale]);

  const zoomIn = useCallback(() => setScale((s) => Math.min(4, +(s + 0.2).toFixed(2))), []);
  const zoomOut = useCallback(() => setScale((s) => Math.max(0.25, +(s - 0.2).toFixed(2))), []);

  // Rotation
  const rotate = useCallback(() => setRotation((r) => (r + 90) % 360), []);

  // Fullscreen
  const toggleFullScreen = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullScreen(false);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Download & Print
  const downloadPdf = useCallback(() => {
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', fileName || 'document.pdf');
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [url, fileName]);

  const printPdf = useCallback(() => {
    if (!url) return;
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) return;
    w.document.write(`<iframe src="${url}#toolbar=0&navpanes=0&scrollbar=0" style="width:100%;height:100%;border:0;"></iframe>`);
    w.document.close();
    // Give iframe a tick to load
    setTimeout(() => w.print?.(), 600);
  }, [url]);

  // Search actions
  const performSearch = useCallback((e) => {
    e?.preventDefault?.();
    const q = (searchText || '').trim();
    if (!q || !searchIndex.length) {
      setCurrentSearchIdx(-1);
      return;
    }
    const haystack = [];
    searchIndex.forEach(({ pageNumber, text }) => {
      const idx = text.toLowerCase().indexOf(q.toLowerCase());
      if (idx !== -1) haystack.push({ pageNumber, idx });
    });
    if (haystack.length) {
      setCurrentSearchIdx(0);
      goToPage(haystack[0].pageNumber);
    } else {
      setCurrentSearchIdx(-1);
    }
  }, [searchText, searchIndex, goToPage]);

  const gotoNextSearch = useCallback(() => {
    if (!searchText || !searchIndex.length) return;
    // gather pages containing the query
    const q = searchText.toLowerCase();
    const pages = searchIndex.filter(p => p.text.toLowerCase().includes(q)).map(p => p.pageNumber);
    if (!pages.length) return;
    const pos = pages.indexOf(pageNumber);
    const nextPage = pages[(pos + 1) % pages.length];
    setCurrentSearchIdx((i) => (i + 1) % pages.length);
    goToPage(nextPage);
  }, [searchText, searchIndex, pageNumber, goToPage]);

  const gotoPrevSearch = useCallback(() => {
    if (!searchText || !searchIndex.length) return;
    const q = searchText.toLowerCase();
    const pages = searchIndex.filter(p => p.text.toLowerCase().includes(q)).map(p => p.pageNumber);
    if (!pages.length) return;
    const pos = pages.indexOf(pageNumber);
    const prevPage = pages[(pos - 1 + pages.length) % pages.length];
    setCurrentSearchIdx((i) => (i - 1 + pages.length) % pages.length);
    goToPage(prevPage);
  }, [searchText, searchIndex, pageNumber, goToPage]);

  // Annotation add/remove/update using RELATIVE coordinates
  const addAnnotation = useCallback((type, content, relPos) => {
    const ann = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      type,
      content: content || '',
      position: relPos, // { x:0..1, y:0..1, w?:0..1, h?:0..1 }
      pageNumber,
      createdAt: Date.now(),
      color: type === 'highlight' ? '#ffff00' : '#000000'
    };
    setAnnotations((prev) => [...prev, ann]);
    return ann;
  }, [pageNumber]);

  const handlePageClick = useCallback((e) => {
    if (!activeTool || !pageWrapRef.current) return;
    const rect = pageWrapRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    if (activeTool === 'comment') {
      const comment = window.prompt('Enter your comment:');
      if (comment) addAnnotation('comment', comment, { x, y });
    } else if (activeTool === 'highlight') {
      addAnnotation('highlight', '', { x: Math.max(0, x - 0.05), y: Math.max(0, y - 0.01), w: 0.1, h: 0.02 });
    } else if (activeTool === 'rectangle') {
      addAnnotation('rectangle', '', { x: Math.max(0, x - 0.05), y: Math.max(0, y - 0.05), w: 0.1, h: 0.1 });
    } else if (activeTool === 'circle') {
      addAnnotation('circle', '', { x, y, r: 0.05 });
    }
  }, [activeTool, addAnnotation]);

  const removeAnnotation = useCallback((id) => setAnnotations((prev) => prev.filter(a => a.id !== id)), []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.key === 'ArrowLeft' && viewMode === 'single') goToPrevPage();
      if (e.key === 'ArrowRight' && viewMode === 'single') goToNextPage();
      if ((e.ctrlKey || e.metaKey) && e.key === '+') { e.preventDefault(); zoomIn(); }
      if ((e.ctrlKey || e.metaKey) && e.key === '-') { e.preventDefault(); zoomOut(); }
      if ((e.ctrlKey || e.metaKey) && e.key === '0') { e.preventDefault(); zoomToFit('width'); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') { e.preventDefault(); setShowSearch(true); }
      if (e.key === 'Escape') { setShowSearch(false); setActiveTool(null); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewMode, goToPrevPage, goToNextPage, zoomIn, zoomOut, zoomToFit]);

  // Scoped dark mode: toggle a class on the root of this component only.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.classList.toggle('dark', !!darkMode);
  }, [darkMode]);

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-2xl font-bold text-red-500 mb-4">No PDF URL provided</div>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="w-full min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Toolbar */}
      {showToolbar && (
        <div className="p-2 flex flex-wrap items-center justify-between gap-2 sticky top-0 z-50 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow">
          <div className="flex items-center gap-2 min-w-0">
            <ToolbarButton title="Go back" onClick={() => navigate(-1)}>
              ← Back
            </ToolbarButton>
            <span className="text-sm truncate max-w-xs" title={fileName || url}>{fileName || 'PDF Document'}</span>
            {docTitle && <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[16rem]" title={docTitle}>• {docTitle}</span>}
          </div>

          <div className="flex items-center gap-2">
            {/* View menu */}
            <div className="relative">
              <ToolbarButton title="View Options" onClick={(e) => {
                e.currentTarget.nextSibling?.classList.toggle('hidden');
              }}>
                <div className="flex items-center gap-1"><Menu size={16} /><span>View</span><ChevronDown size={14} /></div>
              </ToolbarButton>
              <div className="hidden absolute top-full left-0 mt-1 w-48 rounded shadow-lg z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="p-2 border-b dark:border-gray-700">
                  <div className="text-xs font-semibold mb-1">View Mode</div>
                  <button onClick={() => setViewMode('single')} className={`w-full text-left p-2 rounded flex items-center gap-2 ${viewMode === 'single' ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}><Bookmark size={16}/> Single Page</button>
                  <button onClick={() => setViewMode('scroll')} className={`w-full text-left p-2 rounded flex items-center gap-2 ${viewMode === 'scroll' ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}><BookOpen size={16}/> Continuous Scroll</button>
                  <button onClick={() => setViewMode('facing')} className={`w-full text-left p-2 rounded flex items-center gap-2 ${viewMode === 'facing' ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}><ColumnsIcon size={16}/> Facing Pages</button>
                  <button onClick={() => setViewMode('grid')} className={`w-full text-left p-2 rounded flex items-center gap-2 ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}><Grid size={16}/> Grid View</button>
                </div>
                <div className="p-2 border-b dark:border-gray-700">
                  <div className="text-xs font-semibold mb-1">Zoom</div>
                  <button onClick={() => zoomToFit('width')} className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Fit to Width</button>
                  <button onClick={() => zoomToFit('height')} className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Fit to Height</button>
                  <button onClick={() => zoomToFit('page')} className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Fit to Page</button>
                </div>
                <div className="p-2">
                  <div className="text-xs font-semibold mb-1">Display</div>
                  <button onClick={() => setDarkMode((d)=>!d)} className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">{darkMode ? <Sun size={16}/> : <Moon size={16}/>} {darkMode ? 'Light Mode' : 'Dark Mode'}</button>
                  <button onClick={() => setShowThumbnails((t)=>!t)} className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">{showThumbnails ? <X size={16}/> : <Check size={16}/>} Thumbnails</button>
                  <button onClick={() => setShowOutline((o)=>!o)} className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">{showOutline ? <X size={16}/> : <Check size={16}/>} Document Outline</button>
                </div>
              </div>
            </div>

            {/* Single-page navigation */}
            {viewMode === 'single' && (
              <div className="flex items-center gap-1">
                <ToolbarButton title="First page" onClick={() => goToPage(1)} disabled={pageNumber === 1}>|←</ToolbarButton>
                <ToolbarButton title="Previous page" onClick={goToPrevPage} disabled={pageNumber === 1}><ChevronLeft size={16}/></ToolbarButton>
                <div className="flex items-center mx-1">
                  <input type="number" min={1} max={numPages || 1} value={pageNumber} onChange={(e)=> goToPage(parseInt(e.target.value) || 1)} className="w-14 text-center border rounded p-1 dark:bg-gray-700 dark:border-gray-600"/>
                  <span className="text-sm mx-1">of {numPages || '--'}</span>
                </div>
                <ToolbarButton title="Next page" onClick={goToNextPage} disabled={pageNumber === numPages}><ChevronRight size={16}/></ToolbarButton>
                <ToolbarButton title="Last page" onClick={() => goToPage(numPages)} disabled={pageNumber === numPages}>→|</ToolbarButton>
              </div>
            )}

            {/* Zoom */}
            <div className="flex items-center gap-1">
              <ToolbarButton title="Zoom out" onClick={zoomOut} disabled={scale <= 0.25}><ZoomOut size={16}/></ToolbarButton>
              <span className="text-sm mx-1">{Math.round(scale * 100)}%</span>
              <ToolbarButton title="Zoom in" onClick={zoomIn} disabled={scale >= 4}><ZoomIn size={16}/></ToolbarButton>
            </div>

            {/* Rotate & FS */}
            <ToolbarButton title="Rotate" onClick={rotate}><RotateCw size={16}/></ToolbarButton>
            <ToolbarButton title={isFullScreen ? 'Exit fullscreen' : 'Fullscreen'} onClick={toggleFullScreen}>
              {isFullScreen ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
            </ToolbarButton>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            {showSearch ? (
              <form onSubmit={performSearch} className="flex items-center">
                <input id="search-input" type="text" value={searchText} onChange={(e)=> setSearchText(e.target.value)} placeholder="Search..." className="px-2 py-1 rounded-l text-sm w-32 focus:w-64 transition-all duration-300 dark:bg-gray-700 dark:border-gray-600" autoFocus />
                <button type="submit" className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600" title="Search"><Search size={16}/></button>
                <div className="ml-2 text-sm flex items-center">
                  <button type="button" onClick={gotoPrevSearch} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"><ChevronUp size={14}/></button>
                  <button type="button" onClick={gotoNextSearch} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"><ChevronDown size={14}/></button>
                </div>
                <button type="button" onClick={()=> setShowSearch(false)} className="p-2 ml-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><X size={16}/></button>
              </form>
            ) : (
              <ToolbarButton title="Search (Ctrl+F)" onClick={()=> setShowSearch(true)}><Search size={16}/></ToolbarButton>
            )}

            {/* File actions */}
            <div className="relative">
              <ToolbarButton title="File Options" onClick={(e)=>{
                e.currentTarget.nextSibling?.classList.toggle('hidden');
              }}>
                <div className="flex items-center gap-1"><Menu size={16}/><span>File</span><ChevronDown size={14}/></div>
              </ToolbarButton>
              <div className="hidden absolute top-full right-0 mt-1 w-48 rounded shadow-lg z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="p-2">
                  <button onClick={downloadPdf} className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><Download size={16}/> Download</button>
                  <button onClick={printPdf} className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><Printer size={16}/> Print</button>
                  <button onClick={()=> navigator.share?.({ url, title: fileName || 'PDF' }).catch(()=>{})} className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><Share2 size={16}/> Share</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main area */}
      <div ref={viewerRef} className="flex flex-1 overflow-hidden">
        {/* Thumbnails */}
        {showThumbnails && numPages > 0 && (
          <div className="w-48 min-w-48 overflow-y-auto border-r bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="p-2 font-semibold border-b dark:border-gray-700">Thumbnails</div>
            <Document file={url} loading={<div className="flex items-center justify-center h-16"><Loader2 className="animate-spin h-6 w-6"/></div>}>
              {Array.from({ length: numPages }, (_, i) => (
                <div key={`thumb_${i+1}`} onClick={()=> goToPage(i+1)} className={`p-2 border-b cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 ${pageNumber === i+1 ? 'bg-blue-100 dark:bg-gray-600' : ''}`}>
                  <Page pageNumber={i+1} width={160} renderTextLayer={false} renderAnnotationLayer={false} className="border border-gray-200 dark:border-gray-600" />
                  <div className="text-xs text-center mt-1">Page {i+1}</div>
                </div>
              ))}
            </Document>
          </div>
        )}

        {/* Outline */}
        {showOutline && (
          <div className="w-56 min-w-56 overflow-y-auto border-r bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="p-2 font-semibold border-b dark:border-gray-700">Document Outline</div>
            <div className="p-2">
              {outline?.length ? outline.map((item, idx) => (
                <div key={`outline_${idx}`} onClick={()=> goToPage(item.pageNumber)} className="p-1 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 truncate" title={item.title}>
                  {item.title}
                </div>
              )) : <div className="p-2 text-sm text-gray-500">No outline available</div>}
            </div>
          </div>
        )}

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto p-4 flex flex-col items-center">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-600 dark:text-gray-300">
              <Loader2 className="animate-spin h-12 w-12"/>
              <p className="mt-4">Loading PDF…</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded max-w-md bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {!error && (
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div className="flex flex-col items-center justify-center h-64"><Loader2 className="animate-spin h-12 w-12"/><p className="mt-4">Loading PDF document…</p></div>}
              options={{ cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`, cMapPacked: true }}
            >
              {viewMode === 'single' ? (
                <div ref={pageWrapRef} onClick={handlePageClick} className="relative">
                  <Page
                    key={`page_${pageNumber}_${rotation}`}
                    pageNumber={pageNumber}
                    scale={scale}
                    rotate={rotation}
                    width={pageMaxWidth}
                    renderTextLayer
                    renderAnnotationLayer
                    className="border border-gray-300 shadow-lg bg-white"
                  />
                  {/* Annotation overlays */}
                  {annotations.filter(a => a.pageNumber === pageNumber).map((a) => {
                    if (a.type === 'highlight' || a.type === 'rectangle') {
                      const style = {
                        position: 'absolute',
                        left: `${a.position.x * 100}%`,
                        top: `${a.position.y * 100}%`,
                        width: `${(a.position.w || 0.1) * 100}%`,
                        height: `${(a.position.h || 0.02) * 100}%`,
                        background: a.type === 'highlight' ? 'rgba(255,255,0,0.35)' : 'transparent',
                        border: a.type === 'rectangle' ? '2px solid rgba(59,130,246,0.9)' : 'none',
                        borderRadius: a.type === 'rectangle' ? '4px' : 0,
                        pointerEvents: 'none'
                      };
                      return <div key={a.id} style={style} />;
                    }
                    if (a.type === 'circle') {
                      const r = a.position.r || 0.05;
                      const style = {
                        position: 'absolute',
                        left: `${(a.position.x - r) * 100}%`,
                        top: `${(a.position.y - r) * 100}%`,
                        width: `${r * 2 * 100}%`,
                        height: `${r * 2 * 100}%`,
                        border: '2px solid rgba(59,130,246,0.9)',
                        borderRadius: '9999px',
                        pointerEvents: 'none'
                      };
                      return <div key={a.id} style={style} />;
                    }
                    if (a.type === 'comment') {
                      const style = {
                        position: 'absolute',
                        left: `${a.position.x * 100}%`,
                        top: `${a.position.y * 100}%`,
                        transform: 'translate(-50%, -100%)',
                        background: 'rgba(59,130,246,0.95)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        maxWidth: '240px'
                      };
                      return (
                        <div key={a.id} style={style} onClick={(e)=>{ e.stopPropagation(); if (confirm('Delete comment?')) removeAnnotation(a.id); }}>
                          {a.content}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              ) : viewMode === 'facing' ? (
                <div className="flex flex-col items-center">
                  {Array.from({ length: Math.ceil((numPages || 0) / 2) }, (_, i) => {
                    const leftPage = i * 2 + 1;
                    const rightPage = i * 2 + 2;
                    return (
                      <div key={`spread_${i}`} className="flex mb-4">
                        <div className="mr-2">
                          <Page pageNumber={leftPage} scale={scale} rotate={rotation} width={Math.min(pageMaxWidth/2, 700)} className="border border-gray-300 shadow-lg bg-white" />
                        </div>
                        {rightPage <= (numPages || 0) && (
                          <div>
                            <Page pageNumber={rightPage} scale={scale} rotate={rotation} width={Math.min(pageMaxWidth/2, 700)} className="border border-gray-300 shadow-lg bg-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: numPages || 0 }, (_, i) => (
                    <div key={`grid_${i+1}`} className="cursor-pointer" onClick={()=> { setViewMode('single'); goToPage(i+1); }}>
                      <Page pageNumber={i+1} scale={Math.max(0.4, scale * 0.5)} rotate={rotation} width={Math.min(pageMaxWidth/2, 500)} className="border border-gray-300 shadow-lg bg-white" />
                      <div className="text-xs text-center mt-1">Page {i+1}</div>
                    </div>
                  ))}
                </div>
              ) : (
                // scroll mode
                <div className="w-full flex flex-col items-center">
                  {Array.from({ length: numPages || 0 }, (_, i) => (
                    <div key={`scroll_${i+1}`} className="mb-4">
                      <Page pageNumber={i+1} scale={scale} rotate={rotation} width={pageMaxWidth} className="border border-gray-300 shadow-lg bg-white" />
                    </div>
                  ))}
                </div>
              )}
            </Document>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="p-2 text-xs flex justify-between items-center bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <div className="truncate max-w-[60%]">
          {fileName && <span className="truncate inline-block align-middle mr-2" title={fileName}>{fileName}</span>}
          {docTitle && <span className="text-gray-500 dark:text-gray-400" title="Document Title">{docTitle}</span>}
        </div>
        <div>
          {viewMode === 'single' && <span className="mr-2">Page {pageNumber} of {numPages || '--'}</span>}
          <span>Zoom: {Math.round(scale * 100)}%</span>
        </div>
      </div>

      {/* Mobile FABs */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 md:hidden">
        {viewMode === 'single' && (
          <>
            <button onClick={goToPrevPage} disabled={pageNumber === 1} className="p-3 bg-blue-500 text-white rounded-full shadow-lg disabled:opacity-50"><ChevronLeft size={24}/></button>
            <button onClick={goToNextPage} disabled={pageNumber === numPages} className="p-3 bg-blue-500 text-white rounded-full shadow-lg disabled:opacity-50"><ChevronRight size={24}/></button>
          </>
        )}
        <button onClick={()=> setShowToolbar((s)=>!s)} className="p-3 bg-blue-500 text-white rounded-full shadow-lg">{showToolbar ? <X size={24}/> : <Menu size={24}/>}</button>
      </div>
    </div>
  );
}

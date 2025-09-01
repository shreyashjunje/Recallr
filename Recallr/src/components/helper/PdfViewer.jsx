import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ZoomIn,
  ZoomOut,
  Search,
  Download,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Loader2,
  BookOpen,
  Columns,
  List,
  X,
} from "lucide-react";
import axios from "axios";
const API_URL=import.meta.env.VITE_API_URL

// PDF.js worker setup
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ToolbarButton = ({ title, onClick, disabled, children, active }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 ${
      active ? "bg-blue-100 dark:bg-blue-900" : ""
    }`}
  >
    {children}
  </button>
);

export default function PdfViewer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { url, fileName ,pdfId} = location.state || {};

  const viewerRef = useRef(null);
  const pdfRef = useRef(null);
  const containerRef = useRef(null);

  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [viewMode, setViewMode] = useState("scroll"); // 'scroll' or 'double'
  const [showOutline, setShowOutline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Metadata & outline
  const [docTitle, setDocTitle] = useState("");
  const [outline, setOutline] = useState(null);

  // Search
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchIndex, setSearchIndex] = useState([]);
  const [currentSearchIdx, setCurrentSearchIdx] = useState(-1);

  // Current visible page for status display
  const [visiblePage, setVisiblePage] = useState(1);

  // Compute a width for Page based on viewer/container size.
  const pageMaxWidth = useMemo(() => {
    const vw = viewerRef.current?.clientWidth || 1200;
    const inner = Math.min(vw - 32, 1400);
    return inner > 0 ? inner : 600;
  }, [viewerRef.current?.clientWidth, viewMode]);

  useEffect(() => {
  if (!numPages || !visiblePage) return;
  console.log("pdfiD:",pdfId)

  const updateProgress = async () => {
    try {
      await axios.put(`${API_URL}/pdf/${pdfId}/progress`, {
        currentPage: visiblePage,
        totalPages: numPages,
      });
      console.log(`Progress updated: ${pdfId}/${numPages}`);
    } catch (err) {
      console.error("Failed to update progress", err);
    }
  };

  updateProgress();
}, [visiblePage, numPages, fileName]);

  // Handle document load
  const onDocumentLoadSuccess = useCallback(async (pdf) => {
    try {
      pdfRef.current = pdf;
      setNumPages(pdf.numPages || 0);
      setError(null);
      setIsLoading(false);

      // Pull real outline (TOC) if present
      try {
        const ol = await pdf.getOutline();
        if (ol && ol.length) {
          const mapped = await Promise.all(
            ol.slice(0, 50).map(async (item) => {
              let pageNumber = 1;
              if (item.dest) {
                try {
                  const dest = await pdf.getDestination(item.dest);
                  const ref = Array.isArray(dest) ? dest[0] : null;
                  if (ref) {
                    pageNumber = (await pdf.getPageIndex(ref)) + 1;
                  }
                } catch {}
              }
              return { title: item.title || "Untitled", pageNumber };
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
        const title = meta?.info?.Title || "";
        setDocTitle(title || "");
      } catch {
        setDocTitle("");
      }

      // Build search index (first 50 pages only for performance)
      const maxPages = Math.min(pdf.numPages || 0, 50);
      const results = [];
      for (let p = 1; p <= maxPages; p++) {
        try {
          const page = await pdf.getPage(p);
          const tc = await page.getTextContent();
          const text = (tc.items || []).map((i) => i.str).join(" ");
          results.push({ pageNumber: p, text });
        } catch {}
      }
      setSearchIndex(results);
    } catch (err) {
      console.error("Load success handler error:", err);
      setError("Failed while processing the PDF document.");
      setIsLoading(false);
    }
  }, []);

  const onDocumentLoadError = useCallback((err) => {
    console.error("PDF load error:", err);
    setError("Failed to load PDF. Please check the URL or try again later.");
    setIsLoading(false);
  }, []);

  // Navigation
  const goToPage = useCallback(
    (n) => {
      const pageNum = Math.max(1, Math.min(n || 1, numPages || 1));
      const element = document.getElementById(`page-${pageNum}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [numPages]
  );

  // Zoom helpers (fit calculations)
  const computeFitScale = useCallback(
    async (mode) => {
      const pdf = pdfRef.current;
      if (!pdf || !viewerRef.current) return scale;

      try {
        const page = await pdf.getPage(1);
        const unrotated = page.getViewport({ scale: 1, rotation: 0 });
        const baseWidth =
          rotation % 180 === 0 ? unrotated.width : unrotated.height;
        const baseHeight =
          rotation % 180 === 0 ? unrotated.height : unrotated.width;

        const containerW = viewerRef.current.clientWidth - 32;
        const containerH = viewerRef.current.clientHeight - 32;

        if (mode === "width") return Math.max(0.1, containerW / baseWidth);
        if (mode === "height") return Math.max(0.1, containerH / baseHeight);
        if (mode === "page")
          return Math.max(
            0.1,
            Math.min(containerW / baseWidth, containerH / baseHeight)
          );
        return scale;
      } catch {
        return scale;
      }
    },
    [rotation, scale]
  );

  const zoomToFit = useCallback(
    async (mode) => {
      const s = await computeFitScale(mode);
      setScale(s);
    },
    [computeFitScale]
  );

  const zoomIn = useCallback(
    () => setScale((s) => Math.min(4, +(s + 0.2).toFixed(2))),
    []
  );
  const zoomOut = useCallback(
    () => setScale((s) => Math.max(0.25, +(s - 0.2).toFixed(2))),
    []
  );

  // Rotation
  const rotate = useCallback(() => setRotation((r) => (r + 90) % 360), []);

  // Fullscreen
  const toggleFullScreen = useCallback(() => {
    const el = document.documentElement;
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
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Track visible page for scroll mode
  useEffect(() => {
    if (viewMode !== "scroll" || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = parseInt(entry.target.id.split("-")[1]);
            setVisiblePage(pageNum);
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all page elements
    const pageElements = document.querySelectorAll('[id^="page-"]');
    pageElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [viewMode, numPages]);

  // Search actions
  const performSearch = useCallback(
    (e) => {
      e?.preventDefault?.();
      const q = (searchText || "").trim();
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
    },
    [searchText, searchIndex, goToPage]
  );

  const gotoNextSearch = useCallback(() => {
    if (!searchText || !searchIndex.length) return;
    const q = searchText.toLowerCase();
    const pages = searchIndex
      .filter((p) => p.text.toLowerCase().includes(q))
      .map((p) => p.pageNumber);
    if (!pages.length) return;
    const pos = pages.indexOf(visiblePage);
    const nextPage = pages[(pos + 1) % pages.length];
    setCurrentSearchIdx((i) => (i + 1) % pages.length);
    goToPage(nextPage);
  }, [searchText, searchIndex, visiblePage, goToPage]);

  const gotoPrevSearch = useCallback(() => {
    if (!searchText || !searchIndex.length) return;
    const q = searchText.toLowerCase();
    const pages = searchIndex
      .filter((p) => p.text.toLowerCase().includes(q))
      .map((p) => p.pageNumber);
    if (!pages.length) return;
    const pos = pages.indexOf(visiblePage);
    const prevPage = pages[(pos - 1 + pages.length) % pages.length];
    setCurrentSearchIdx((i) => (i - 1 + pages.length) % pages.length);
    goToPage(prevPage);
  }, [searchText, searchIndex, visiblePage, goToPage]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if ((e.ctrlKey || e.metaKey) && e.key === "+") {
        e.preventDefault();
        zoomIn();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        zoomOut();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        zoomToFit("width");
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === "Escape") {
        setShowSearch(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomIn, zoomOut, zoomToFit]);

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-2xl font-bold text-red-500 mb-4">
          No PDF URL provided
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Toolbar */}
      <div className="p-2 flex flex-wrap items-center justify-between gap-2 sticky top-0 z-50 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow">
        <div className="flex items-center gap-2 min-w-0">
          <ToolbarButton title="Go back" onClick={() => navigate(-1)}>
            ← Back
          </ToolbarButton>
          <span className="text-sm truncate max-w-xs" title={fileName || url}>
            {fileName || "PDF Document"}
          </span>
          {docTitle && (
            <span
              className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[16rem]"
              title={docTitle}
            >
              • {docTitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Page navigation */}
          {viewMode === "scroll" && (
            <div className="flex items-center gap-1">
              <div className="flex items-center mx-1">
                <input
                  type="number"
                  min={1}
                  max={numPages || 1}
                  value={visiblePage}
                  onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                  className="w-14 text-center border rounded p-1 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm mx-1">of {numPages || "--"}</span>
              </div>
            </div>
          )}

          {/* Zoom */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              title="Zoom out"
              onClick={zoomOut}
              disabled={scale <= 0.25}
            >
              <ZoomOut size={16} />
            </ToolbarButton>
            <span className="text-sm mx-1">{Math.round(scale * 100)}%</span>
            <ToolbarButton
              title="Zoom in"
              onClick={zoomIn}
              disabled={scale >= 4}
            >
              <ZoomIn size={16} />
            </ToolbarButton>
            <ToolbarButton
              title="Fit to width"
              onClick={() => zoomToFit("width")}
            >
              Fit Width
            </ToolbarButton>
          </div>

          {/* View mode */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              title="Scroll view"
              onClick={() => setViewMode("scroll")}
              active={viewMode === "scroll"}
            >
              <BookOpen size={16} />
            </ToolbarButton>
            <ToolbarButton
              title="Double page view"
              onClick={() => setViewMode("double")}
              active={viewMode === "double"}
            >
              <Columns size={16} />
            </ToolbarButton>
          </div>

          {/* Other controls */}
          <ToolbarButton title="Rotate" onClick={rotate}>
            <RotateCw size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Table of Contents"
            onClick={() => setShowOutline(!showOutline)}
            active={showOutline}
          >
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton
            title={isFullScreen ? "Exit fullscreen" : "Fullscreen"}
            onClick={toggleFullScreen}
          >
            {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          {showSearch ? (
            <form onSubmit={performSearch} className="flex items-center">
              <input
                id="search-input"
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search..."
                className="px-2 py-1 rounded-l text-sm w-32 focus:w-64 transition-all duration-300 dark:bg-gray-700 dark:border-gray-600"
                autoFocus
              />
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
                title="Search"
              >
                <Search size={16} />
              </button>
              <div className="ml-2 text-sm flex items-center">
                <button
                  type="button"
                  onClick={gotoPrevSearch}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={gotoNextSearch}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="p-2 ml-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X size={16} />
              </button>
            </form>
          ) : (
            <ToolbarButton
              title="Search (Ctrl+F)"
              onClick={() => setShowSearch(true)}
            >
              <Search size={16} />
            </ToolbarButton>
          )}

          <ToolbarButton
            title="Download"
            onClick={() => {
              const a = document.createElement("a");
              a.href = url;
              a.setAttribute("download", fileName || "document.pdf");
              document.body.appendChild(a);
              a.click();
              a.remove();
            }}
          >
            <Download size={16} />
          </ToolbarButton>
        </div>
      </div>

      {/* Main area */}
      <div ref={viewerRef} className="flex flex-1 overflow-hidden">
        {/* Outline */}
        {showOutline && (
          <div className="w-56 min-w-56 overflow-y-auto border-r bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="p-2 font-semibold border-b dark:border-gray-700">
              Table of Contents
            </div>
            <div className="p-2">
              {outline?.length ? (
                outline.map((item, idx) => (
                  <div
                    key={`outline_${idx}`}
                    onClick={() => {
                      goToPage(item.pageNumber);
                      setShowOutline(false);
                    }}
                    className="p-1 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 truncate"
                    title={item.title}
                  >
                    {item.title}
                  </div>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500">
                  No table of contents available
                </div>
              )}
            </div>
          </div>
        )}

        {/* PDF Viewer */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto p-4 flex flex-col items-center"
        >
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-600 dark:text-gray-300">
              <Loader2 className="animate-spin h-12 w-12" />
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
              loading={
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="animate-spin h-12 w-12" />
                  <p className="mt-4">Loading PDF document…</p>
                </div>
              }
              options={{
                cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
                cMapPacked: true,
              }}
            >
              {viewMode === "double" ? (
                <div className="flex flex-col items-center">
                  {Array.from(
                    { length: Math.ceil((numPages || 0) / 2) },
                    (_, i) => {
                      const leftPage = i * 2 + 1;
                      const rightPage = i * 2 + 2;
                      return (
                        <div key={`spread_${i}`} className="flex mb-4">
                          <div className="mr-2">
                            <Page
                              pageNumber={leftPage}
                              scale={scale}
                              rotate={rotation}
                              width={Math.min(pageMaxWidth / 2, 700)}
                              className="border border-gray-300 shadow-lg bg-white"
                            />
                          </div>
                          {rightPage <= (numPages || 0) && (
                            <div>
                              <Page
                                pageNumber={rightPage}
                                scale={scale}
                                rotate={rotation}
                                width={Math.min(pageMaxWidth / 2, 700)}
                                className="border border-gray-300 shadow-lg bg-white"
                              />
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                // Scroll view - render all pages in a vertical column
                <div className="flex flex-col items-center">
                  {Array.from({ length: numPages || 0 }, (_, i) => (
                    <div 
                      key={`page_${i + 1}`} 
                      id={`page-${i + 1}`}
                      className="mb-4"
                    >
                      <Page
                        pageNumber={i + 1}
                        scale={scale}
                        rotate={rotation}
                        width={pageMaxWidth}
                        renderTextLayer
                        renderAnnotationLayer
                        className="border border-gray-300 shadow-lg bg-white"
                      />
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
          {fileName && (
            <span
              className="truncate inline-block align-middle mr-2"
              title={fileName}
            >
              {fileName}
            </span>
          )}
        </div>
        <div>
          <span className="mr-2">
            Page {visiblePage} of {numPages || "--"}
          </span>
          <span>Zoom: {Math.round(scale * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
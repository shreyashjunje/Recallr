import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function PDFViewer() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const pdfUrl = state?.pdfUrl;
//   console.log("PDF URL:", cloudinaryUrl);

  useEffect(() => {
    if (!pdfUrl) navigate("/");
  }, [pdfUrl, navigate]);

  if (!pdfUrl) return null;

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        src={pdfUrl}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="PDF Viewer"
      />
    </div>
  );
}

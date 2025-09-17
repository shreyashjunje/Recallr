// import { useLocation, useNavigate } from "react-router-dom";
// import { useEffect } from "react";

// export default function PDFViewer() {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const pdfUrl = state?.pdfUrl;
// //   console.log("PDF URL:", cloudinaryUrl);

//   useEffect(() => {
//     if (!pdfUrl) navigate("/");
//   }, [pdfUrl, navigate]);

//   if (!pdfUrl) return null;

//   return (
//     <div style={{ height: "100vh", width: "100%" }}>
//       <iframe
//         src={pdfUrl}
//         width="100%"
//         height="100%"
//         style={{ border: "none" }}
//         title="PDF Viewer"
//       />
//     </div>
//   );
// }

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function PDFViewer() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const pdfUrl = state?.pdfUrl;

  // detect mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    if (!pdfUrl) {
      navigate("/");
      return;
    }

    // On mobile → open PDF in a new tab automatically
    if (isMobile) {
      window.open(pdfUrl, "_blank");
      navigate(-1); // go back after opening PDF
    }
  }, [pdfUrl, navigate, isMobile]);

  if (!pdfUrl || isMobile) return null;

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


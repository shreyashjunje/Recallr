const PdfReader = ({ pdfUrl }) => {
  console.log("PDF URL:", pdfUrl);
  return (
    <div className="w-full h-screen">
      <iframe
        src={pdfUrl}
        title="PDF Reader"
        type="application/pdf"
        width="100%"
        height="100%"
      ></iframe>
    </div>
  );
};

export default PdfReader;

// Usage: conditionally render it when read button is clicked

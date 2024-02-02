import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CSVLink } from "react-csv";
import PdfDocument from "./PdfDocument";

const PdfExport = ({ data }) => (
  <PDFDownloadLink
    document={<PdfDocument data={data} />}
    fileName="reports.pdf"
  >
    {({ loading }) => (loading ? "Loading document..." : "Download In PDF")}
  </PDFDownloadLink>
);

const CsvExport = () => (
  <CSVLink data={[["Content"]]} filename={"reports.csv"}>
    Download In CSV
  </CSVLink>
);

const DownloaderFactory = (type, props) => {
  switch (type) {
    case "pdf":
      return <PdfExport {...props} />;
    case "csv":
      return <CsvExport {...props} />;
    default:
      throw new Error("Invalid export type");
  }
};

export default DownloaderFactory;

import React, { useEffect, useState } from "react";
import DownloaderFactory from "./DownloaderFactory";
import { Select, MenuItem, Button, Typography } from "@mui/material";

export default function ReportDownloader({ resetState, onResetState }) {
  const [selectedFormat, setSelectedFormat] = useState("pdf");

  useEffect(() => {
    if (resetState) {
      onResetState();
    }
  }, [resetState]);

  const data = ["this is a page"];

  return (
    <div style={{ padding: "7vw" }}>
      <Typography variant="h4" gutterBottom>
        Download Reports
      </Typography>

      <div style={{ marginBottom: "20px" }}>
        <label>Select Format: </label>
        <Select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <MenuItem value="pdf">PDF</MenuItem>
          <MenuItem value="csv">CSV</MenuItem>
        </Select>
      </div>

      <div style={{ marginTop: "20px" }}>
        {selectedFormat === "pdf" && DownloaderFactory("pdf", { data })}
        {selectedFormat === "csv" && DownloaderFactory("csv", { data })}
      </div>
    </div>
  );
}

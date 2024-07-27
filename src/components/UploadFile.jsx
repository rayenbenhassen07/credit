"use client";
import React, { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    console.log(file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("File uploaded and data inserted successfully");
    } else {
      alert("Failed to upload file");
    }
  };

  return (
    <div>
      <h1>Upload Excel File</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

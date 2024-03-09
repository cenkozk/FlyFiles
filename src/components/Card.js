import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Cards from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import FileIcon from "@mui/icons-material/InsertDriveFile";

export default function Card(props) {
  const raleway = "'Raleway', sans-serif";
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    setDragging(false);
    props.onChangeEvent(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleFileChange = (e) => {
    props.onChangeEvent(e.target.files[0]);
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setDragging(false); // Reset dragging state when a file is selected
  };

  return (
    <div className="card-items flex items-row w-full">
      <div
        className={` bg-customBlue duration-150 h-25 w-full rounded-lg border-2 border-dashed border-zinc-700 flex items-center justify-center ${
          dragging ? "transform scale-105" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label htmlFor="file" className="cursor-pointer text-center p-4 md:p-8">
          {file ? (
            <p className="text-zinc-400 font-sans text-sm mx-auto">
              {file.name}
            </p>
          ) : (
            <p className="text-zinc-300 font-sans text-sm mx-auto">
              Upload your file here.
            </p>
          )}
        </label>
        <input
          id="file"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

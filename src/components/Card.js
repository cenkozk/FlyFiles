import React from "react";
import Box from "@mui/material/Box";
import Cards from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import FileIcon from "@mui/icons-material/InsertDriveFile";

export default function Card(props) {
  const raleway = "'Raleway', sans-serif";
  return (
    <div className="card-items">
      <Cards
        className="card"
        sx={{ display: "flex", maxWidth: "300px", width: "300px", maxHeight: "100px", height: "100px", borderRadius: "20px", boxShadow: "0px 4px 15px 3px rgba(0, 0, 0, 0.25)" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "auto auto auto" }}>
            <Typography sx={{ fontFamily: raleway, fontWeight: "800", color: "#3E3E3E", fontSize: "17px" }} component="div" variant="h1">
              Selected File
            </Typography>
            <Typography
              sx={{ fontFamily: raleway, fontStyle: "normal", fontWeight: "600", fontSize: "14px", letterSpacing: "0.25px", color: "#3E3E3E", maxWidth: "100px" }}
              component="div"
            >
              {props.fileName}
            </Typography>
          </CardContent>
        </Box>
        {!props.isEmpty && <FileIcon sx={{ width: 75, height: 75, padding: "12.5px", marginLeft: "auto", color: "#da665c" }} />}
        {props.isEmpty && <Box component="img" src="/no_file.svg" sx={{ width: 75, height: 75, marginLeft: "auto", padding: "12.5px" }} />}
      </Cards>
      <input type="file" style={{ display: "none" }} ref={props.refObj} onChange={props.onChangeEvent} />
      <Button
        onClick={props.onClickEvent}
        variant="contained"
        sx={{
          fontFamily: raleway,
          backgroundColor: "#E76D61",
          boxShadow: "0px 4px 15px 3px rgba(0, 0, 0, 0.25)",
          borderRadius: "30px",
          fontSize: "14px",
          width: "220px",
          height: "40px",
          fontWeight: "700",
          textTransform: "none",
          "&:hover": { backgroundColor: "#da665c", boxShadow: "0px 4px 15px 3px rgba(0, 0, 0, 0.25)" },
        }}
      >
        Select File
      </Button>
    </div>
  );
}

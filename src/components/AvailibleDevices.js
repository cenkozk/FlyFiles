import React from "react";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import SendIcon from "@mui/icons-material/Send";
import ComputerIcon from "@mui/icons-material/Computer";
import { Button, IconButton } from "@mui/material";

export default function AvailibleDevices(props) {
  const raleway = "'Raleway', sans-serif";

  var deviceName =
    props.deviceName == undefined ? "Undefined Device" : props.deviceName;

  return (
    <div className="flex gap-4 items-center justify-between h-14 w-full">
      {props.isMobile && (
        <PhoneIphoneIcon sx={{ color: "#da665c", width: 40, height: 40 }} />
      )}
      {!props.isMobile && (
        <ComputerIcon sx={{ color: "#da665c", width: 40, height: 40 }} />
      )}
      <h5 className="text-zinc-300 font-sans font-medium">{deviceName}</h5>
      <IconButton
        onClick={props.onClickEvent}
        disabled={!props.sendStatus}
        sx={{ ":disabled": { opacity: "50%" } }}
      >
        <SendIcon sx={{ color: "#da665c", width: 30, height: 30 }} />
      </IconButton>
    </div>
  );
}

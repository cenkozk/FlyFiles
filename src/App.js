import React, { useEffect, useState } from "react";
import "./App.css";
import { nanoid } from "nanoid";
import ServerSide from "./components/ServerSide";
import Navbar from "./components/Navbar";
import Card from "./components/Card";
import Footer from "./components/Footer";
import AvailibleDevices from "./components/AvailibleDevices";
import ReceivedFileDialog from "./components/ReceivedFileDialog";
import generateStupidName from "sillyname";

function App() {
  const mySillyName = React.useRef(generateStupidName());
  const [peers, setPeers] = React.useState([]);
  const ServerSideRef = React.useRef();
  const dialogRef = React.useRef();

  //Selecting file
  const [selectedFile, setSelectedFile] = React.useState([]);
  const [selectedFileName, setSelectedFileName] = React.useState("");
  const [receivedFiles, setReceivedFiles] = React.useState([]);
  var isEmpty = selectedFile.length === 0 ? true : false;

  const changeHandler = (file) => {
    setSelectedFile(file);
  };
  React.useEffect(() => {
    setSelectedFileName(
      isEmpty ? "Drag and drop or select a file." : selectedFile.name
    );
  }, [selectedFile]);

  ////////////
  function returnUsersFunc(arr) {
    setPeers(arr);
  }

  function onSendClick(sillyName) {
    var peer = peers.find((p) => p.sillyName === sillyName).peer;
    console.log(selectedFile);
    peer.send("1");
    ServerSideRef.current.handlePeerClick(peer);
  }

  function onClickSave() {
    ServerSideRef.current.handleClick();
  }

  function onFileReceive(file) {
    dialogRef.current.handleClickOpen(file);
    console.log("recieved a file");
  }
  var peersList = peers.map((p) => (
    <AvailibleDevices
      key={nanoid()}
      deviceName={p.sillyName}
      isMobile={p.isMobile}
      sendStatus={!isEmpty}
      onClickEvent={() => {
        onSendClick(p.sillyName);
      }}
    />
  ));

  return (
    <div className="flex items-center h-screen w-screen z-1 justify-center">
      <Navbar />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      ></div>
      <div className="flex flex-col items-center z-10 w-auto gap-6 justify-center">
        <ServerSide
          ref={ServerSideRef}
          mySillyName={mySillyName.current}
          returnUsers={returnUsersFunc}
          selectedFile={selectedFile}
          onFileReceive={onFileReceive}
        />

        <div className="flex flex-col items-center justify-center border-zinc-500 bg-customBlue p-3 rounded-lg w-full">
          <div className="p-3 rounded-lg ">
            <h2 className="text-zinc-300 text-xl font-sans font-medium">
              You're{" "}
              <span className="text-red-400 font-sans font-bold">
                {mySillyName.current}
              </span>
              {"  "}😎
            </h2>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center border-zinc-500 bg-customBlue p-6 rounded-lg w-full">
          <div className="flex items-center flex-col justify-center bg-customBlue">
            <h1 className="text-zinc-300 mb-6 font-sans font-semibold text-lg">
              Available Devices
            </h1>
            {peersList}
            {peersList.length === 0 ? <TypingDots /> : <div />}
          </div>
        </div>

        <Card
          fileType=""
          isEmpty={isEmpty}
          onChangeEvent={changeHandler}
          fileName={selectedFileName}
        />
      </div>

      <ReceivedFileDialog ref={dialogRef} onClickSave={onClickSave} />
    </div>
  );
}

export default App;

const TypingDots = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length < 3) {
          return prevDots + ".";
        } else {
          return ".";
        }
      });
    }, 500); // Adjust the interval as needed

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1 className="text-zinc-500 mb-6 font-sans font-medium text-lg py-2">
        Searching{dots}
      </h1>
    </div>
  );
};

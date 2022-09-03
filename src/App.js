import React from "react";
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
  const fileInput = React.useRef(null);
  const [selectedFile, setSelectedFile] = React.useState([]);
  const [selectedFileName, setSelectedFileName] = React.useState("");
  const [receivedFiles, setReceivedFiles] = React.useState([]);
  var isEmpty = selectedFile.length === 0 ? true : false;

  const selectFile = () => {
    fileInput.current.click();
  };
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  React.useEffect(() => {
    setSelectedFileName(isEmpty ? "Drag and drop or select a file." : selectedFile.name);
  }, [selectedFile]);

  ////////////
  function returnUsersFunc(arr) {
    setPeers(arr);
  }

  function onSendClick(sillyName) {
    var peer = peers.find((p) => p.sillyName === sillyName).peer;
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
    <div className="main">
      <Navbar />
      <div className="main--block">
        <ServerSide ref={ServerSideRef} mySillyName={mySillyName.current} returnUsers={returnUsersFunc} selectedFile={selectedFile} onFileReceive={onFileReceive} />
        <Card fileType="" isEmpty={isEmpty} refObj={fileInput} onClickEvent={selectFile} onChangeEvent={changeHandler} fileName={selectedFileName} />
        <div className="id-box">
          <h2 className="mySillyName">
            You're <span style={{ color: "#E76D61", fontWeight: 800 }}>{mySillyName.current}</span>😎
          </h2>
        </div>
        <h1 className="availible-header">•Available Devices</h1>
        {peersList}
        {peersList.length === 0 ? <img style={{ width: 250 }} className="empty-image" src="/empty.svg" /> : <div />}
      </div>
      <Footer />
      <ReceivedFileDialog ref={dialogRef} onClickSave={onClickSave} />
    </div>
  );
}

export default App;

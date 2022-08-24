import React from "react";
import "./App.css";
import io from "socket.io-client";
import SimplePeer from "simple-peer";
import SimplePeerFiles from "simple-peer-files";
import { nanoid } from "nanoid";

function App() {
  //eslint-disable-next-line
  const [peers, setPeers] = React.useState([]);
  const socketRef = React.useRef();
  const peersRef = React.useRef([]);
  const fileInput = React.useRef();
  const selectedFile = React.useRef();
  const downloadedFile = React.useRef();
  const spf = React.useRef(new SimplePeerFiles());

  React.useEffect(() => {
    socketRef.current = io.connect("ws://192.168.2.7:3161");

    socketRef.current.on("connect", function () {
      console.log("Successfully connected to the server!");
      socketRef.current.emit("join room");
    });

    //Create peers from server
    socketRef.current.on("all users", (users) => {
      var indexOfMe = users.indexOf(socketRef.current.id);
      users.splice(indexOfMe, 1);
      const peers = [];
      users.forEach((userID) => {
        const peer = createPeer(userID, socketRef.current.id);
        peersRef.current.push({
          peerID: userID,
          peer,
        });
        peers.push(peer);
      });
      setPeers(peers);
    });

    socketRef.current.on("user joined", (payload) => {
      const peer = addPeer(payload.signal, payload.callerID);
      peersRef.current.push({
        peerID: payload.callerID,
        peer,
      });
      setPeers((users) => [...users, peer]);
    });

    socketRef.current.on("receiving returned signal", (payload) => {
      const item = peersRef.current.find((p) => p.peerID === payload.signalSender);
      item.peer.signal(payload.signal);
    });

    socketRef.current.on("remove disconnected", (id) => {
      const item = peersRef.current.find((p) => p.peerID === id);
      var indexOfDisconnected = peersRef.current.indexOf(item);
      peersRef.current.splice(indexOfDisconnected, 1);
      setPeers((prevPeers) => prevPeers.splice(indexOfDisconnected, 1));
    });
  }, []);

  function createPeer(userToSignal, callerID) {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", { userToSignal, callerID, signal });
    });

    spf.current.receive(peer, "TEST").then((transfer) => {
      transfer.on("progress", (sentBytes) => {
        console.log(sentBytes);
        if (sentBytes === 100) {
          downloadedFile.current = new File([new Blob(transfer.fileData, { type: transfer.type })], transfer.fileName);
        }
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID) {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    spf.current.receive(peer, "TEST").then((transfer) => {
      transfer.on("progress", (sentBytes) => {
        console.log(sentBytes);
        if (sentBytes === 100) {
          downloadedFile.current = new File([new Blob(transfer.fileData, { type: transfer.type })], transfer.fileName);
        }
      });
    });

    peer.signal(incomingSignal);
    return peer;
  }

  function handleClick() {
    const element = document.createElement("a");
    const file = downloadedFile.current;
    element.href = URL.createObjectURL(file);
    element.download = file.name;
    document.body.appendChild(element);
    element.click();
  }

  function handlePeerClick(peer) {
    // peer is the SimplePeer object connection to receiver
    spf.current.send(peer.peer, "TEST", selectedFile.current).then((transfer) => {
      transfer.on("progress", (sentBytes) => {});
      transfer.start();
    });
  }

  const changeHandler = (event) => {
    selectedFile.current = event.target.files[0];
  };

  const selectFile = () => {
    fileInput.current.click();
  };

  var peersMap = [...peersRef.current];

  return (
    <div>
      <button onClick={handleClick}>Download!</button>
      <h1>Server</h1>
      <input type="file" style={{ display: "none" }} ref={fileInput} onChange={changeHandler} />
      <button onClick={selectFile}>UPLOAD!</button>
      {peersMap.map((peer) => (
        <button
          key={nanoid()}
          onClick={() => {
            handlePeerClick(peer);
          }}
        >
          {peer.peerID}
        </button>
      ))}
    </div>
  );
}

export default App;

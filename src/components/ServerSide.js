import React, { forwardRef, useImperativeHandle } from "react";
import io from "socket.io-client";
import SimplePeer from "simple-peer";
import SimplePeerFiles from "simple-peer-files";
import { isMobile } from "react-device-detect";
//eslint-disable-next-line
function ServerSide(props, ref) {
  const [peers, setPeers] = React.useState([]);
  const socketRef = React.useRef();
  const peersRef = React.useRef([]);
  var selectedFile = props.selectedFile;
  const downloadedFile = React.useRef();
  const spf = React.useRef(new SimplePeerFiles());

  var mySillyName = props.mySillyName;

  React.useEffect(() => {
    socketRef.current = io.connect("ws://192.168.2.7:3161");

    socketRef.current.on("connect", function () {
      console.log("Successfully connected to the server!");
      socketRef.current.emit("join room", { mySillyName, isMobile });
    });

    //Create peers from server
    socketRef.current.on("all users", (users) => {
      var myId = socketRef.current.id;
      var indexOfMe = users.indexOf({ myId, mySillyName, isMobile });
      users.splice(indexOfMe, 1);
      const peers = [];
      users.forEach((userID) => {
        const peer = createPeer(userID.socketId, socketRef.current.id, userID.sillyName);
        peersRef.current.push({
          peerID: userID.socketId,
          sillyName: userID.sillyName,
          isMobile: userID.isMobile,
          peer,
        });
        peers.push(peer);
      });
      setPeers(peers);
    });

    socketRef.current.on("user joined", (payload) => {
      const peer = addPeer(payload.signal, payload.callerID, payload.sillyName);
      peersRef.current.push({
        peerID: payload.callerID,
        sillyName: payload.sillyName,
        isMobile: payload.isMobile,
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
      socketRef.current.emit("sending signal", { userToSignal, callerID, signal, mySillyName, isMobile });
    });

    spf.current.receive(peer, "TEST").then((transfer) => {
      transfer.on("progress", (sentBytes) => {
        if (sentBytes === 100) {
          downloadedFile.current = new File([new Blob(transfer.fileData, { type: transfer.type })], transfer.fileName);
          props.onFileReceive(downloadedFile.current);
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
        if (sentBytes === 100) {
          downloadedFile.current = new File([new Blob(transfer.fileData, { type: transfer.type })], transfer.fileName);
          props.onFileReceive(downloadedFile.current);
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

  useImperativeHandle(ref, () => ({
    handlePeerClick(peer) {
      console.log(peer);
      // peer is the SimplePeer object connection to receiver
      spf.current.send(peer, "TEST", selectedFile).then((transfer) => {
        transfer.on("progress", (sentBytes) => {
          console.log(sentBytes);
        });
        transfer.start();
      });
    },
  }));

  React.useEffect(() => {
    var peersMap = [...peersRef.current];
    props.returnUsers(peersMap);
  }, [peers]);

  return <div></div>;
}

export default forwardRef(ServerSide);

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

var usersArr = [];

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  //Add user to array.
  const mySocketID = socket.id;
  usersArr.push({ socketId: mySocketID, sillyName: null });

  socket.on("join room", (payload) => {
    usersArr = usersArr.map((users) => (users.socketId === mySocketID ? { socketId: mySocketID, sillyName: payload.mySillyName, isMobile: payload.isMobile } : users));
    socket.emit("all users", usersArr);
    console.log(usersArr);
  });

  socket.on("sending signal", (payload) => {
    var callerID = payload.callerID;
    var signal = payload.signal;
    var sillyName = payload.mySillyName;
    var isMobile = payload.isMobile;
    socket.broadcast.to(payload.userToSignal).emit("user joined", { callerID, signal, sillyName, isMobile });
  });

  socket.on("returning signal", (payload) => {
    var callerID = payload.callerID;
    var signal = payload.signal;
    var signalSender = socket.id;
    socket.broadcast.to(callerID).emit("receiving returned signal", { callerID, signal, signalSender });
  });

  socket.on("msg", (msg) => {
    console.log(`Message from ${socket.id}: ${msg}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(socket.id, "left because", '"' + reason + '"');
    var index = usersArr.indexOf(socket.id);
    usersArr.splice(index, 1);
    console.log(usersArr);

    disconnectFromAll(socket.id);
  });
});

function disconnectFromAll(id) {
  io.emit("remove disconnected", id);
}

httpServer.listen(3161, console.log("listening *3161"));

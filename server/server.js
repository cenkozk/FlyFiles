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
  usersArr.push(socket.id);
  console.log(usersArr);

  //Greet
  socket.send(`Hello from server ${socket.id}`);

  socket.on("join room", () => {
    socket.emit("all users", usersArr);
  });

  socket.on("sending signal", (payload) => {
    var callerID = payload.callerID;
    var signal = payload.signal;
    socket.broadcast.to(payload.userToSignal).emit("user joined", { callerID, signal });
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

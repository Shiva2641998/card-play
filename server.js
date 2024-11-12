const { createServer } = require('http');  // Using require for CommonJS
const next = require('next');
const { Server } = require('socket.io');
const { parse } = require('url');

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev });
const handle = app.getRequestHandler();

const roomUsers = new Map();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(port, ()=>{
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? 'development' : process.env.NODE_ENV
      }`
    )
  }) 
  // createServer(handle);

  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log('Socket.IO client connected:', socket.id);

    socket.on('message', (message) => {
      console.log('Received message:', message);
      io.emit('message', message); // Broadcast message to all connected clients
    });

    socket.on('createRoom', (data) => {
      // Check if the room already exists in roomUsers Map, otherwise create it
      if (!roomUsers.has(data.id)) {
        roomUsers.set(data.id, []);
      }
      // Add the user to the room's user list
      roomUsers.get(data.id).push(data);
      
      socket.join(data.id);  // Use userId as the room
      console.log(`${socket.id} joined room ${data.id}`);
      
      const usersInRoom = roomUsers.get(data.id);
      // Emit the updated user list for the room
console.log(usersInRoom,"usersInRoom")
      if(usersInRoom?.length == 1){
        socket.emit('hostJoin');
      }else if(usersInRoom?.length == 2){
        let d = usersInRoom[0].card
        socket.emit('guestJoin', d);
      }else{
        socket.emit('guestJoin', d);
      }

      socket.emit('joinedRoom', data);
      // io.to(userId).emit('userList', roomUsers.get(userId));  // Send updated user list to all users in the room
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO client disconnected:', socket.id);
    });
  });

  // httpServer
  //   .once("error", (err) => {
  //     console.error(err);
  //     process.exit(1);
  //   })
  //   .listen(port, () => {
  //     console.log(
  //       `> Server listening at http://localhost:${port} as ${
  //         dev ? 'development' : process.env.NODE_ENV
  //       }`
  //     )
  //   });
});

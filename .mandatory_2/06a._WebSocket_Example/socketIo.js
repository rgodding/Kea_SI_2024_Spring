

export default function socketIo(io) {
    io.on('connection', (socket) => {
        
      console.log('A client connected', socket.id);

      socket.emit('id', socket.id);

      socket.on('sendMessage', (data) => {
        socket.to(data.receiver).emit('messageReceived', {
            message: data.message,
            sender: socket.id,
        });
        io.emit('message', 'Message Sent');
      });

      socket.on('messageRecieved', (data) => {
        console.log("msg recieved", data);
        console.log(data);
      });




      socket.on('disconnect', () => {
        console.log('A client disconnected', socket.id);
      });
    });


}

  
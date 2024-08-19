require('dotenv').config();
const express = require('express');
const app = express();
const DbConnect = require('./database')
const router = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const ACTIONS = require('./actions');
const { userInfo } = require('os');
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

app.use(cookieParser());

const corsOption = {
    credentials: true,
    origin :['http://localhost:3000'],
};

app.use(cors(corsOption));
app.use('/storage', express.static('storage'));

const PORT = 5500;
DbConnect();
app.use(express.json({ limit: '8mb' }));
app.use(router);

app.get('/', (req, res)=>{
    res.send('hi');
});

const socketUserMapping ={}

io.on('connection', (socket)=>{
    console.log('new connection', socket.id);

    socket.on(ACTIONS.JOIN, ({roomId, user})=>{
        socketUserMapping[socket.id] = user;
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach(clientId =>{
            io.to(clientId).emit(ACTIONS.ADD_PEER, {
                peerId : socket.id,
                createOffer: false,
                user
            });
            socket.emit(ACTIONS.ADD_PEER, {
                peerId: clientId,
                createOffer: true,
                user: socketUserMapping[clientId],
            });
        });
        socket.join(roomId);
    });
    
    // handel reyel ice
    socket.on(ACTIONS.RELAY_ICE, ({peerId, icecondidate}) =>{
        io.to(peerId).emit(ACTIONS.RELAY_ICE, {
            peerId: socket.id,
            icecondidate,
        });
    });

    socket.on(ACTIONS.RELAY_SDP, ({peerId, sessionDescription}) =>{
        io.to(peerId).emit(ACTIONS.RELAY_SDP, {
            peerId: socket.id,
            sessionDescription,
        });
    });

    // leaving the room
    const leaveRoom = () =>{
        const {rooms} = socket;

        Array.from(rooms).forEach(roomId =>{
            const clients = Array.from(
                io.sockets.adapter.rooms.get(roomId) || []
            )
            clients.forEach(clientId =>{
                io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                    peerId: socket.id,
                    userId: socketUserMapping[socket.id]?.id,
                });

                socket.emit(ACTIONS.REMOVE_PEER, {
                    peerId: clientId,
                    userId: socketUserMapping[clientId]?.id,
                })
            });
            socket.leave(roomId);
        });
        delete socketUserMapping[socket.id];
    };
    socket.on(ACTIONS.LEAVE, leaveRoom);
    socket.on('disconnecting', leaveRoom);
});

server.listen(PORT, ()=> console.log(`listening on port ${PORT}`));
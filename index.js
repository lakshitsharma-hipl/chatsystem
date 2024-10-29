var createError = require('http-errors');
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
const http = require('http');
const { Server } = require('socket.io');

var indexRouter = require('./routes/index');
const models = require("./models");
// const fetch = require('node-fetch');
var app = express();
const server = http.createServer(app);
const io = new Server(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/front-layout');

// app.use(express.urlencoded({ limit: '100mb', extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


app.get('/search-gif', async (req, res) => {
    const query = req.query.q || 'funny';
    const tenorApiKey = 'AIzaSyCqYVKX1Mi3iZwHSP7w0knNBpnhcnap0qQ';
    
    const fetch = (await import('node-fetch')).default;
    try {
        const response = await fetch(`https://tenor.googleapis.com/v2/search?q=${query}&key=${tenorApiKey}&limit=5`);
        const data = await response.json();
        res.json(data.results);
    } catch (error) {
        console.error('Error fetching GIFs:', error);
        res.status(500).json({ error: 'Failed to fetch GIFs' });
    }
});

var Sequelize = require('sequelize');
app.locals.sequelize = new Sequelize('chat_system', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Handle socket connections
io.on('connection', async (socket) => {
    //console.log('A user connected:', socket.id);

    // const previousMessages = await models.chat.findAll({ raw: true });
    // socket.emit('previousMessages', previousMessages);

    // Join a room
    socket.on('joinRoom', (roomName) => {
        socket.join(roomName);
        //console.log(`User ${socket.id} joined room ${roomName}`);

        socket.to(roomName).emit('joinmessage', {user_sid: socket.id, roomName: roomName});
    });

    // Handle messages
    socket.on('chatMessage', async ({ roomName, msg }) => {
        msg.socketID = socket.id;
        io.to(roomName).emit('message', msg);

        // Save msg in the database
        await models.chat.create({
            user_id: msg.user_id,
            recipient_id: msg.recipient_id,
            message: msg.message
        });
    });

    // Broadcast a message to everyone except the sender
    socket.on('chat message', async (msg) => {
        io.emit('chat message', msg);
        // Save msg in the database
        await models.chat.create({
            user_id: msg.user_id,
            recipient_id: msg.recipient_id,
            message: msg.message
        });
    });
	
	socket.on('adminMessageReceived', async ({ roomName, msg }) => {
        io.to(roomName).emit('adminNotification', msg);
    })

    // Disconnect event
    socket.on('disconnect', () => {
        //console.log('User disconnected:', socket.id);
    });
});

// Listen on the appropriate port for your server
const PORT = process.env.PORT || 5159;
server.listen(PORT, () => {
    console.log(`Server is running on http://192.168.1.46:${PORT}`);    
});

module.exports = app;
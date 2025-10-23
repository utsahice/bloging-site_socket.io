const http = require('http')
const { Server } = require('socket.io')
const app = require('./app')

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

const comments = []

app.post('/comments', (req, res) => {
  const { author, content } = req.body
  if (!author || !content) {
    return res.status(400).json({ message: 'Author and content required' })
  }

  const comment = { id: Date.now(), author, content }
  comments.push(comment)

  io.emit('newComment', comment)

  res.status(201).json(comment)
})

io.on('connection', (socket) => {
  console.log('User connected')
  socket.emit('allComments', comments)
  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000')
})

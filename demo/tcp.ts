import { connect } from 'net'
import { spawn } from 'child_process'

const port = 9999
const subprocess = spawn('nc', ['-lk','::', port + ''], {
  stdio: [
    0, // Use parent's stdin for child.
    'inherit', // Pipe child's stdout to parent.
    'inherit',
  ],
});
const socket = connect(port, 'localhost', () => {
  console.log(`socket connected to localhost:${port}`)
})
socket.setKeepAlive(true)

let i = 0
setInterval(() => {
  // socket.write(`${i++}\r`)
}, 1000)

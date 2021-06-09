import * as grpc from 'grpc'
import { loadSync } from '@grpc/proto-loader'

const packageDefinition = loadSync('./helloworld.proto', { defaults: true })
const proto = grpc.loadPackageDefinition(packageDefinition)

const server = new grpc.Server({
  // keepalive
  'grpc.http2.min_ping_interval_without_data_ms': 5000, // grpc default
  'grpc.keepalive_permit_without_calls': 1,
  // connection survival
  'grpc.max_connection_idle_ms': 1 * 60000000,
  'grpc.max_connection_age_ms': 1000000,
})

server.addService(proto.helloworld['Greeter'].service, {
  sayHello(req, cb) {
    console.log('server receive request', req.request)
    setTimeout(() => {
      cb(null, {
        message: `server reply: ${req.request.message}`,
      })
    }, 1000)
  },
})
server.bind('0.0.0.0:9998', grpc.ServerCredentials.createInsecure())
server.start()

const client = new proto.helloworld['Greeter']('localhost:9998', grpc.credentials.createInsecure(), {
  // keepalive
  'grpc.http2.max_pings_without_data': 0,
  'grpc.http2.min_time_between_pings_ms': 5000,
  'grpc.keepalive_time_ms': 5000,
  'grpc.keepalive_timeout_ms': 5000,
  'grpc.keepalive_permit_without_calls': 1,

})
const clientSend = () => {
  console.log(`connect to server localhost:9998`)
  client.sayHello({ message: Date.now() }, {},
    (err, resp) => {
      if (err) {
        console.error(err)
      } else {
        console.log('server response: ', new Date(), resp)
      }
    },)
}
clientSend()
process.stdin.on('data', () => {
 clientSend()
})

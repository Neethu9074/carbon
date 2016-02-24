import {createLogger} from 'instalog';
import io from 'socket.io-client';

const logger = createLogger('in-services.persistentConnection');

let transports = ['polling', 'websocket'];

// We only want to use the WebSocket transport during local dev mode as this
// makes the development life easier: Only one connection needs to be inspected!
if (__DEV__) {
  transports = ['websocket'];
}

let socket;

export function init() {
  window.instana.dev.socket = socket = io(window.location.origin, {
    path: '/api/data',
    transports
  });

  enableEventLogging(socket);
}

export function emit(event, payload) {
  socket.emit(event, payload);
}

export function on(event, callback) {
  socket.on(event, callback);
}

export function off(event, callback) {
  socket.off(event, callback);
}

function enableEventLogging(socketIoClient) {
  socketIoClient.on('connect', () => logger.info('Establishing persistent connection'));
  socketIoClient.on('disconnect', () => logger.info('Persistent connection closed'));
  socketIoClient.on('error', error => {
    logger.info('Retrieved error for persistent connection', error);
  });
  socketIoClient.on('reconnect_error', error => {
    logger.info('Failed to reconnect', error);
  });
}

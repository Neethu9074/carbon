import io from 'socket.io-client';
import {createLogger} from 'instalog';

const logger = createLogger('in-services.connection');

let socket;

export function initialize() {
  socket = io(window.location.origin, {
    path: '/data'
  });

  enableCatchAllSupport(socket);
  enableEventLogging(socket);
}

export function emit(event, data) {
  socket.emit(event, data);
}

// Enable catch all messages (except conect, disconnect etc.) via
//   socket.on('*', ...)
// TODO: Consider contributing this upstream to socket.io
function enableCatchAllSupport(socketIoClient) {
  const originalOnevent = socketIoClient.onevent;
  socketIoClient.onevent = function onevent(packet) {
    // original call
    const args = packet.data || [];
    originalOnevent.call(this, packet);

    // additional call to catch-all
    packet.data = ['*'].concat(args);
    originalOnevent.call(this, packet);
  };
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

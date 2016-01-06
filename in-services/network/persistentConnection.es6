import io from 'socket.io-client';
import {createLogger} from 'instalog';

const logger = createLogger('in-services.connection');


export function initialize() {
  const socket = io(window.location.origin, {
    path: '/data'
  });

  socket.on('connect', () => logger.info('Establishing persistent connection'));
  socket.on('disconnect', () => logger.info('Persistent connection closed'));
  socket.on('error', error => {
    logger.info('Retrieved error for persistent connection', error);
  });
  socket.on('reconnect_error', error => {
    logger.info('Failed to reconnect', error);
  });

  // body...
}

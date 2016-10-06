import io from 'socket.io-client';

import {isSafari} from 'in-services/browser';

let transports = ['polling', 'websocket'];

// We only want to use the WebSocket transport during local dev mode as this
// makes the development life easier: Only one connection needs to be inspected!
if (__DEV__) {
  // Safari does not support websocket connections with invalid SSL certs
  if (isSafari()) {
    transports = ['polling'];
  } else {
    transports = ['websocket'];
  }

  window.instana.retrievedMessageCount = 0;
}

let socket;

export function init() {
  window.instana.dev.socket = socket = io(window.location.origin, {
    path: '/api/data',
    transports
  });
}

export function emit(event, payload) {
  socket.emit(event, payload);
}

export function on(event, callback) {
  if (__DEV__) {
    socket.on(event, arg => {
      window.instana.retrievedMessageCount++;
      callback(arg);
    });
  } else {
    socket.on(event, callback);
  }
}

export function off(event, callback) {
  socket.off(event, callback);
}

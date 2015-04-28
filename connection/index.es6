'use strict';

import RxEmitter from 'rxemitter';

// taken from the spec
const readyState = {
  connecting: 0,
  open: 1,
  closing: 2,
  closed: 3
};

// we are emitting the following events:
// connecting: When we are tryting to establish a connection
// connected: When a connection was successfully established
// closed: When the connection was closed
// error: When an error occurred
// message: When a message was retrieved
export const emitter = new RxEmitter();

// this is the URL to which a WebSocket connection can be established. It takes
// HTTP and HTTPS into account.
const endpoint = buildEndpointUrl(window.location);

// messages may be send before the connection is successfully established or
// after we got disconnected.
let queuedMessages = [];

let connection;

connect();

function connect() {
  // If there is a previous connection, we make sure that we are always closing
  // it.
  if (connection && connection.readyState <= readyState.open) {
    connection.close();
  }

  emitter.emit('connecting');

  connection = new window.WebSocket(endpoint);
  connection.onopen = onOpen;
  connection.onclose = onClose;
  connection.onerror = onError;
  connection.onmessage = onMessage;
}


function onOpen() {
  emitter.emit('connected');

  // yeah, we managed to connect. Send all queued messages out!
  queuedMessages.forEach(send);
  queuedMessages = [];
}


function onClose() {
  emitter.emit('closed');
  // try to reconnect in 1s
  setTimeout(connect, 1000);
}


function onMessage(msg) {
  let data;
  try {
    data = JSON.parse(msg);
  } catch (e) {
    return emitter.emit('error', new Error('Failed to parse message ' + msg));
  }
  emitter.emit('message', data);
}


function onError(error) {
  emitter.emit('error', error);

  if (connection.readyState > readyState.open) {
    connect();
  }
}

export function send(msg) {
  // the WebSocket API does not queue messages but instead will fail when we try
  // to send messages before the connection is successfully established, i.e.
  // opened.
  if (connection.readyState !== readyState.open) {
    return queuedMessages.push(msg);
  }

  connection.send(JSON.stringify(msg));
}

function buildEndpointUrl(location) {
  return location.origin.replace(/^http/, 'ws') + '/api/data';
}

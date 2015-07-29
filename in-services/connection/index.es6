'use strict';

import RoEmitter from 'roemitter';
import {createLogger} from 'instalog';

// We want to reduce the overhead of channels on the network. Example: A metric
// subscription would need to include the hostId, pluginId, steadyId, metric
// name and possibly other pieces of information in order to route messages.
// This is way too much overhead. We want to route messages based on a single
// numeric value. This is what these IDs are for. We include a single ID in
// server responses to reduce the overhead.
let idCounter = 0;

const logger = createLogger('in-services.connection');

// how often the server should be pinged
const pingInterval = 5000;

// after how much time should we assume that the connection is broken?
const pingTimeout = 10000;

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
export const emitter = new RoEmitter('WebSocket Connection');

// this is the URL to which a WebSocket connection can be established. It takes
// HTTP and HTTPS into account.
const endpoint = buildEndpointUrl(window.location);

// messages may be send before the connection is successfully established or
// after we got disconnected.
let queuedMessages = [];

// the last established WebSocket connection
let connection;

// the ping timeout handle
let pingTimeoutHandle;

connect();


function connect() {
  logger.debug('Attempting to connect to WebSocket URL', endpoint);

  // If there is a previous connection, we make sure that we are always closing
  // it.
  if (connection && connection.readyState <= readyState.open) {
    if (connection.readyState === readyState.open) {
      // multiple connects? Whoops, short circuit this one.
      logger.debug(
        'We are trying to reconnect while out current connection is open. ',
        'This should not happen. Ready State:',
        connection.readyState
      );
      return;
    }

    logger.debug(
      'Closing existing WebSocket connection in ready State',
      connection.readyState
    );
    connection.close();
  }

  emitter.emit('connecting');
  connection = window.connection = new window.WebSocket(endpoint);
  connection.onopen = onOpen;
  connection.onclose = onClose;
  connection.onerror = onError;
  connection.onmessage = onMessage;
}


function onOpen() {
  logger.debug('WebSocket connection successfully established');
  emitter.emit('connected');

  // yeah, we managed to connect. Send all queued messages out!
  queuedMessages.forEach(send);
  queuedMessages = [];

  pingTimeoutHandle = setTimeout(ping, pingInterval);
}


function ping() {
  connection.send('ping');
  pingTimeoutHandle = setTimeout(() => {
    logger.debug('Pong was not received in time. Attempting reconnect.');
    // if this ever gets called, then the pong message was not received in
    // time and we just try to reconnect.
    try {
      if (connection) connection.close();
    } catch (_) {
      // any errors can be safely ignored since the connection is broken
      // anyway
    }
    onClose();
  }, pingTimeout);
}


function onClose() {
  logger.debug('WebSocket connection was closed.');
  emitter.emit('closed');
  if (pingTimeoutHandle) {
    clearTimeout(pingTimeoutHandle);
    pingTimeoutHandle = null;
  }
  tryToReconnect();
}


function tryToReconnect() {
  logger.debug('Attempting reconnect.');
  // try to reconnect in 1s
  setTimeout(connect, 1000);
}


function onMessage(msg) {
  if (msg.data === 'pong') {
    if (pingTimeoutHandle) {
      clearTimeout(pingTimeoutHandle);
      pingTimeoutHandle = null;
    }
    pingTimeoutHandle = setTimeout(ping, pingInterval);
    return;
  }

  let data;
  try {
    data = JSON.parse(msg.data);
  } catch (e) {
    emitter.emit('error', new Error('Failed to parse message ' + msg));
    return;
  }
  emitter.emit('message', data);
}


function onError(error) {
  logger.error('Retrieved error for WebSocket connection', error);
  emitter.emit('error', error);
}


export function send(msg) {
  // the WebSocket API does not queue messages but instead will fail when we try
  // to send messages before the connection is successfully established, i.e.
  // opened.
  if (!isOpen()) {
    return queuedMessages.push(msg);
  }

  connection.send(JSON.stringify(msg));
}


export function isOpen() {
  return connection.readyState === readyState.open;
}

export function getNewMessageId() {
  return idCounter++;
}

function buildEndpointUrl(location) {
  return location.origin.replace(/^http/, 'ws') + '/api/data';
}

import io from 'socket.io-client';
import React from 'react';

import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { isSafari } from 'in-services/browser';

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
    transports,
    requestTimeout: 60000
  });

  on('connect', onConnect);
  on('connect_error', onConnectError);
  on('connect_timeout', onConnectTimeout);
  on('error', onConnectError);
  on('reconnect_error', onConnectError);
  on('disconnect', onConnectError);
  on('reconnect_failed', onConnectError);
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

function onConnect() {
  removeMessage('connection_status');
}

function onConnectTimeout() {
  addMessage(
    {
      type: 'warning',
      icon: 'danger_sign',
      content: (
        <p>
          <strong>Connection timed out</strong>
          <br />
          The connection to the backend has timed out.
        </p>
      )
    },
    'connection_status'
  );
}

function onConnectError() {
  addMessage(
    {
      type: 'warning',
      icon: 'danger_sign',
      content: (
        <p>
          <strong>Connection lost</strong>
          <br />
          The backend is not reachable at the moment.
        </p>
      )
    },
    'connection_status'
  );
}

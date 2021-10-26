/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { ineum } from 'in-services/tracking/ineum/ineum';

export function init() {
  if (!window.WebSocket) {
    return;
  }

  const OriginalWebSocket = window.WebSocket;
  window.WebSocket = function InstrumentedWebSocket(...args) {
    const instance = new OriginalWebSocket(...args);

    ineum('reportEvent', 'connection.websocket.init', {
      meta: {
        url: instance.url
      }
    });

    instance.addEventListener('open', () => {
      ineum('reportEvent', 'connection.websocket.open', {
        meta: {
          url: instance.url
        }
      });
    });

    instance.addEventListener('close', () => {
      ineum('reportEvent', 'connection.websocket.close', {
        meta: {
          url: instance.url
        }
      });
    });

    return instance;
  };
  window.WebSocket.prototype = OriginalWebSocket.prototype;
  window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
  window.WebSocket.OPEN = OriginalWebSocket.OPEN;
  window.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
  window.WebSocket.CLOSED = OriginalWebSocket.CLOSED;
}

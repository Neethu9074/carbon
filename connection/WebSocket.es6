'use strict';

// the sole purpose of this file is to enable testing via proyquire of the
// connection module. This makes it easy to mock WebSocket connections.

const WebSocket = window.WebSocket;
export default WebSocket;

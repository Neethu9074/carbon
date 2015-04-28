/*eslint-env mocha,node*/

'use strict';

import proxyquire from 'proxyquire';
import sinon from 'sinon';
import {expect} from 'chai';

describe('connection', () => {

  let WebSocket;
  let connection;

  let emitter;
  let send;

  beforeEach(() => {
    connection = {
      send: sinon.stub(),
      close: sinon.stub()
    };

    WebSocket = sinon.stub();
    WebSocket.onFirstCall().returns(connection);

    global.window = {
      WebSocket: WebSocket,
      location: {
        origin: 'http://demo.internal.instana.io'
      }
    };
  });

  it('should request the correct URL', () => {
    doStubbedImport();

    const wsUrl = 'ws://demo.internal.instana.io/api/data';
    expect(WebSocket.getCall(0).args[0]).to.equal(wsUrl);
  });

  it('should respect secure transports', () => {
    global.window.location.origin = 'https://example.com';
    doStubbedImport();
    expect(WebSocket.getCall(0).args[0]).to.equal('wss://example.com/api/data');
  });

  function doStubbedImport() {
    const module = proxyquire('./index', {});
    emitter = module.emitter;
    send = module.send;
  }
});

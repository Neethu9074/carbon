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

  it('should emit connected events', (done) => {
    doStubbedImport();
    emitter.on('connected').subscribe(done);
    open();
  });

  it('should send messages as JSON', () => {
    doStubbedImport();
    open();
    send({
      yes: true
    });
    expect(connection.send.getCall(0).args[0]).to.equal('{"yes":true}');
  });

  it('should not send messages before the connection is established', () => {
    doStubbedImport();
    send({
      yes: true
    });
    expect(connection.send.callCount).to.equal(0);
  });

  it('should send queued messages once the connection is established', () => {
    doStubbedImport();
    send({
      yes: true
    });
    open();
    expect(connection.send.getCall(0).args[0]).to.equal('{"yes":true}');
  });

  function doStubbedImport() {
    const module = proxyquire('./index', {});
    emitter = module.emitter;
    send = module.send;
  }

  function open() {
    connection.readyState = 1;
    connection.onopen();
  }
});

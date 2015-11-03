/* eslint-env mocha,node*/
/* eslint-disable max-len*/
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import {expect} from 'chai';

import jsdom from 'in-test/jsdom';

describe('connection.connection', () => {

  let WebSocket;
  let connection;

  let emitter;
  let send;

  let clock;

  jsdom();

  beforeEach(() => {
    connection = {
      send: sinon.stub(),
      close: sinon.stub()
    };

    WebSocket = sinon.stub();
    WebSocket.returns(connection);

    global.window = {
      WebSocket: WebSocket,
      location: {
        origin: 'http://demo.internal.instana.io'
      }
    };

    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
    emitter = null;
    send = null;
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

  it('should emit message events', () => {
    doStubbedImport();
    const onMessage = sinon.stub();
    emitter.on('message').subscribe(onMessage);

    open();
    connection.onmessage({data: '{"yes":true}'});
    expect(onMessage.getCall(0).args[0]).to.deep.equal({yes: true});
  });

  it('should ping the server every 5 seconds', () => {
    doStubbedImport();
    clock.tick(5000);
    open();
    clock.tick(1000);
    expect(connection.send.called).to.equal(false);

    clock.tick(4000);
    expect(connection.send.calledOnce).to.equal(true);
    expect(connection.send.getCall(0).args[0]).to.equal('ping');
  });

  it('should assume the connection is broken after 10000 seconds without pong response', () => {
    const onClose = sinon.stub();
    doStubbedImport();
    emitter.on('closed').subscribe(onClose);

    // open the connection and send the ping msg
    open();
    clock.tick(5000);

    // force the ping timeout to be invoked
    clock.tick(10000);
    expect(onClose.calledOnce).to.equal(true);
    connection.readyState = 3;

    // it tries to reconnect after 1s. Expect a new WS connection to be
    // established
    clock.tick(1000);
    expect(WebSocket.callCount).to.equal(2);
  });

  function doStubbedImport() {
    const module = proxyquire('./connection', {});
    emitter = module.emitter;
    send = module.send;
  }

  function open() {
    connection.readyState = 1;
    connection.onopen();
  }
});

/*eslint-env mocha,node*/
/*eslint max-len:[2, 120] */
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import {expect} from 'chai';

describe('connection.subscriptionAwareConnection', () => {

  let WebSocket;
  let webSocketConnection;

  let sac;

  beforeEach(() => {
    webSocketConnection = {
      send: sinon.stub(),
      close: sinon.stub()
    };

    WebSocket = sinon.stub();
    WebSocket.onFirstCall().returns(webSocketConnection);

    global.window = {
      WebSocket: WebSocket,
      location: {
        origin: 'http://demo.internal.instana.io'
      }
    };

    const connection = proxyquire('./connection', {});
    sac = proxyquire('./subscriptionAwareConnection', {
      './connection': connection
    });
  });

  it('should forward send calls to WS connection', () => {
    open();
    sac.send({foo: 'bar'});
    expect(webSocketConnection.send.callCount).to.equal(1);
  });

  it('should queue send calls until connection is opened', () => {
    sac.send({foo: 'bar'});
    expect(webSocketConnection.send.callCount).to.equal(0);
    open();
    expect(webSocketConnection.send.callCount).to.equal(1);
  });

  it('should send subscriptions', () => {
    sac.subscribe(42, {
      id: 42,
      event: 'subscribe',
      type: 'snapshot',
      pluginId: 'com.instana.forge.hardware.virtual.EC2'
    });
    open();
    expect(webSocketConnection.send.callCount).to.equal(1);
    expect(webSocketConnection.send.getCall(0).args[0]).to.equal(JSON.stringify({
      id: 42,
      event: 'subscribe',
      type: 'snapshot',
      pluginId: 'com.instana.forge.hardware.virtual.EC2'
    }));
  });

  it('should not perimt multiple subscriptions with the same ID', () => {
    sac.subscribe('snapshot:yo', {});
    expect(() => sac.subscribe('snapshot:yo', {})).to.throw(Error);
  });

  it('should resend subscriptions on reconnect', () => {
    sac.subscribe('snapshot:yo', {foo: 'bar'});

    // when opening the connection, the pending subscription will be send to the
    // server.
    open();
    expect(webSocketConnection.send.callCount).to.equal(1);

    // close the connection. The subscription should not yet be resend.
    close();
    expect(webSocketConnection.send.callCount).to.equal(1);

    // once the connection was reestablished, the subscription should be resend.
    open();
    expect(webSocketConnection.send.callCount).to.equal(2);
    expect(JSON.parse(webSocketConnection.send.getCall(1).args[0]))
      .to
      .deep
      .equal({
        id: 'snapshot:yo',
        event: 'subscribe',
        foo: 'bar'
      });
  });

  it('should send unsubscribe notices', () => {
    open();
    sac.subscribe('snapshot:yo', {foo: 'bar'});

    sac.unsubscribe('snapshot:yo');
    expect(webSocketConnection.send.callCount).to.equal(2);
    expect(webSocketConnection.send.getCall(1).args[0]).to.equal(JSON.stringify({
      id: 'snapshot:yo',
      event: 'unsubscribe'
    }));
  });

  it('should not resubscribe after reconnect once unsubscribed', () => {
    open();
    sac.subscribe('snapshot:yo', {foo: 'bar'});
    close();
    sac.unsubscribe('snapshot:yo');
    open();
    expect(webSocketConnection.send.callCount).to.equal(2);
    expect(webSocketConnection.send.getCall(1).args[0]).to.equal(JSON.stringify({
      id: 'snapshot:yo',
      event: 'unsubscribe'
    }));
  });

  function open() {
    webSocketConnection.readyState = 1;
    webSocketConnection.onopen();
  }

  function close() {
    webSocketConnection.readyState = 3;
    webSocketConnection.onclose();
  }
});

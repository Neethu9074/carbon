/* eslint-env mocha*/
/*eslint max-len:[2, 120] */
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';
import RoEmitter from 'roemitter';
import Immutable from 'immutable';

import 'in-forge';

const ec2 = 'com.instana.forge.hardware.virtual.EC2';

describe('conveyer.MetricWithHistoryConveyer', () => {

  let MetricWithHistoryConveyer;
  let conveyer;
  let onNext;
  let connection;

  beforeEach(() => {
    onNext = sinon.stub();

    connection = {
      emitter: new RoEmitter(),
      send: sinon.stub(),
      subscribe: sinon.stub(),
      unsubscribe: sinon.stub(),
      __esModule: true
    };

    MetricWithHistoryConveyer = proxyquire('./MetricWithHistoryConveyer', {
      '../connection/subscriptionAwareConnection': connection
    });
  });

  it('should calculate unique id', () => {
    expect(MetricWithHistoryConveyer.getUniqueId(getSubscribeParams()))
      .to.be.a('string');
  });

  it('should subscribe via WebSocket connection', () => {
    const pluginId = ec2;
    const steadyId = 's42';
    const hostId = 'h42';
    const timeframe = 60;
    const metric = 'cpu.sys';

    conveyer = new MetricWithHistoryConveyer({
      snapshot: Immutable.fromJS({
        pluginId,
        hostId,
        steadyId
      }),
      timeframe,
      metric
    });
    conveyer.start(onNext);
    expect(connection.subscribe.calledOnce).to.equal(true);
    expect(connection.subscribe.getCall(0).args[0]).to.equal(conveyer.id);
    expect(connection.subscribe.getCall(0).args[1]).to.deep.equal({
      id: conveyer.id,
      event: 'subscribe',
      type: 'metric',
      pluginId,
      steadyId,
      hostId,
      timeframe,
      metric
    });
  });

  it('should emit metric values', () => {
    conveyer = new MetricWithHistoryConveyer(getSubscribeParams());
    conveyer.start(onNext);
    expect(onNext.callCount).to.equal(0);

    const data = [[1, 0.5], [2, 0.6], [3, 0.7]];
    emitData({
      id: conveyer.id,
      data
    });
    expect(onNext.callCount).to.equal(1);
    const event = onNext.getCall(0).args[0];
    expect(event.values).to.deep.equal(data);
  });

  it('should aggregate incoming metric values', () => {
    conveyer = new MetricWithHistoryConveyer(getSubscribeParams());
    conveyer.start(onNext);
    expect(onNext.callCount).to.equal(0);

    const data = [[1, 0.5], [2, 0.6], [3, 0.7]];
    const dataUpdate = [[4, 0.8]];
    emitData({
      id: conveyer.id,
      data
    });
    emitData({
      id: conveyer.id,
      data: dataUpdate
    });

    expect(onNext.callCount).to.equal(2);
    const event = onNext.getCall(1).args[0];
    expect(event.values).to.deep.equal(data.concat(dataUpdate));
  });

  it('should remove old data points', () => {
    conveyer = new MetricWithHistoryConveyer(getSubscribeParams());
    conveyer.start(onNext);
    expect(onNext.callCount).to.equal(0);

    const data = [[1, 0.5], [2, 0.6], [3, 0.7]];
    emitData({
      id: conveyer.id,
      data
    });
    emitData({
      id: conveyer.id,
      data: [[11, 0.9]]
    });

    expect(onNext.callCount).to.equal(2);
    const event1 = onNext.getCall(1).args[0];
    expect(event1.values.length).to.equal(3);

    emitData({
      id: conveyer.id,
      data: [[15, 0.3]]
    });
    expect(onNext.callCount).to.equal(3);
    const event2 = onNext.getCall(2).args[0];
    expect(event2.values.length).to.equal(2);
    expect(event2.values[0][0]).to.equal(11);
    expect(event2.values[1][0]).to.equal(15);
  });

  it('should remove duplicate data points', () => {
    conveyer = new MetricWithHistoryConveyer(getSubscribeParams());
    conveyer.start(onNext);

    const data = [[1, 0.5], [2, 0.6], [3, 0.7], [2, 0.6]];
    emitData({
      id: conveyer.id,
      data
    });

    expect(onNext.callCount).to.equal(1);
    const event = onNext.getCall(0).args[0];
    expect(event.values.length).to.equal(3);
  });

  function getSubscribeParams() {
    const pluginId = ec2;
    const steadyId = 's42';
    const hostId = 'h42';
    const timeframe = 10;
    const metric = 'cpu.sys';

    return {
      snapshot: Immutable.fromJS({
        pluginId,
        hostId,
        steadyId
      }),
      timeframe,
      metric
    };
  }

  function emitData(msg) {
    connection.emitter.emit('message', msg);
  }
});

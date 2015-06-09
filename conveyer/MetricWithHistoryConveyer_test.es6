/* eslint-env mocha*/
/*eslint max-len:[2, 120] */

'use strict';

import 'instana-ui-forge';

import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';
import RoEmitter from 'roemitter';
import Immutable from 'immutable';

const ec2 = 'com.instana.forge.infrastructure.virtualization.EC2';

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
    const since = new Date().getTime();
    const metric = 'cpu.total.sys';

    conveyer = new MetricWithHistoryConveyer({
      snapshot: Immutable.fromJS({
        pluginId,
        hostId,
        steadyId
      }),
      since,
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
      since, metric
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
    expect(event.min).to.equal(0);
    expect(event.max).to.equal(1);
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
    expect(event.min).to.equal(0);
    expect(event.max).to.equal(1);
    expect(event.values).to.deep.equal(data.concat(dataUpdate));
  });

  function getSubscribeParams() {
    const pluginId = ec2;
    const steadyId = 's42';
    const hostId = 'h42';
    const since = new Date().getTime();
    const metric = 'cpu.total.sys';

    return {
      snapshot: Immutable.fromJS({
        pluginId,
        hostId,
        steadyId
      }),
      since,
      metric
    };
  }

  function emitData(msg) {
    connection.emitter.emit('message', msg);
  }
});

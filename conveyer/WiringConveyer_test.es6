/* eslint-env mocha*/
/*eslint max-len:[2, 120] */

'use strict';

import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';
import RoEmitter from 'roemitter';

const ec2 = 'com.instana.forge.infrastructure.virtualization.EC2';

describe('conveyer.WiringConveyer', () => {

  let WiringConveyer;
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
    WiringConveyer = proxyquire('./WiringConveyer', {
      '../connection/subscriptionAwareConnection': connection
    });
  });

  it('should calculate unique id', () => {
    expect(WiringConveyer.getUniqueId({pluginId: ec2}))
      .to.equal(ec2);
  });

  it('should subscribe via WebSocket connection', () => {
    conveyer = new WiringConveyer({pluginId: ec2});
    conveyer.start(onNext);
    expect(connection.subscribe.calledOnce).to.equal(true);
    expect(connection.subscribe.getCall(0).args[0]).to.equal(conveyer.id);
    expect(connection.subscribe.getCall(0).args[1]).to.deep.equal({
      id: conveyer.id,
      event: 'subscribe',
      type: 'wiring',
      pluginId: ec2
    });
  });

  // function emitData(msg) {
  //   connection.emitter.emit('message', msg);
  // }
  //
  // function snapshot(i, data) {
  //   return {
  //     pluginId: 'p1',
  //     steadyId: 's' + i,
  //     hostId: 'h' + i,
  //     snapshot: data
  //   };
  // }
});

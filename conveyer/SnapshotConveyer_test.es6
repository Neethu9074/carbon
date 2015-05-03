/* eslint-env mocha*/
/*eslint max-len:[2, 120] */

'use strict';

import Immutable from 'immutable';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';
import RxEmitter from 'rxemitter';

const ec2 = 'com.instana.forge.infrastructure.virtualization.EC2';

describe('conveyer.SnapshotConveyer', () => {

  let SnapshotConveyer;
  let conveyer;
  let onNext;
  let connection;

  beforeEach(() => {
    onNext = sinon.stub();

    connection = {
      emitter: new RxEmitter(),
      send: sinon.stub(),
      subscribe: sinon.stub(),
      unsubscribe: sinon.stub(),
      __esModule: true
    };
    SnapshotConveyer = proxyquire('./SnapshotConveyer', {
      '../connection/subscriptionAwareConnection': connection
    });
  });

  it('should calculate unique id', () => {
    expect(SnapshotConveyer.getUniqueId({pluginId: ec2}))
      .to.equal('snapshot:' + ec2);
  });

  it('should subscribe via WebSocket connection', () => {
    conveyer = new SnapshotConveyer({pluginId: ec2});
    conveyer.start(onNext);
    expect(connection.subscribe.calledOnce).to.equal(true);
    expect(connection.subscribe.getCall(0).args[0]).to.equal('snapshot:' + ec2);
    expect(connection.subscribe.getCall(0).args[1]).to.deep.equal({
      type: 'snapshot',
      pluginId: ec2
    });
  });

  it('should inform about initial snapshots', () => {
    conveyer = new SnapshotConveyer({pluginId: ec2});
    conveyer.start(onNext);
    emitData({
      neu: [
        {id: 1},
        {id: 2}
      ]
    });
    expect(onNext.calledOnce).to.equal(true);
    expect(onNext.getCall(0).args[0].toJS()).to.deep.equal([
      {id: 1},
      {id: 2}
    ]);
  });

  it('should dispose of WebSocket based subscription', () => {
    conveyer = new SnapshotConveyer({pluginId: ec2});
    conveyer.start(onNext);
    conveyer.stop();
    expect(connection.unsubscribe.calledOnce).to.equal(true);
    expect(connection.unsubscribe.getCall(0).args[0]).to.equal('snapshot:' + ec2);
  });

  it('should dispose of emitter subscription', () => {
    conveyer = new SnapshotConveyer({pluginId: ec2});
    conveyer.start(onNext);
    conveyer.stop();
    emitData({neu: [{id: 1}]});
    expect(onNext.callCount).to.equal(0);
  });

  function emitData({neu=[], changed=[], removed=[]}) {
    connection.emitter.emit('message', {
      event: 'snapshot:' + ec2,
      data: {
        'new': Immutable.fromJS(neu),
        changed: Immutable.fromJS(changed),
        removed: Immutable.fromJS(removed)
      }
    });
  }
});

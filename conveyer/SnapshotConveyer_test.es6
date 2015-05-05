/* eslint-env mocha*/
/*eslint max-len:[2, 120] */

'use strict';

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
      channel: ec2
    });
  });

  it('should inform about initial snapshots', () => {
    conveyer = new SnapshotConveyer({pluginId: ec2});
    conveyer.start(onNext);
    emitData({
      online: [
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
    emitData({online: [{id: 1}]});
    expect(onNext.callCount).to.equal(0);
  });

  it('should handle successive new messages', () => {
    conveyer = new SnapshotConveyer({pluginId: ec2});
    conveyer.start(onNext);
    emitData({
      online: [snapshot(1, 'initial')]
    });
    emitData({
      online: [snapshot(2, 'initial')]
    });
    const snapshots = onNext.getCall(1).args[0];
    expect(snapshots.size).to.equal(2);
  });

  it('should support edits', () => {
    conveyer = new SnapshotConveyer({pluginId: ec2});
    conveyer.start(onNext);
    emitData({
      online: [snapshot(1, 'initial'), snapshot(2, 'initial')]
    });
    emitData({
      online: [snapshot(2, 'changed')]
    });
    const snapshots = onNext.getCall(1).args[0];
    expect(snapshots.size).to.equal(2);
    expect(snapshots.get(1).get('snapshot')).to.equal('changed');
  });

  it('should support removals', () => {
    conveyer = new SnapshotConveyer({pluginId: ec2});
    conveyer.start(onNext);
    emitData({
      online: [snapshot(1, 'initial'), snapshot(2, 'initial')]
    });
    emitData({
      removed: [snapshot(2)]
    });
    const snapshots = onNext.getCall(1).args[0];
    expect(snapshots.size).to.equal(1);
    expect(snapshots.get(0).get('hostId')).to.equal('h1');
  });

  it('should keep existing immutable snapshots on update', () => {
    conveyer = new SnapshotConveyer({pluginId: ec2});
    conveyer.start(onNext);
    emitData({
      online: [snapshot(1, 'initial'), snapshot(2, 'initial')]
    });
    emitData({
      online: [snapshot(2, 'initial')]
    });

    const initialSnapshots = onNext.getCall(0).args[0];
    const updatedSnapshots = onNext.getCall(1).args[0];
    expect(initialSnapshots.get(0)).to.equal(updatedSnapshots.get(0));

    // value changed. The immutable data structure needs to have been updated!
    expect(initialSnapshots.get(1)).not.to.equal(updatedSnapshots.get(1));
  });

  it('should discard previous values on reconnect', () => {
    conveyer = new SnapshotConveyer({pluginId: ec2});
    conveyer.start(onNext);
    emitData({
      online: [snapshot(1, 'beforeReconnect')]
    });

    connection.emitter.emit('connected');
    emitData({
      online: [snapshot(2, 'afterReconnect')]
    });

    const data = onNext.getCall(1).args[0];
    expect(data.size).to.equal(1);
    expect(data.get(0).get('hostId')).to.equal('h2');
  });

  function emitData({online=[], removed=[]}) {
    connection.emitter.emit('message', {
      event: 'snapshot:' + ec2,
      data: {
        online,
        removed
      }
    });
  }

  function snapshot(i, data) {
    return {
      pluginId: 'p' + i,
      steadyId: 's' + i,
      hostId: 'h' + i,
      snapshot: data
    };
  }
});

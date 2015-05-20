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
    expect(connection.subscribe.calledTwice).to.equal(true);
    expect(connection.subscribe.getCall(0).args[0]).to.equal(conveyer.snapshotId);
    expect(connection.subscribe.getCall(0).args[1]).to.deep.equal({
      id: conveyer.snapshotId,
      event: 'subscribe',
      type: 'snapshot',
      pluginId: ec2
    });
    expect(connection.subscribe.getCall(1).args[0]).to.equal(conveyer.presenceId);
    expect(connection.subscribe.getCall(1).args[1]).to.deep.equal({
      id: conveyer.presenceId,
      event: 'subscribe',
      type: 'presence',
      pluginId: ec2
    });
  });

  it('should inform about initial snapshots', () => {
    conveyer = new SnapshotConveyer({pluginId: ec2});
    conveyer.start(onNext);
    emitData({
      id: conveyer.snapshotId,
      data: [
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
    expect(connection.unsubscribe.calledTwice).to.equal(true);
    expect(connection.unsubscribe.getCall(0).args[0]).to.equal(conveyer.snapshotId);
    expect(connection.unsubscribe.getCall(1).args[0]).to.equal(conveyer.presenceId);
  });

  it('should dispose of emitter subscription', () => {
    conveyer = new SnapshotConveyer({pluginId: ec2});
    conveyer.start(onNext);
    conveyer.stop();
    emitData({online: [{id: 1}]});
    expect(onNext.callCount).to.equal(0);
  });

  it('should handle successive new messages', (done) => {
    conveyer = new SnapshotConveyer({pluginId: ec2});
    conveyer.start(onNext);
    emitData({
      id: conveyer.snapshotId,
      data: [snapshot(1, 'initial')]
    });
    emitData({
      id: conveyer.snapshotId,
      data: [snapshot(2, 'initial')]
    });
    setTimeout(() => {
      const snapshots = onNext.getCall(1).args[0];
      expect(snapshots.size).to.equal(2);
      done();
    }, 110);
  });

  it('should support edits', (done) => {
    conveyer = new SnapshotConveyer({pluginId: ec2});
    conveyer.start(onNext);
    emitData({
      id: conveyer.snapshotId,
      data: [snapshot(1, 'initial'), snapshot(2, 'initial')]
    });
    emitData({
      id: conveyer.snapshotId,
      data: [snapshot(2, 'changed')]
    });
    setTimeout(() => {
      const snapshots = onNext.getCall(1).args[0];
      expect(snapshots.size).to.equal(2);
      expect(snapshots.get(1).get('snapshot')).to.equal('changed');
      done();
    }, 110);
  });

  it('should support removals', (done) => {
    conveyer = new SnapshotConveyer({pluginId: ec2});
    conveyer.start(onNext);
    emitData({
      id: conveyer.snapshotId,
      data: [snapshot(1, 'initial'), snapshot(2, 'initial')]
    });
    emitData({
      id: conveyer.presenceId,
      hostId: 'h2',
      steadyId: 's2',
      pluginId: 'p2'
    });
    setTimeout(() => {
      const snapshots = onNext.getCall(1).args[0];
      expect(snapshots.size).to.equal(1);
      expect(snapshots.get(0).get('hostId')).to.equal('h1');
      done();
    }, 110);
  });

  it('should keep existing immutable snapshots on update', (done) => {
    conveyer = new SnapshotConveyer({pluginId: ec2});
    conveyer.start(onNext);
    emitData({
      id: conveyer.snapshotId,
      data: [snapshot(1, 'initial'), snapshot(2, 'initial')]
    });
    emitData({
      id: conveyer.snapshotId,
      data: [snapshot(2, 'initial')]
    });

    setTimeout(() => {
      const initialSnapshots = onNext.getCall(0).args[0];
      const updatedSnapshots = onNext.getCall(1).args[0];
      expect(initialSnapshots.get(0)).to.equal(updatedSnapshots.get(0));

      // value changed. The immutable data structure needs to have been updated!
      expect(initialSnapshots.get(1)).not.to.equal(updatedSnapshots.get(1));
      done();
    }, 110);
  });

  it('should discard previous values on reconnect', (done) => {
    conveyer = new SnapshotConveyer({pluginId: ec2});
    conveyer.start(onNext);
    emitData({
      id: conveyer.snapshotId,
      data: [snapshot(1, 'beforeReconnect')]
    });

    connection.emitter.emit('connected');
    emitData({
      id: conveyer.snapshotId,
      data: [snapshot(2, 'afterReconnect')]
    });

    setTimeout(() => {
      const data = onNext.getCall(1).args[0];
      expect(data.size).to.equal(1);
      expect(data.get(0).get('hostId')).to.equal('h2');
      done();
    }, 100);
  });

  function emitData(msg) {
    connection.emitter.emit('message', msg);
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

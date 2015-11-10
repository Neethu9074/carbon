/* eslint-env mocha */
/* eslint max-len:[2, 120] */
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';
import RoEmitter from 'roemitter';

const ec2 = 'com.instana.forge.hardware.virtual.ec2.Ec2';

describe('conveyer.SnapshotsConveyer', () => {

  let SnapshotsConveyer;
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
    SnapshotsConveyer = proxyquire('./SnapshotsConveyer', {
      '../connection/subscriptionAwareConnection': connection
    });
  });

  it('should calculate unique id', () => {
    expect(SnapshotsConveyer.getUniqueId({pluginId: ec2}))
      .to.equal('snapshots:' + ec2);
  });

  it('should subscribe via WebSocket connection', () => {
    conveyer = new SnapshotsConveyer({pluginId: ec2});
    conveyer.start(onNext);
    // once for snapshots and once for presence
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
    conveyer = new SnapshotsConveyer({pluginId: ec2});
    conveyer.start(onNext);
    emitData({
      id: conveyer.snapshotId,
      data: [
        {steadyId: 's1', pluginId: 'p1', hostId: 'h1'},
        {steadyId: 's2', pluginId: 'p2', hostId: 'h2'}
      ]
    });
    expect(onNext.calledOnce).to.equal(true);
    expect(onNext.getCall(0).args[0].toJS()).to.deep.equal([
      {steadyId: 's1', pluginId: 'p1', hostId: 'h1', id: 'p1#h1#s1', tags: []},
      {steadyId: 's2', pluginId: 'p2', hostId: 'h2', id: 'p2#h2#s2', tags: []}
    ]);
  });

  it('should dispose of WebSocket based subscription', () => {
    conveyer = new SnapshotsConveyer({pluginId: ec2});
    conveyer.start(onNext);
    conveyer.stop();
    expect(connection.unsubscribe.calledTwice).to.equal(true);
    expect(connection.unsubscribe.getCall(0).args[0]).to.equal(conveyer.snapshotId);
    expect(connection.unsubscribe.getCall(1).args[0]).to.equal(conveyer.presenceId);
  });

  it('should dispose of emitter subscription', () => {
    conveyer = new SnapshotsConveyer({pluginId: ec2});
    conveyer.start(onNext);
    conveyer.stop();
    emitData({online: [{id: 1}]});
    expect(onNext.callCount).to.equal(0);
  });

  it('should remove offline snapshots', () => {
    conveyer = new SnapshotsConveyer({pluginId: ec2});
    conveyer.start(onNext);
    emitData({
      id: conveyer.snapshotId,
      data: [
        {steadyId: 's1', pluginId: 'p1', hostId: 'h1'},
        {steadyId: 's2', pluginId: 'p2', hostId: 'h2'}
      ]
    });
    expect(onNext).to.have.callCount(1);
    expect(onNext.getCall(0).args[0].toJS()).to.deep.equal([
      {steadyId: 's1', pluginId: 'p1', hostId: 'h1', id: 'p1#h1#s1', tags: []},
      {steadyId: 's2', pluginId: 'p2', hostId: 'h2', id: 'p2#h2#s2', tags: []}
    ]);

    emitData({
      id: conveyer.presenceId,
      data: [
        {steadyId: 's1', pluginId: 'p1', hostId: 'h1', data: {online: true}}
      ]
    });
    expect(onNext).to.have.callCount(1);

    emitData({
      id: conveyer.presenceId,
      data: [
        {steadyId: 's1', pluginId: 'p1', hostId: 'h1', data: {online: false}}
      ]
    });

    expect(onNext).to.have.callCount(2);
    expect(onNext.getCall(1).args[0].toJS()).to.deep.equal([
      {steadyId: 's2', pluginId: 'p2', hostId: 'h2', id: 'p2#h2#s2', tags: []}
    ]);
  });

  it('should handle successive new messages', () => {
    conveyer = new SnapshotsConveyer({pluginId: ec2});
    conveyer.start(onNext);
    emitData({
      id: conveyer.snapshotId,
      data: [snapshot(1, 'initial')]
    });
    emitData({
      id: conveyer.snapshotId,
      data: [snapshot(2, 'initial')]
    });
    const snapshots = onNext.getCall(1).args[0];
    expect(snapshots.size).to.equal(2);
  });

  it('should support edits', () => {
    conveyer = new SnapshotsConveyer({pluginId: ec2});
    conveyer.start(onNext);
    emitData({
      id: conveyer.snapshotId,
      data: [snapshot(1, 'initial'), snapshot(2, 'initial')]
    });
    emitData({
      id: conveyer.snapshotId,
      data: [snapshot(2, 'changed')]
    });
    const snapshots = onNext.getCall(1).args[0];
    expect(snapshots.size).to.equal(2);
    expect(snapshots.get(1).get('snapshot')).to.equal('changed');
  });

  it('should keep existing immutable snapshots on update', () => {
    conveyer = new SnapshotsConveyer({pluginId: ec2});
    conveyer.start(onNext);
    emitData({
      id: conveyer.snapshotId,
      data: [snapshot(1, 'initial'), snapshot(2, 'initial')]
    });
    emitData({
      id: conveyer.snapshotId,
      data: [snapshot(2, 'initial')]
    });

    const initialSnapshots = onNext.getCall(0).args[0];
    const updatedSnapshots = onNext.getCall(1).args[0];
    expect(initialSnapshots.get(0)).to.equal(updatedSnapshots.get(0));

    // value changed. The immutable data structure needs to have been updated!
    expect(initialSnapshots.get(1)).not.to.equal(updatedSnapshots.get(1));
  });

  it('should discard previous values on reconnect', () => {
    conveyer = new SnapshotsConveyer({pluginId: ec2});
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

    const data = onNext.getCall(1).args[0];
    expect(data.size).to.equal(1);
    expect(data.get(0).get('hostId')).to.equal('h2');
  });

  function emitData(msg) {
    connection.emitter.emit('message', msg);
  }

  function snapshot(i, data) {
    return {
      pluginId: 'p1',
      steadyId: 's' + i,
      hostId: 'h' + i,
      snapshot: data
    };
  }
});

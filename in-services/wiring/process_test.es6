/*eslint-env mocha,node*/
import * as ro from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import WiringConveyer from '../conveyer/WiringConveyer';
import {extractCoordinates} from '../snapshots';
import {getGraph} from './test_util';

describe('wiring.process view', () => {

  let onNext;
  let wiringConveyer;
  let mod;

  beforeEach(() => {
    onNext = sinon.stub();
    const create = sinon.stub();

    wiringConveyer = ro.create({emitLatestOnSubscribe: true});
    create.withArgs(WiringConveyer).returns(wiringConveyer);

    mod = proxyquire('./process', {
      '../conveyer': {
        create
      }
    });
  });


  it('should return an empty array for empty graphs', () => {
    emitGraph(getGraph('empty'));

    mod.processViewWiring.subscribe(onNext);

    expect(onNext).to.have.callCount(1);
    const structure = onNext.getCall(0).args[0];
    expect(structure).to.be.instanceOf(Array);
    expect(structure.length).to.equal(0);
  });


  it('should list lowest item of runs on chain as process', () => {
    emitGraph(getGraph('simple'));

    mod.processViewWiring.subscribe(onNext);

    expect(onNext).to.have.callCount(1);
    const structure = onNext.getCall(0).args[0];
    expect(structure.length).to.equal(1);
    expect(structure[0].node.get('id'))
      .to.equal('com.instana.forge.infrastructure.database.cassandra.Cassandra#h1#sCassandra');
  });

  describe('getConnectedCoordinates', () => {

    it('should return empty array on undefined snapshot', () => {
      emitGraph(getGraph('empty'));
      mod.getConnectedCoordinates(undefined).subscribe(onNext);

      expect(onNext).to.have.callCount(1);
      expect(onNext.getCall(0).args[0].incoming).to.deep.equal([]);
      expect(onNext.getCall(0).args[0].outgoing).to.deep.equal([]);
    });

    it('should return empty array if no connected nodes are found', () => {
      emitGraph(getGraph('connection'));

      const nodeCoords = extractCoordinates({
        id: 'com.instana.forge.infrastructure.virtualization.Docker#h1#sDocker',
        hostId: 'h1',
        pluginId: 'com.instana.forge.infrastructure.virtualization.Docker',
        steadyId: 'sDocker'
      });

      mod.getConnectedCoordinates(nodeCoords).subscribe(onNext);

      expect(onNext).to.have.callCount(1);
      expect(onNext.getCall(0).args[0].incoming).to.deep.equal([]);
      expect(onNext.getCall(0).args[0].outgoing).to.deep.equal([]);
    });

    it('should return connected node coords', () => {
      emitGraph(getGraph('connection'));

      const osCoords = extractCoordinates({
        id: 'com.instana.forge.infrastructure.os.OS#h1#sOS',
        hostId: 'h1',
        pluginId: 'com.instana.forge.infrastructure.os.OS',
        steadyId: 'sOS'
      });

      const cassandraCoords = extractCoordinates({
        id: 'com.instana.forge.infrastructure.database.cassandra.Cassandra#h1#sCassandra',
        hostId: 'h1',
        pluginId: 'com.instana.forge.infrastructure.database.cassandra.Cassandra',
        steadyId: 'sCassandra'
      });

      const ec2Coords = extractCoordinates({
        id: 'com.instana.forge.hardware.virtual.EC2#h1#sEC2',
        hostId: 'h1',
        pluginId: 'com.instana.forge.hardware.virtual.EC2',
        steadyId: 'sEC2'
      });

      mod.getConnectedCoordinates(osCoords).subscribe(onNext);

      expect(onNext).to.have.callCount(1);
      const incoming = onNext.getCall(0).args[0].incoming;
      const outgoing = onNext.getCall(0).args[0].outgoing;

      expect(incoming.length).to.equal(0);
      expect(outgoing.length).to.equal(2);

      expect(outgoing[0].get('id')).to.equal(ec2Coords.get('id'));
      expect(outgoing[1].get('id')).to.equal(cassandraCoords.get('id'));
    });

    it('should return connected node coords II', () => {
      emitGraph(getGraph('connection'));

      const osCoords = extractCoordinates({
        id: 'com.instana.forge.infrastructure.os.OS#h1#sOS',
        hostId: 'h1',
        pluginId: 'com.instana.forge.infrastructure.os.OS',
        steadyId: 'sOS'
      });

      const cassandraCoords = extractCoordinates({
        id: 'com.instana.forge.infrastructure.database.cassandra.Cassandra#h1#sCassandra',
        hostId: 'h1',
        pluginId: 'com.instana.forge.infrastructure.database.cassandra.Cassandra',
        steadyId: 'sCassandra'
      });

      const ec2Coords = extractCoordinates({
        id: 'com.instana.forge.hardware.virtual.EC2#h1#sEC2',
        hostId: 'h1',
        pluginId: 'com.instana.forge.hardware.virtual.EC2',
        steadyId: 'sEC2'
      });

      mod.getConnectedCoordinates(ec2Coords).subscribe(onNext);

      expect(onNext).to.have.callCount(1);
      const incoming = onNext.getCall(0).args[0].incoming;
      const outgoing = onNext.getCall(0).args[0].outgoing;

      expect(incoming.length).to.equal(2);
      expect(outgoing.length).to.equal(0);

      expect(incoming[0].get('id')).to.equal(osCoords.get('id'));
      expect(incoming[1].get('id')).to.equal(cassandraCoords.get('id'));
    });
  });

  function emitGraph(graph) {
    wiringConveyer.emit(graph);
  }
});

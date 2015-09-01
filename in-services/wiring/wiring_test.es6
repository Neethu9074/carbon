/*eslint-env mocha,node*/
import fs from 'fs';
import path from 'path';
import Immutable from 'immutable';
import sinon from 'sinon';
import {expect} from 'chai';
import proxyquire from 'proxyquire';
import * as ro from 'reactive-observables';

import {extractCoordinates} from '../snapshots';
import WiringConveyer from '../conveyer/WiringConveyer';
import * as views from '../views';

describe('wiring', () => {

  let onNext;
  let wiringConveyer;
  let mod;

  beforeEach(() => {
    onNext = sinon.stub();
    const create = sinon.stub();

    wiringConveyer = ro.create({emitLatestOnSubscribe: true});
    create.withArgs(WiringConveyer).returns(wiringConveyer);

    mod = proxyquire('./wiring', {
      '../conveyer': {
        create
      }
    });
  });

  describe('physical view', () => {
    describe('hosts views', () => {

      it('should return an empty array for empty graphs', () => {
        emitGraph(getGraph('empty'));

        mod.getStructure(views.physical.hosts)
          .subscribe(onNext);

        expect(onNext).to.have.callCount(1);
        const structure = onNext.getCall(0).args[0];
        expect(structure).to.be.instanceOf(Array);
        expect(structure.length).to.equal(0);
      });

      it('should traverse the graph and identify groups for OS snapshots', () => {
        emitGraph(getGraph('simple'));

        mod.getStructure(views.physical.hosts)
          .subscribe(onNext);

        expect(onNext).to.have.callCount(1);
        const structure = onNext.getCall(0).args[0];
        expect(structure.length).to.equal(1);
        const hostInfo = structure[0];
        expect(hostInfo.group.toJS()).to.deep.equal({
          id: 'com.instana.forge.hardware.virtual.EC2#h1#sEC2',
          hostId: 'h1',
          pluginId: 'com.instana.forge.hardware.virtual.EC2',
          steadyId: 'sEC2'
        });
        expect(hostInfo.node.toJS()).to.deep.equal({
          id: 'com.instana.forge.infrastructure.os.OS#h1#sOS',
          hostId: 'h1',
          pluginId: 'com.instana.forge.infrastructure.os.OS',
          steadyId: 'sOS'
        });
      });

      it('should find layers for OS snapshots', () => {
        emitGraph(getGraph('common'));

        mod.getStructure(views.physical.hosts)
          .subscribe(onNext);

        expect(onNext).to.have.callCount(1);
        const structure = onNext.getCall(0).args[0];
        expect(structure.length).to.equal(2);

        const host1Info = structure[0];
        expect(host1Info.group.get('hostId')).to.equal('h1');
        expect(host1Info.group.get('steadyId')).to.equal('sEC2');
        expect(host1Info.node.get('hostId')).to.equal('h1');
        expect(host1Info.node.get('steadyId')).to.equal('sOS');
        expect(host1Info.layers.length).to.equal(1);
        expect(host1Info.layers[0].get('hostId')).to.equal('h1');
        expect(host1Info.layers[0].get('steadyId')).to.equal('sCassandra');

        const host2Info = structure[1];
        expect(host2Info.group.get('hostId')).to.equal('h2');
        expect(host2Info.group.get('steadyId')).to.equal('sAIX');
        expect(host2Info.node.get('hostId')).to.equal('h2');
        expect(host2Info.node.get('steadyId')).to.equal('sOS');
        expect(host2Info.layers.length).to.equal(2);
        expect(host2Info.layers[0].get('hostId')).to.equal('h2');
        expect(host2Info.layers[0].get('steadyId')).to.equal('sMySQL');
        expect(host2Info.layers[1].get('hostId')).to.equal('h2');
        expect(host2Info.layers[1].get('steadyId')).to.equal('sCassandra');
      });

      describe('getAllStepsBetweenNodeAndLeaf', () => {

        it('should fail on unsupported view', () => {
          expect(() => mod.getAllStepsBetweenNodeAndLeaf(views.physical.process))
            .to.throw(Error);
        });

        it('should return empty array on empty graph', () => {
          emitGraph(getGraph('empty'));

          mod.getAllStepsBetweenNodeAndLeaf(views.physical.hosts, extractCoordinates({
            hostId: 'h_0',
            steadyId: 's_1',
            pluginId: 'p_2'
          })).subscribe(onNext);

          expect(onNext).to.have.callCount(1);
          expect(onNext.getCall(0).args[0]).to.deep.equal([]);
        });

        it('should return empty if snapshot cannot be found', () => {
          emitGraph(getGraph('common'));

          mod.getAllStepsBetweenNodeAndLeaf(views.physical.hosts, extractCoordinates({
            hostId: 'h_0',
            steadyId: 's_1',
            pluginId: 'p_2'
          })).subscribe(onNext);

          expect(onNext).to.have.callCount(1);
          expect(onNext.getCall(0).args[0]).to.deep.equal([]);
        });

        it('should return a sorted list of coords for docker on simple', () => {
          emitGraph(getGraph('simple'));

          const cassandraCoords = extractCoordinates({
            hostId: 'h1',
            pluginId: 'com.instana.forge.infrastructure.database.cassandra.Cassandra',
            steadyId: 'sCassandra'
          });

          const dockerCoords = extractCoordinates({
            hostId: 'h1',
            pluginId: 'com.instana.forge.infrastructure.virtualization.Docker',
            steadyId: 'sDocker'
          });

          mod.getAllStepsBetweenNodeAndLeaf(views.physical.hosts, dockerCoords).subscribe(onNext);

          expect(onNext).to.have.callCount(1);

          const nodes = onNext.getCall(0).args[0];
          expect(nodes[0]).to.equal(cassandraCoords.get('id'));
          expect(nodes[1]).to.equal(dockerCoords.get('id'));
        });

        it('should return a sorted list of coords for cassandra on simple', () => {
          emitGraph(getGraph('simple'));

          const cassandraCoords = extractCoordinates({
            hostId: 'h1',
            pluginId: 'com.instana.forge.infrastructure.database.cassandra.Cassandra',
            steadyId: 'sCassandra'
          });

          const dockerCoords = extractCoordinates({
            hostId: 'h1',
            pluginId: 'com.instana.forge.infrastructure.virtualization.Docker',
            steadyId: 'sDocker'
          });

          mod.getAllStepsBetweenNodeAndLeaf(views.physical.hosts, cassandraCoords).subscribe(onNext);

          expect(onNext).to.have.callCount(1);
          const nodes = onNext.getCall(0).args[0];
          expect(nodes[0]).to.equal(cassandraCoords.get('id'));
          expect(nodes[1]).to.equal(dockerCoords.get('id'));
        });

        it('should return a sorted list of coords for MySQL on common', () => {
          emitGraph(getGraph('common'));

          const processCoords = extractCoordinates({
            id: 'com.instana.forge.infrastructure.os.Process#h2#sProcess',
            hostId: 'h2',
            pluginId: 'com.instana.forge.infrastructure.os.Process',
            steadyId: 'sProcess'
          });

          const mysqlCoords = extractCoordinates({
            id: 'com.instana.forge.infrastructure.database.mysql.MySQL#h2#sMySQL',
            hostId: 'h2',
            pluginId: 'com.instana.forge.infrastructure.database.mysql.MySQL',
            steadyId: 'sMySQL'
          });

          mod.getAllStepsBetweenNodeAndLeaf(views.physical.hosts, mysqlCoords).subscribe(onNext);

          expect(onNext).to.have.callCount(1);
          const nodes = onNext.getCall(0).args[0];
          expect(nodes[0]).to.equal(mysqlCoords.get('id'));
          expect(nodes[1]).to.equal(processCoords.get('id'));
        });

      });

    });
  });

  function getGraph(fileName) {
    const contents = fs.readFileSync(
      path.join(__dirname, 'testGraphs', fileName + '.json'),
      {encoding: 'utf8'}
    );

    const graph = JSON.parse(contents);

    // ensure that the node id objects are immutable (as done by the WiringConveyer)
    Object.keys(graph.nodes).forEach(nodeKey => {
      graph.nodes[nodeKey] = Immutable.fromJS(graph.nodes[nodeKey]);
    });

    return graph;
  }

  function emitGraph(graph) {
    wiringConveyer.emit(graph);
  }
});

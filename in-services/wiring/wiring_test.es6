/*eslint-env mocha*/
import * as ro from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import WiringConveyer from '../conveyer/WiringConveyer';
import {extractCoordinates} from '../snapshots';
import {getGraph} from './test_util';
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
      './physical': proxyquire('./physical', {
        '../conveyer': {
          create
        }
      }),
      '../conveyer': {
        create
      }
    });
  });

  describe('physical view', () => {
    describe('hosts views', () => {

      it('should return an empty array for empty graphs', () => {
        emitGraph(getGraph('empty'));

        mod.getStructure(views.physical)
          .subscribe(onNext);

        expect(onNext).to.have.callCount(1);
        const structure = onNext.getCall(0).args[0];
        expect(structure).to.be.instanceOf(Array);
        expect(structure.length).to.equal(0);
      });

      it('should traverse the graph and identify groups for OS snapshots', () => {
        emitGraph(getGraph('simple'));

        mod.getStructure(views.physical)
          .subscribe(onNext);

        expect(onNext).to.have.callCount(1);
        const structure = onNext.getCall(0).args[0];
        expect(structure.length).to.equal(1);
        const hostInfo = structure[0];
        expect(hostInfo.group.toJS()).to.deep.equal({
          id: 'com.instana.forge.hardware.virtual.ec2.Ec2#h1#sEC2',
          hostId: 'h1',
          pluginId: 'com.instana.forge.hardware.virtual.ec2.Ec2',
          steadyId: 'sEC2'
        });
        expect(hostInfo.node.toJS()).to.deep.equal({
          id: 'com.instana.forge.infrastructure.os.host.Host#h1#sOS',
          hostId: 'h1',
          pluginId: 'com.instana.forge.infrastructure.os.host.Host',
          steadyId: 'sOS'
        });
      });

      it('should find layers for OS snapshots', () => {
        emitGraph(getGraph('common'));

        mod.getStructure(views.physical)
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


      it('should process secondary updates', () => {
        emitGraph(getGraph('simple'));
        mod.getStructure(views.physical)
          .subscribe(onNext);

        emitGraph(getGraph('common'));
        expect(onNext).to.have.callCount(2);
        const structure = onNext.getCall(1).args[0];
        expect(structure.length).to.equal(2);
      });


      describe('getAllStepsBetweenNodeAndLeaf', () => {

        it('should fail on unsupported view', () => {
          expect(() => mod.getAllStepsBetweenNodeAndLeaf(views.physical.process))
            .to.throw(Error);
        });

        it('should return empty array on empty graph', () => {
          emitGraph(getGraph('empty'));

          mod.getAllStepsBetweenNodeAndLeaf(views.physical, extractCoordinates({
            hostId: 'h_0',
            steadyId: 's_1',
            pluginId: 'p_2'
          })).subscribe(onNext);

          expect(onNext).to.have.callCount(1);
          expect(onNext.getCall(0).args[0]).to.deep.equal([]);
        });

        it('should return empty if snapshot cannot be found', () => {
          emitGraph(getGraph('common'));

          mod.getAllStepsBetweenNodeAndLeaf(views.physical, extractCoordinates({
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

          mod.getAllStepsBetweenNodeAndLeaf(views.physical, dockerCoords).subscribe(onNext);

          expect(onNext).to.have.callCount(1);

          const nodes = onNext.getCall(0).args[0];
          expect(nodes[0].get('id')).to.equal(cassandraCoords.get('id'));
          expect(nodes[1].get('id')).to.equal(dockerCoords.get('id'));
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

          mod.getAllStepsBetweenNodeAndLeaf(views.physical, cassandraCoords).subscribe(onNext);

          expect(onNext).to.have.callCount(1);
          const nodes = onNext.getCall(0).args[0];
          expect(nodes[0].get('id')).to.equal(cassandraCoords.get('id'));
          expect(nodes[1].get('id')).to.equal(dockerCoords.get('id'));
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

          mod.getAllStepsBetweenNodeAndLeaf(views.physical, mysqlCoords).subscribe(onNext);

          expect(onNext).to.have.callCount(1);
          const nodes = onNext.getCall(0).args[0];
          expect(nodes[0].get('id')).to.equal(mysqlCoords.get('id'));
          expect(nodes[1].get('id')).to.equal(processCoords.get('id'));
        });

      });

      describe('getParentNode', () => {
        const cassandra = extractCoordinates({
          hostId: 'h2',
          pluginId: 'com.instana.forge.infrastructure.database.cassandra.Cassandra',
          steadyId: 'sCassandra'
        });

        const os = extractCoordinates({
          hostId: 'h2',
          pluginId: 'com.instana.forge.infrastructure.os.host.Host',
          steadyId: 'sOS'
        });

        it('should throw an exception for unsupported views', () => {
          expect(() => {
            mod.getParentNode(views.physical.processes, cassandra);
          }).to.throw();
        });

        it('should return null for empty graphs', () => {
          emitGraph(getGraph('empty'));

          mod.getParentNode(views.physical, cassandra)
            .subscribe(onNext);

          expect(onNext).to.have.callCount(1);
          expect(onNext).to.have.been.calledWith(null);
        });

        it('should return null for snapshots that have no view specific parent', () => {
          emitGraph(getGraph('common'));

          mod.getParentNode(views.physical, os)
            .subscribe(onNext);

          expect(onNext).to.have.callCount(1);
          expect(onNext).to.have.been.calledWith(null);
        });

        it('should traverse the graph and return the os coordinates as parent', () => {
          emitGraph(getGraph('common'));

          mod.getParentNode(views.physical, cassandra)
            .subscribe(onNext);

          expect(onNext).to.have.callCount(1);
          expect(onNext.getCall(0).args[0].toJS()).to.deep.equal(os.toJS());
        });
      });
    });
  });


  function emitGraph(graph) {
    wiringConveyer.emit(graph);
  }

});

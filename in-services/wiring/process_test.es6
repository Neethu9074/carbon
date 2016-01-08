/* eslint-env mocha,node */
import * as ro from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import {extractCoordinates} from '../snapshots';
import WiringConveyer from '../conveyer/WiringConveyer';
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

  describe('getConnectedCoordinates', () => {

    it('should return empty array on undefined snapshot', () => {
      emitGraph(getGraph('empty'));
      const wired = mod.getConnectedCoordinates(undefined);
      expect(wired.outgoing).to.deep.equal([]);
      expect(wired.incoming).to.deep.equal([]);
    });

    it('should return empty array if no connected nodes are found', () => {
      emitGraph(getGraph('connection'));
      wiringConveyer.subscribe(onNext);
      const id = 'com.instana.forge.infrastructure.virtualization.Docker#h1#sDocker';
      const wired = mod.getConnectedCoordinates(onNext.getCall(0).args[0], id);

      expect(wired.outgoing).to.deep.equal([]);
      expect(wired.incoming).to.deep.equal([]);
    });

    it('should return connected node coords', () => {
      emitGraph(getGraph('connection'));
      wiringConveyer.subscribe(onNext);

      const cassandraCoordsId = 'com.instana.forge.infrastructure.database.cassandra.Cassandra#h1#sCassandra';
      const ec2CoordsId = 'com.instana.forge.hardware.virtual.EC2#h1#sEC2';
      const osCoordsId = 'com.instana.forge.infrastructure.os.OS#h1#sOS';

      const wired = mod.getConnectedCoordinates(onNext.getCall(0).args[0], osCoordsId);

      expect(onNext).to.have.callCount(1);
      const incoming = wired.incoming;
      const outgoing = wired.outgoing;

      expect(incoming.length).to.equal(0);
      expect(outgoing.length).to.equal(2);

      expect(outgoing[0].get('id')).to.equal(ec2CoordsId);
      expect(outgoing[1].get('id')).to.equal(cassandraCoordsId);
    });

    it('should return connected node coords II', () => {
      emitGraph(getGraph('connection'));
      wiringConveyer.subscribe(onNext);
      expect(onNext).to.have.callCount(1);

      const cassandraCoordsId = 'com.instana.forge.infrastructure.database.cassandra.Cassandra#h1#sCassandra';
      const ec2CoordsId = 'com.instana.forge.hardware.virtual.EC2#h1#sEC2';
      const osCoordsId = 'com.instana.forge.infrastructure.os.OS#h1#sOS';

      let wired = mod.getConnectedCoordinates(onNext.getCall(0).args[0], osCoordsId);
      let incoming = wired.incoming;
      let outgoing = wired.outgoing;

      expect(incoming.length).to.equal(0);
      expect(outgoing.length).to.equal(2);

      expect(outgoing[0].get('id')).to.equal(ec2CoordsId);
      expect(outgoing[1].get('id')).to.equal(cassandraCoordsId);


      wired = mod.getConnectedCoordinates(onNext.getCall(0).args[0], cassandraCoordsId);
      incoming = wired.incoming;
      outgoing = wired.outgoing;

      expect(incoming.length).to.equal(1);
      expect(outgoing.length).to.equal(1);

      expect(outgoing[0].get('id')).to.equal(ec2CoordsId);
      expect(incoming[0].get('id')).to.equal(osCoordsId);
    });
  });

  describe('getDeployedUnits', () => {

    const existingRuntimeCoordinates = extractCoordinates({
      hostId: 'h1',
      pluginId: 'com.instana.forge.infrastructure.runtime.nodejs.NodeJsRuntimePlatform',
      steadyId: 'sNode'
    });

    it('should return empty array when no deployment units exist', () => {
      const missingRuntimeCoordinates = extractCoordinates({
        hostId: 'h2',
        pluginId: 'com.instana.forge.infrastructure.runtime.nodejs.NodeJsRuntimePlatform',
        steadyId: 'sNode2'
      });

      emitGraph(getGraph('deployedUnits'));
      const subscriber = sinon.stub();
      mod.getDeployedUnits(missingRuntimeCoordinates).subscribe(subscriber);
      expect(subscriber).to.have.callCount(1);
      expect(subscriber.getCall(0).args[0]).to.deep.equal([]);
    });

    it('should return deployed unit', () => {
      emitGraph(getGraph('deployedUnits'));
      const subscriber = sinon.stub();
      mod.getDeployedUnits(existingRuntimeCoordinates).subscribe(subscriber);
      expect(subscriber).to.have.callCount(1);
      expect(subscriber.getCall(0).args[0][0].get('id')).to
        .equal('com.instana.forge.infrastructure.application.nodejs.GenericNodejsApp#h1#sNodeApp');
    });
  });

  function emitGraph(graph) {
    wiringConveyer.emit(graph);
  }
});

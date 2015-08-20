/*eslint-env mocha,node*/
import fs from 'fs';
import path from 'path';
import Immutable from 'immutable';
import sinon from 'sinon';
import {expect} from 'chai';
import proxyquire from 'proxyquire';
import * as ro from 'reactive-observables';

import WiringConveyer from '../conveyer/WiringConveyer';

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

        mod.getStructure(mod.views.physical.hosts)
          .subscribe(onNext);

        expect(onNext).to.have.callCount(1);
        const structure = onNext.getCall(0).args[0];
        expect(structure).to.be.instanceOf(Array);
        expect(structure.length).to.equal(0);
      });

      it('should traverse the graph and identify structure for OS snapshots', () => {
        emitGraph(getGraph('simple'));

        mod.getStructure(mod.views.physical.hosts)
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

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
    describe('getGroups', () => {

      it('should return an empty immutable set for empty graphs', () => {
        emitGraph(getGraph('empty'));

        mod.getGroups(mod.views.physical.hosts)
          .subscribe(onNext);

        expect(onNext).to.have.callCount(1);
        const groups = onNext.getCall(0).args[0];
        expect(Immutable.Set.isSet(groups)).to.equal(true);
        expect(groups.size).to.equal(0);
      });

      it('should traverse the graph and identify grounds for OS snapshots', () => {
        emitGraph(getGraph('simple'));

        mod.getGroups(mod.views.physical.hosts)
          .subscribe(onNext);

        expect(onNext).to.have.callCount(1);
        const groups = onNext.getCall(0).args[0];
        expect(groups.size).to.equal(1);
        const group = groups.first();
        expect(group.toJS()).to.deep.equal({
          id: 'com.instana.forge.hardware.virtual.EC2#h1#sEC2',
          hostId: 'h1',
          pluginId: 'com.instana.forge.hardware.virtual.EC2',
          steadyId: 'sEC2'
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

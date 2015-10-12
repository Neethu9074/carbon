/*eslint-env mocha,node*/
import sinon from 'sinon';
import {expect} from 'chai';
import proxyquire from 'proxyquire';
import * as ro from 'reactive-observables';

import {getGraph} from './test_util';
import WiringConveyer from '../conveyer/WiringConveyer';

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


  function emitGraph(graph) {
    wiringConveyer.emit(graph);
  }

});

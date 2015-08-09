/*eslint-env mocha*/



import Immutable from 'immutable';
import sinon from 'sinon';
import {expect} from 'chai';
import proxyquire from 'proxyquire';
import * as ro from 'reactive-observables';

import WiringConveyer from '../conveyer/WiringConveyer';
// import SnapshotConveyer from '../conveyer/SnapshotConveyer';

describe('wiring', () => {

  let onNext;
  let create;
  let wiringConveyer;
  let mod;

  beforeEach(() => {
    onNext = sinon.stub();
    create = sinon.stub();

    wiringConveyer = ro.create();
    create.withArgs(WiringConveyer).returns(wiringConveyer);

    mod = proxyquire('./index', {
      '../conveyer': {
        create
      }
    });
  });

  describe('getWiring(snapshot)', () => {

    it('should filter out wirings for source snapshot', () => {
      const wirings = mod.getWiring(snapshot('A'));
      wirings.subscribe(onNext);
      expect(onNext).to.have.callCount(0);

      emitDummyGraph();

      expect(onNext).to.have.callCount(1);
      const wiredSnapshots = onNext.getCall(0).args[0];
      expect(wiredSnapshots.size).to.equal(2);
      expect(wiredSnapshots.first().get('steadyId')).to.equal('sB');
      expect(wiredSnapshots.last().get('steadyId')).to.equal('sC');
    });

  });

  describe('getWiringWithFullSnapshots', () => {

    it('should retrieve full snapshots', () => {
      const bConveyer = ro.create();
      const cConveyer = ro.create();
      create.onCall(1).returns(bConveyer);
      create.onCall(2).returns(cConveyer);

      const wirings = mod.getWiringWithFullSnapshots(snapshot('A'));
      wirings.subscribe(onNext);
      expect(onNext).to.have.callCount(0);

      emitDummyGraph();

      bConveyer.emit(Immutable.fromJS([{
        pluginId: 'pB',
        steadyId: 'sB',
        hostId: 'hB',
        data: {
          foo: 'B'
        }
      }]));

      cConveyer.emit(Immutable.fromJS([{
        pluginId: 'pC',
        steadyId: 'sC',
        hostId: 'hC',
        data: {
          foo: 'C'
        }
      }]));

      expect(onNext).to.have.callCount(1);
      const edges = onNext.getCall(0).args[0];
      expect(edges.first().getIn(['data', 'foo'])).to.equal('B');
      expect(edges.last().getIn(['data', 'foo'])).to.equal('C');
    });

  });

  function emitDummyGraph() {
    wiringConveyer.emit(Immutable.Map([
      [snapshot('A'), Immutable.Set([snapshot('B'), snapshot('C')])],
      [snapshot('D'), Immutable.Set([snapshot('E')])]
    ]));
  }

  function snapshot(i) {
    return Immutable.fromJS({
      pluginId: 'p' + i,
      hostId: 'h' + i,
      steadyId: 's' + i
    });
  }

});

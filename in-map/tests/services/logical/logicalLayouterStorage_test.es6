/* eslint-env mocha,node */
import { create } from 'reactive-observables';
import proxyquire from 'proxyquire';
import { fromJS } from 'immutable';
import { expect } from 'chai';
import sinon from 'sinon';

describe('layoutingStorage', () => {
  let changePosition;
  let nodePositions;
  let removeId;
  let mod;

  const now = Date.now();
  const testData = {
    node_a: {
      x: 0,
      y: 1,
      z: -1,
      timestamp: now - 1000 * 60 * 60 * 24 * 8 // 1 week and one day
    },
    node_b: {
      x: 0,
      y: 1,
      z: -1,
      timestamp: now
    }
  };
  const nodePositions$ = create().startWith(fromJS(testData)).freeze();

  beforeEach(() => {
    global.Storage = 'test';
    changePosition = sinon.stub();
    removeId = sinon.stub();

    mod = proxyquire('in-map/services/logical/logicalLayouterStorage', {
      'in-map/stores/logical/layouterStore': {
        nodePositions$,
        changePosition,
        removeId
      }
    });

    global.localStorage = {
      setItem() {},
      getItem() {
        return JSON.stringify(testData);
      }
    };
    nodePositions$.subscribe(data => nodePositions = data);

    mod.init();
  });

  it('can load settings from storage', () => {
    const value = nodePositions.get('node_a');
    expect(value).to.not.equal(void 0);
    expect(value.get('x')).to.equal(0);
    expect(value.get('y')).to.equal(1);
    expect(value.get('z')).to.equal(-1);
  });

  it('deletes out of time positions', () => {
    expect(removeId).to.have.callCount(1);
    expect(removeId.getCall(0).args[0]).to.equal('node_a');
  });

  it('sets positions from storage', () => {
    expect(changePosition).to.have.callCount(1);
    expect(changePosition.getCall(0).args[0]).to.equal('node_b');
    expect(changePosition.getCall(0).args[1]).to.equal(0);
    expect(changePosition.getCall(0).args[2]).to.equal(1);
    expect(changePosition.getCall(0).args[3]).to.equal(-1);
  });
});

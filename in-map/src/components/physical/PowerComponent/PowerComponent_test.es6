/* eslint-disable no-unused-expressions */
/* eslint-env mocha, node */
import proxyquire from 'proxyquire';
import immutable from 'immutable';
import RoEmitter from 'roemitter';
import {expect} from 'chai';
import sinon from 'sinon';


const MAX_POSSIBLE_POWER = 3;
const BASE_POWER = 1;

describe('3D map', () => {
  let component;
  let callback;

  const PowerComponent = proxyquire('./PowerComponent.es6', {
    // mock the persistent connection away
    'in-stores/snapshot': {
      getSnapshot: () => {
        return {
          subscribe: sinon.stub()
        };
      }
    },
    'in-sdk/power': {
      getPower: (snapshot) => snapshot.get('_testPower')
    }
  }).default;


  beforeEach(() => {
    const temp = getComponent();
    component = temp.component;
    callback = temp.callback;
  });

  describe('PowerComponent', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(false);
      expect(callback).to.have.callCount(0);
    });

    it('should return the max possible power if there is only one server', () => {
      component.onSnapshotUpdate(getSnapshot(1));
      expect(callback).to.have.callCount(1);
      expect(callback).to.have.been.calledWith(MAX_POSSIBLE_POWER);
    });

    it('', () => {
      component.onSnapshotUpdate(getSnapshot(1));
      expect(callback).to.have.callCount(1);
      expect(callback).to.have.been.calledWith(MAX_POSSIBLE_POWER);


      const temp = getComponent();
      const component2 = temp.component;
      const callback2 = temp.callback;
      component2.onSnapshotUpdate(getSnapshot(3));

      expect(callback).to.have.callCount(2);
      expect(callback).to.have.been.calledWith(
        BASE_POWER + (MAX_POSSIBLE_POWER - BASE_POWER) * (1 / MAX_POSSIBLE_POWER));

      expect(callback2).to.have.callCount(1);
      expect(callback2).to.have.been.calledWith(MAX_POSSIBLE_POWER);
    });

  });

  function getSnapshot(testPower) {
    return immutable.fromJS({
      _testPower: testPower
    });
  }

  function getComponent() {
    const cb = sinon.stub();
    const eventEmitter = new RoEmitter();
    eventEmitter.on('powerChanged').subscribe(cb);

    const sceneObject = {
      eventEmitter: eventEmitter,
      scene: {}
    };
    return {
      component: new PowerComponent({sceneObject}),
      callback: cb
    };
  }

});

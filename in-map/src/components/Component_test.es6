/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
import {expect} from 'chai';
import sinon from 'sinon';
import _ from 'lodash';

import Component from './Component';

function matches(pair, handled) {
  return _.find(handled, pair2 =>
    (pair[0][0] === pair2[0][0] &&
    pair[0][1] === pair2[0][1] &&
    pair[0][2] === pair2[0][2] &&
    pair[0][3] === pair2[0][3])
  );
}

describe('3D map', () => {
  let component;

  beforeEach(() => {
    const so = {scene: {
      renderScene: sinon.stub()
    }};

    component = new Component(so);
    component.onInactiveEnter = sinon.stub();
    component.onInitialEnter = sinon.stub();
    component.onInitialLeave = sinon.stub();
  });

  describe('Component', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(true);
    });

    describe('states', () => {

      it('should contain unique pairs', () => {
        const handled = [];
        const lut = component.stateMachine.stateLookUpTable;
        for (let i = 0; i < lut.length; i++) {
          const pair = lut[i];
          const match = matches(pair, handled);
          handled.push(pair);
          expect(match).to.equal(void 0);
        }
      });

      it('should call init state', () => {
        component.initialized();
        expect(component.onInitialEnter.callCount).to.equal(1);
      });

      it('can switch to inactive state', () => {
        component.initialized();
        component.stateMachine.changeStateProperty('active', false);
        expect(component.onInitialEnter.callCount).to.equal(1);
        expect(component.onInitialLeave.callCount).to.equal(1);
        expect(component.onInactiveEnter.callCount).to.equal(1);
      });

      it('ignore double state property setting', () => {
        component.initialized();

        component.stateMachine.changeStateProperty('active', false);
        expect(component.onInitialEnter.callCount).to.equal(1);
        expect(component.onInitialLeave.callCount).to.equal(1);
        expect(component.onInactiveEnter.callCount).to.equal(1);

        component.stateMachine.changeStateProperty('active', false);
        expect(component.onInitialEnter.callCount).to.equal(1);
        expect(component.onInitialLeave.callCount).to.equal(1);
        expect(component.onInactiveEnter.callCount).to.equal(1);
      });

    });

  });
});

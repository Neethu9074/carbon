/* eslint-env mocha, node */
/* eslint-disable no-unused-expressions */
import {expect} from 'chai';
import sinon from 'sinon';

import {StateMachine, PROPERTY_VALUES} from './StateMachine';


class SpecificSceneObject {
  constructor(params) {
    this.id = params.id;
    this.scene = {renderScene() {} };
    this.stateMachine = new StateMachine(this);
    this.stateMachine.initialized();
  }

  setStartingStateProperties() {
    this.stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
  }

  getOrCreateStub(name) {
    if (!this[name]) {
      this[name] = sinon.stub();
    }
    return this[name];
  }

  onInitialEnter() {this.getOrCreateStub('onInitialEnterStub')(); }
  onInitialLeave() {this.getOrCreateStub('onInitialLeaveStub')(); }
  onHighlightEnter() {this.getOrCreateStub('onHighlightEnterStub')(); }
  onHighlightLeave() {this.getOrCreateStub('onHighlightLeaveStub')(); }
  onSelectedEnter() {this.getOrCreateStub('onSelectedEnterStub')(); }
  onSelectedLeave() {this.getOrCreateStub('onSelectedLeaveStub')(); }
  onInactiveEnter() {this.getOrCreateStub('onInactiveEnterStub')(); }
  onInactiveLeave() {this.getOrCreateStub('onInactiveLeaveStub')(); }
  onSelectedHighlightEnter() {this.getOrCreateStub('onSelectedHighlightEnterStub')(); }
  onSelectedHighlightLeave() {this.getOrCreateStub('onSelectedHighlightLeaveStub')(); }
  onHighlightInactiveEnter() {this.getOrCreateStub('onHighlightInactiveEnterStub')(); }
  onHighlightInactiveLeave() {this.getOrCreateStub('onHighlightInactiveLeaveStub')(); }
  onIndirectHighlightEnter() {this.getOrCreateStub('onIndirectHighlightEnterStub')(); }
  onIndirectHighlightLeave() {this.getOrCreateStub('onIndirectHighlightLeaveStub')(); }
  onSelectedHighlightInactiveEnter() {this.getOrCreateStub('onSelectedHighlightInactiveEnterStub')(); }
  onSelectedHighlightInactiveLeave() {this.getOrCreateStub('onSelectedHighlightInactiveLeaveStub')(); }
}

describe('3D map', () => {
  let stateMachine;
  let sceneObject;

  beforeEach(() => {
    sceneObject = new SpecificSceneObject({id: 0});
    stateMachine = sceneObject.stateMachine;
  });

  describe('StateMachine', () => {

    describe('states', () => {

      it('should cover all possible paths', () => {
        const maxDepth = 5;
        let numChecks = 1;

        const check01 = (lut, depth) => {
          expect(lut[0]).to.not.equal(void 0);
          expect(lut[1]).to.not.equal(void 0);

          if (depth === maxDepth) {
            return;
          }

          numChecks += 1;
          const nextDepth = depth + 1;
          check01(lut[0], nextDepth);
          check01(lut[1], nextDepth);
        };

        const lut = stateMachine.stateLookUpTable;
        check01(lut, 0);

        expect(numChecks).to.equal(Math.pow(2, maxDepth));
      });

      it('should be initial by default', () => {
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);
        expect(sceneObject.onInitialLeaveStub).to.equal(void 0);
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onHighlightLeaveStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedLeaveStub).to.equal(void 0);
        expect(sceneObject.onInactiveEnterStub).to.equal(void 0);
        expect(sceneObject.onInactiveLeaveStub).to.equal(void 0);
        expect(sceneObject.onIndirectHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onIndirectHighlightLeaveStub).to.equal(void 0);
      });

      it('should not do anything if there is no update on state', () => {
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);

        // highlight is false by default so there shouldn't be any update
        stateMachine.changeStateProperty('highlight', PROPERTY_VALUES.OFF);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);
      });

      it('should update to highlighted on highlight', () => {
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);

        stateMachine.changeStateProperty('highlight', PROPERTY_VALUES.ON);
        expect(sceneObject.onHighlightEnterStub.callCount).to.equal(1);

        // no update on double set
        stateMachine.changeStateProperty('highlight', PROPERTY_VALUES.ON);
        expect(sceneObject.onHighlightEnterStub.callCount).to.equal(1);
      });

      it('should update to inital on indirect', () => {
        expect(sceneObject.onIndirectHighlightEnterStub).to.equal(void 0);

        stateMachine.changeStateProperty('indirect', PROPERTY_VALUES.ON);
        expect(sceneObject.onIndirectHighlightEnterStub.callCount).to.equal(1);

        // no update on double set
        stateMachine.changeStateProperty('indirect', PROPERTY_VALUES.ON);
        expect(sceneObject.onIndirectHighlightEnterStub.callCount).to.equal(1);
      });

      it('should update to highlighted and back to initial', () => {
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('highlight', PROPERTY_VALUES.ON);
        expect(sceneObject.onHighlightEnterStub.callCount).to.equal(1);
        expect(sceneObject.onInitialLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('highlight', PROPERTY_VALUES.OFF);
        expect(sceneObject.onHighlightEnterStub.callCount).to.equal(1);
        expect(sceneObject.onHighlightLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(2);
      });

      it('should update to indirect and back to initial', () => {
        expect(sceneObject.onIndirectHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('indirect', PROPERTY_VALUES.ON);
        expect(sceneObject.onIndirectHighlightEnterStub.callCount).to.equal(1);
        expect(sceneObject.onInitialLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('indirect', PROPERTY_VALUES.OFF);
        expect(sceneObject.onIndirectHighlightEnterStub.callCount).to.equal(1);
        expect(sceneObject.onIndirectHighlightLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(2);
      });

      it('should update to selected and back to initial', () => {
        expect(sceneObject.onSelectedEnterStub).to.equal(void 0);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('selected', PROPERTY_VALUES.ON);
        expect(sceneObject.onSelectedEnterStub.callCount).to.equal(1);
        expect(sceneObject.onInitialLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('selected', PROPERTY_VALUES.OFF);
        expect(sceneObject.onSelectedEnterStub.callCount).to.equal(1);
        expect(sceneObject.onSelectedLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(2);
      });

      it('should update to inactive and back to initial', () => {
        expect(sceneObject.onInactiveEnterStub).to.equal(void 0);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
        expect(sceneObject.onInitialLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);
        expect(sceneObject.onInactiveEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
        expect(sceneObject.onInactiveEnterStub.callCount).to.equal(1);
        expect(sceneObject.onInactiveLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(2);
      });

      it('should prefer selected over highlight', () => {
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub).to.equal(void 0);

        stateMachine.changeStateProperty('selected', PROPERTY_VALUES.ON);
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('highlight', PROPERTY_VALUES.ON);
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('selected', PROPERTY_VALUES.OFF);
        expect(sceneObject.onHighlightEnterStub.callCount).to.equal(1);
        expect(sceneObject.onSelectedEnterStub.callCount).to.equal(1);
        expect(sceneObject.onSelectedLeaveStub.callCount).to.equal(1);
      });

      it('should prefer selected over indirect', () => {
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);
        expect(sceneObject.onIndirectHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub).to.equal(void 0);

        stateMachine.changeStateProperty('selected', PROPERTY_VALUES.ON);
        expect(sceneObject.onIndirectHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('indirect', PROPERTY_VALUES.ON);
        expect(sceneObject.onIndirectHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('selected', PROPERTY_VALUES.OFF);
        expect(sceneObject.onIndirectHighlightEnterStub.callCount).to.equal(1);
        expect(sceneObject.onSelectedEnterStub.callCount).to.equal(1);
        expect(sceneObject.onSelectedLeaveStub.callCount).to.equal(1);
      });

      it('should prefer inactive over all', () => {
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub).to.equal(void 0);
        expect(sceneObject.onInactiveEnterStub).to.equal(void 0);

        stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub).to.equal(void 0);
        expect(sceneObject.onInactiveEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('highlight', PROPERTY_VALUES.ON);
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub).to.equal(void 0);
        expect(sceneObject.onInactiveEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('selected', PROPERTY_VALUES.ON);
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub).to.equal(void 0);
        expect(sceneObject.onInactiveEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('indirect', PROPERTY_VALUES.ON);
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub).to.equal(void 0);
        expect(sceneObject.onInactiveEnterStub.callCount).to.equal(1);
      });

    });

  });

});

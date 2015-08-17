/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
import {expect} from 'chai';
import sinon from 'sinon';
import _ from 'lodash';

import StateMachine from './StateMachine';


class SpecificSceneObject {
  constructor(params) {
    this.id = params.id;
    this.scene = {renderScene() {} };
    this.stateMachine = new StateMachine(this);
    this.stateMachine.initialized();
  }

  setStartingStateProperties() {
    this.stateMachine.changeStateProperty('active', true);
  }

  getOrCreateStub(name) {
    if(!this[name]) {
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

function matches(pair, handled) {
  return _.find(handled, pair2 =>
    (pair[0][0] === pair2[0][0] &&
    pair[0][1] === pair2[0][1] &&
    pair[0][2] === pair2[0][2] &&
    pair[0][3] === pair2[0][3] &&
    pair[0][4] === pair2[0][4])
  );
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

      it('should contain unique pairs', () => {
        const handled = [];
        const lut = stateMachine.stateLookUpTable;
        for (let i = 0; i < lut.length; i++) {
          const pair = lut[i];
          const match = matches(pair, handled);
          handled.push(pair);
          expect(match).to.equal(void 0);
        }
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

        //highlight is false by default so there shouldn't be any update
        stateMachine.changeStateProperty('highlight', false);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);
      });

      it('should update to highlighted on highlight', () => {
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);

        stateMachine.changeStateProperty('highlight', true);
        expect(sceneObject.onHighlightEnterStub.callCount).to.equal(1);

        //no update on double set
        stateMachine.changeStateProperty('highlight', true);
        expect(sceneObject.onHighlightEnterStub.callCount).to.equal(1);
      });

      it('should update to inital on indirect', () => {
        expect(sceneObject.onIndirectHighlightEnterStub).to.equal(void 0);

        stateMachine.changeStateProperty('indirect', true);
        expect(sceneObject.onIndirectHighlightEnterStub.callCount).to.equal(1);

        //no update on double set
        stateMachine.changeStateProperty('indirect', true);
        expect(sceneObject.onIndirectHighlightEnterStub.callCount).to.equal(1);
      });

      it('should update to highlighted and back to initial', () => {
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('highlight', true);
        expect(sceneObject.onHighlightEnterStub.callCount).to.equal(1);
        expect(sceneObject.onInitialLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('highlight', false);
        expect(sceneObject.onHighlightEnterStub.callCount).to.equal(1);
        expect(sceneObject.onHighlightLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(2);
      });

      it('should update to indirect and back to initial', () => {
        expect(sceneObject.onIndirectHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('indirect', true);
        expect(sceneObject.onIndirectHighlightEnterStub.callCount).to.equal(1);
        expect(sceneObject.onInitialLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('indirect', false);
        expect(sceneObject.onIndirectHighlightEnterStub.callCount).to.equal(1);
        expect(sceneObject.onIndirectHighlightLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(2);
      });

      it('should update to selected and back to initial', () => {
        expect(sceneObject.onSelectedEnterStub).to.equal(void 0);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('selected', true);
        expect(sceneObject.onSelectedEnterStub.callCount).to.equal(1);
        expect(sceneObject.onInitialLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('selected', false);
        expect(sceneObject.onSelectedEnterStub.callCount).to.equal(1);
        expect(sceneObject.onSelectedLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(2);
      });

      it('should update to inactive and back to initial', () => {
        expect(sceneObject.onInactiveEnterStub).to.equal(void 0);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('active', false);
        expect(sceneObject.onInitialLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);
        expect(sceneObject.onInactiveEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('active', true);
        expect(sceneObject.onInactiveEnterStub.callCount).to.equal(1);
        expect(sceneObject.onInactiveLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialLeaveStub.callCount).to.equal(1);
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(2);
      });

      it('should prefer selected over highlight', () => {
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub).to.equal(void 0);

        stateMachine.changeStateProperty('selected', true);
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('highlight', true);
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('selected', false);
        expect(sceneObject.onHighlightEnterStub.callCount).to.equal(1);
        expect(sceneObject.onSelectedEnterStub.callCount).to.equal(1);
        expect(sceneObject.onSelectedLeaveStub.callCount).to.equal(1);
      });

      it('should prefer selected over indirect', () => {
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);
        expect(sceneObject.onIndirectHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub).to.equal(void 0);

        stateMachine.changeStateProperty('selected', true);
        expect(sceneObject.onIndirectHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('indirect', true);
        expect(sceneObject.onIndirectHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('selected', false);
        expect(sceneObject.onIndirectHighlightEnterStub.callCount).to.equal(1);
        expect(sceneObject.onSelectedEnterStub.callCount).to.equal(1);
        expect(sceneObject.onSelectedLeaveStub.callCount).to.equal(1);
      });

      it('should prefer inactive over all', () => {
        expect(sceneObject.onInitialEnterStub.callCount).to.equal(1);
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub).to.equal(void 0);
        expect(sceneObject.onInactiveEnterStub).to.equal(void 0);

        stateMachine.changeStateProperty('active', false);
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub).to.equal(void 0);
        expect(sceneObject.onInactiveEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('highlight', true);
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub).to.equal(void 0);
        expect(sceneObject.onInactiveEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('selected', true);
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub).to.equal(void 0);
        expect(sceneObject.onInactiveEnterStub.callCount).to.equal(1);

        stateMachine.changeStateProperty('indirect', true);
        expect(sceneObject.onHighlightEnterStub).to.equal(void 0);
        expect(sceneObject.onSelectedEnterStub).to.equal(void 0);
        expect(sceneObject.onInactiveEnterStub.callCount).to.equal(1);
      });

    });

  });

});

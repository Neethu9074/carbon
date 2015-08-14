/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
import _ from 'lodash';

import {expect} from 'chai';
import sinon from 'sinon';

import SceneObject from './index';


class SpecificSceneObject extends SceneObject {
  constructor(params) {
    super(params);

    this.scene = {renderScene() {} };
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
  onIndirectHighlightEnter() {this.getOrCreateStub('onIndirectHighlightEnterStub')(); }
  onIndirectHighlightLeave() {this.getOrCreateStub('onIndirectHighlightLeaveStub')(); }
}

describe('3D map', () => {

  let obj;
  beforeEach(() => {
    obj = new SpecificSceneObject({id: 0});
  });

  describe('SceneObject', () => {

    it('can be disposed', () => {
      obj.dispose();
      expect(obj.subscriptions.length).to.equal(0);
    });

    function matches(pair, handled) {
      return _.find(handled, pair2 =>
        (pair[0][0] === pair2[0][0] &&
        pair[0][1] === pair2[0][1] &&
        pair[0][2] === pair2[0][2] &&
        pair[0][3] === pair2[0][3] &&
        pair[0][4] === pair2[0][4])
      );
    }

    describe('states', () => {

      it('should contain unique pairs', () => {
        const handled = [];
        for (let i = 0; i < obj.stateMachine.getLookUpTable().length; i++) {
          const pair = obj.stateMachine.getLookUpTable()[i];
          const match = matches(pair, handled);
          handled.push(pair);
          expect(match).to.equal(void 0);
        }
      });

      it('should be initial by default', () => {
        expect(obj.onInitialEnterStub.callCount).to.equal(1);
        expect(obj.onInitialLeaveStub).to.equal(void 0);
        expect(obj.onHighlightEnterStub).to.equal(void 0);
        expect(obj.onHighlightLeaveStub).to.equal(void 0);
        expect(obj.onSelectedEnterStub).to.equal(void 0);
        expect(obj.onSelectedLeaveStub).to.equal(void 0);
        expect(obj.onInactiveEnterStub).to.equal(void 0);
        expect(obj.onInactiveLeaveStub).to.equal(void 0);
        expect(obj.onIndirectHighlightEnterStub).to.equal(void 0);
        expect(obj.onIndirectHighlightLeaveStub).to.equal(void 0);
      });

      it('should not do anything if there is no update on state', () => {
        expect(obj.onInitialEnterStub.callCount).to.equal(1);

        //mouseOver is false by default so there shouldn't be any update
        obj.stateMachine.changeStateProperty('mouseOver', false);
        expect(obj.onInitialEnterStub.callCount).to.equal(1);
      });

      it('should update to highlighted on mouseOver', () => {
        expect(obj.onHighlightEnterStub).to.equal(void 0);

        obj.stateMachine.changeStateProperty('mouseOver', true);
        expect(obj.onHighlightEnterStub.callCount).to.equal(1);

        //no update on double set
        obj.stateMachine.changeStateProperty('mouseOver', true);
        expect(obj.onHighlightEnterStub.callCount).to.equal(1);
      });

      it('should update to inital on indirect', () => {
        expect(obj.onIndirectHighlightEnterStub).to.equal(void 0);

        obj.stateMachine.changeStateProperty('indirect', true);
        expect(obj.onIndirectHighlightEnterStub.callCount).to.equal(1);

        //no update on double set
        obj.stateMachine.changeStateProperty('indirect', true);
        expect(obj.onIndirectHighlightEnterStub.callCount).to.equal(1);
      });

      it('should update to highlighted and back to initial', () => {
        expect(obj.onHighlightEnterStub).to.equal(void 0);
        expect(obj.onInitialEnterStub.callCount).to.equal(1);

        obj.stateMachine.changeStateProperty('mouseOver', true);
        expect(obj.onHighlightEnterStub.callCount).to.equal(1);
        expect(obj.onInitialLeaveStub.callCount).to.equal(1);
        expect(obj.onInitialEnterStub.callCount).to.equal(1);

        obj.stateMachine.changeStateProperty('mouseOver', false);
        expect(obj.onHighlightEnterStub.callCount).to.equal(1);
        expect(obj.onHighlightLeaveStub.callCount).to.equal(1);
        expect(obj.onInitialLeaveStub.callCount).to.equal(1);
        expect(obj.onInitialEnterStub.callCount).to.equal(2);
      });

      it('should update to indirect and back to initial', () => {
        expect(obj.onIndirectHighlightEnterStub).to.equal(void 0);
        expect(obj.onInitialEnterStub.callCount).to.equal(1);

        obj.stateMachine.changeStateProperty('indirect', true);
        expect(obj.onIndirectHighlightEnterStub.callCount).to.equal(1);
        expect(obj.onInitialLeaveStub.callCount).to.equal(1);
        expect(obj.onInitialEnterStub.callCount).to.equal(1);

        obj.stateMachine.changeStateProperty('indirect', false);
        expect(obj.onIndirectHighlightEnterStub.callCount).to.equal(1);
        expect(obj.onIndirectHighlightLeaveStub.callCount).to.equal(1);
        expect(obj.onInitialLeaveStub.callCount).to.equal(1);
        expect(obj.onInitialEnterStub.callCount).to.equal(2);
      });

      it('should update to selected and back to initial', () => {
        expect(obj.onSelectedEnterStub).to.equal(void 0);
        expect(obj.onInitialEnterStub.callCount).to.equal(1);

        obj.stateMachine.changeStateProperty('selected', true);
        expect(obj.onSelectedEnterStub.callCount).to.equal(1);
        expect(obj.onInitialLeaveStub.callCount).to.equal(1);
        expect(obj.onInitialEnterStub.callCount).to.equal(1);

        obj.stateMachine.changeStateProperty('selected', false);
        expect(obj.onSelectedEnterStub.callCount).to.equal(1);
        expect(obj.onSelectedLeaveStub.callCount).to.equal(1);
        expect(obj.onInitialLeaveStub.callCount).to.equal(1);
        expect(obj.onInitialEnterStub.callCount).to.equal(2);
      });

      it('should update to inactive and back to initial', () => {
        expect(obj.onInactiveEnterStub).to.equal(void 0);
        expect(obj.onInitialEnterStub.callCount).to.equal(1);

        obj.stateMachine.changeStateProperty('active', false);
        expect(obj.onInitialLeaveStub.callCount).to.equal(1);
        expect(obj.onInitialEnterStub.callCount).to.equal(1);
        expect(obj.onInactiveEnterStub.callCount).to.equal(1);

        obj.stateMachine.changeStateProperty('active', true);
        expect(obj.onInactiveEnterStub.callCount).to.equal(1);
        expect(obj.onInactiveLeaveStub.callCount).to.equal(1);
        expect(obj.onInitialLeaveStub.callCount).to.equal(1);
        expect(obj.onInitialEnterStub.callCount).to.equal(2);
      });

      it('should prefer selected over highlight', () => {
        expect(obj.onInitialEnterStub.callCount).to.equal(1);
        expect(obj.onHighlightEnterStub).to.equal(void 0);
        expect(obj.onSelectedEnterStub).to.equal(void 0);

        obj.stateMachine.changeStateProperty('selected', true);
        expect(obj.onHighlightEnterStub).to.equal(void 0);
        expect(obj.onSelectedEnterStub.callCount).to.equal(1);

        obj.stateMachine.changeStateProperty('mouseOver', true);
        expect(obj.onHighlightEnterStub).to.equal(void 0);
        expect(obj.onSelectedEnterStub.callCount).to.equal(1);

        obj.stateMachine.changeStateProperty('selected', false);
        expect(obj.onHighlightEnterStub.callCount).to.equal(1);
        expect(obj.onSelectedEnterStub.callCount).to.equal(1);
        expect(obj.onSelectedLeaveStub.callCount).to.equal(1);
      });

      it('should prefer selected over indirect', () => {
        expect(obj.onInitialEnterStub.callCount).to.equal(1);
        expect(obj.onIndirectHighlightEnterStub).to.equal(void 0);
        expect(obj.onSelectedEnterStub).to.equal(void 0);

        obj.stateMachine.changeStateProperty('selected', true);
        expect(obj.onIndirectHighlightEnterStub).to.equal(void 0);
        expect(obj.onSelectedEnterStub.callCount).to.equal(1);

        obj.stateMachine.changeStateProperty('indirect', true);
        expect(obj.onIndirectHighlightEnterStub).to.equal(void 0);
        expect(obj.onSelectedEnterStub.callCount).to.equal(1);

        obj.stateMachine.changeStateProperty('selected', false);
        expect(obj.onIndirectHighlightEnterStub.callCount).to.equal(1);
        expect(obj.onSelectedEnterStub.callCount).to.equal(1);
        expect(obj.onSelectedLeaveStub.callCount).to.equal(1);
      });

      it('should prefer inactive over all', () => {
        expect(obj.onInitialEnterStub.callCount).to.equal(1);
        expect(obj.onHighlightEnterStub).to.equal(void 0);
        expect(obj.onSelectedEnterStub).to.equal(void 0);
        expect(obj.onInactiveEnterStub).to.equal(void 0);

        obj.stateMachine.changeStateProperty('active', false);
        expect(obj.onHighlightEnterStub).to.equal(void 0);
        expect(obj.onSelectedEnterStub).to.equal(void 0);
        expect(obj.onInactiveEnterStub.callCount).to.equal(1);

        obj.stateMachine.changeStateProperty('mouseOver', true);
        expect(obj.onHighlightEnterStub).to.equal(void 0);
        expect(obj.onSelectedEnterStub).to.equal(void 0);
        expect(obj.onInactiveEnterStub.callCount).to.equal(1);

        obj.stateMachine.changeStateProperty('selected', true);
        expect(obj.onHighlightEnterStub).to.equal(void 0);
        expect(obj.onSelectedEnterStub).to.equal(void 0);
        expect(obj.onInactiveEnterStub.callCount).to.equal(1);

        obj.stateMachine.changeStateProperty('indirect', true);
        expect(obj.onHighlightEnterStub).to.equal(void 0);
        expect(obj.onSelectedEnterStub).to.equal(void 0);
        expect(obj.onInactiveEnterStub.callCount).to.equal(1);
      });

    });

  });

});

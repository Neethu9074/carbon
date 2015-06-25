/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import _ from 'lodash';
import THREE from 'three';
import {expect, assert} from 'chai';

import {setupStates} from './index';


describe('3D map', () => {

  describe('states.baseNode', () => {

    let baseNode;
    beforeEach(() => {
      baseNode = {
        switchStateIfNext(action) {
          const next = this.state.getNext(action);
          if(next){
            this.state.leave();
            this.state = next;
            this.state.enter();
          }
        },
        setHighlight() {},
        clearHighlight() {},
        selectNode() {},
        clearNode() {}
      };
      baseNode.states = setupStates(baseNode);
      baseNode.state = baseNode.states.initial;
    });

    it('should set to initial', () => {
      expect(baseNode.state).to.equal(baseNode.states.initial);
    });

    it('should switch to highlighted', () => {
      expect(baseNode.state).to.equal(baseNode.states.initial);
      baseNode.switchStateIfNext({highlighted: true});
      expect(baseNode.state).to.equal(baseNode.states.highlighted);
    });

    it('should not switch state', () => {
      expect(baseNode.state).to.equal(baseNode.states.initial);
      baseNode.switchStateIfNext({highlighted: true});
      expect(baseNode.state).to.equal(baseNode.states.highlighted);
      baseNode.switchStateIfNext({highlighted: true});
      expect(baseNode.state).to.equal(baseNode.states.highlighted);
    });

    it('should switch state to initial', () => {
      expect(baseNode.state).to.equal(baseNode.states.initial);
      baseNode.switchStateIfNext({highlighted: true});
      expect(baseNode.state).to.equal(baseNode.states.highlighted);
      baseNode.switchStateIfNext({highlighted: false});
      expect(baseNode.state).to.equal(baseNode.states.initial);
    });

    it('should switch from highlighted to selected', () => {
      expect(baseNode.state).to.equal(baseNode.states.initial);
      baseNode.switchStateIfNext({highlighted: true});
      expect(baseNode.state).to.equal(baseNode.states.highlighted);
      baseNode.switchStateIfNext({onClick: true});
      expect(baseNode.state).to.equal(baseNode.states.selected);
    });

    it('should switch from selected to initial', () => {
      expect(baseNode.state).to.equal(baseNode.states.initial);
      baseNode.switchStateIfNext({highlighted: true});
      expect(baseNode.state).to.equal(baseNode.states.highlighted);
      baseNode.switchStateIfNext({onClick: true});
      expect(baseNode.state).to.equal(baseNode.states.selected);
      baseNode.switchStateIfNext({onClick: true});
      expect(baseNode.state).to.equal(baseNode.states.initial);
    });

    it('should switch from selected to highlighted', () => {
      expect(baseNode.state).to.equal(baseNode.states.initial);
      baseNode.switchStateIfNext({highlighted: true});
      expect(baseNode.state).to.equal(baseNode.states.highlighted);
      baseNode.switchStateIfNext({onClick: true});
      expect(baseNode.state).to.equal(baseNode.states.selected);
      baseNode.switchStateIfNext({onClick: true, highlighted: true});
      expect(baseNode.state).to.equal(baseNode.states.highlighted);
    });

  });
});

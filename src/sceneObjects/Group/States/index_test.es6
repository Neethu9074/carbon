/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import {expect} from 'chai';

import {setupStates} from './index';


describe('3D map', () => {

  describe('states.ground', () => {

    let ground;
    beforeEach(() => {
      ground = {
        switchStateIfNext(action) {
          const next = this.state.getNext(action);
          if(next){
            this.state.leave();
            this.state = next;
            this.state.enter();
          }
        }
      };
      ground.states = setupStates(ground);
      ground.state = ground.states.initial;
    });

    it('set to initial', () => {
      expect(ground.state).to.equal(ground.states.initial);
    });

    it('should switch to highlighted', () => {
      expect(ground.state).to.equal(ground.states.initial);
      ground.switchStateIfNext({highlighted: true});
      expect(ground.state).to.equal(ground.states.highlighted);
    });

  });
});

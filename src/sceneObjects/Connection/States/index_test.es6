/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import _ from 'lodash';
import THREE from 'three';
import {expect, assert} from 'chai';

import {setupStates} from './index';


describe('3D map', () => {

  describe('states.connection', () => {

    let connection;
    beforeEach(() => {
      connection = {
        switchStateIfNext(action) {
          const next = this.state.getNext(action);
          if(next){
            this.state.leave();
            this.state = next;
            this.state.enter();
          }
        }
      };
      connection.states = setupStates(connection);
      connection.state = connection.states.initial;
    });

    it('set to initial', () => {
      expect(connection.state).to.equal(connection.states.initial);
    });

    it('should switch to highlighted', () => {
      expect(connection.state).to.equal(connection.states.initial);
      connection.switchStateIfNext({highlighted: true});
      expect(connection.state).to.equal(connection.states.highlighted);
    });

    it('should not switch state', () => {
      expect(connection.state).to.equal(connection.states.initial);
      connection.switchStateIfNext({highlighted: true});
      expect(connection.state).to.equal(connection.states.highlighted);
      connection.switchStateIfNext({highlighted: true});
      expect(connection.state).to.equal(connection.states.highlighted);
    });

    it('should switch state to initial', () => {
      expect(connection.state).to.equal(connection.states.initial);
      connection.switchStateIfNext({highlighted: true});
      expect(connection.state).to.equal(connection.states.highlighted);
      connection.switchStateIfNext({highlighted: false});
      expect(connection.state).to.equal(connection.states.initial);
    });

  });
});

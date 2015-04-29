/*eslint-env mocha*/

'use strict';

import sinon from 'sinon';
import {expect} from 'chai';
import Immutable from 'immutable';

import {addMapping, getHealth, health} from './index';

const os = 'com.instana.forge.infrastructure.os.OS';

describe('health', () => {

  describe('addMapping', () => {
    it('should successfully add mappings', () => {
      addMapping(os, (a) => a);
    });
  });

  describe('get health', () => {
    let snapshot;

    beforeEach(() => {
      snapshot = Immutable.fromJS({
        pluginId: os
      });
    });

    it('should fail when no healthProvider is registered', () => {
      snapshot = snapshot.set('pluginId', 'you dont know me!');
      expect(() => getHealth(snapshot)).to.throw(Error);
    });

    it('should call corresponding health providers', () => {
      const healthProvider = sinon.stub();
      healthProvider.onFirstCall().returns(health.warning);
      addMapping(os, healthProvider);

      expect(getHealth(snapshot)).to.equal(health.warning);
      expect(healthProvider.calledOnce).to.equal(true);
    });

    it('should fail when no health provider exists', () => {
      snapshot = snapshot.set('pluginId', 'unknown');
      expect(() => getHealth(snapshot)).to.throw(Error);
    });

  });

});

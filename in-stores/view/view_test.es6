/* eslint-env mocha, node */

import { create } from 'reactive-observables';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import sinon from 'sinon';

import { resetStoreRegistry } from 'in-stores/store';

describe('stores.view', () => {
  let mod;
  let onNext;

  beforeEach(() => {
    resetStoreRegistry();

    onNext = sinon.stub();
    mod = null;
  });

  describe('onLoad', () => {
    it('should use the physical view by default when nothing else is specified', () => {
      setHash('');
      loadModule();

      mod.view.subscribe(onNext);

      expect(onNext).to.have.callCount(1);
      expect(onNext).to.have.been.calledWith(mod.types.physical);
    });

    it('should use the physical view if URL defined view does not exist', () => {
      setHash('#/?view=undefinedView');
      loadModule();

      mod.view.subscribe(onNext);

      expect(onNext).to.have.callCount(1);
      expect(onNext).to.have.been.calledWith(mod.types.physical);
    });
  });

  function loadModule() {
    mod = proxyquire('./view', {
      'in-services/subscription/view': () => create().startWith(true)
    });
  }

  function setHash(hash) {
    global.window = {
      location: {
        hash
      }
    };
  }
});

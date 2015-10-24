/* eslint-env mocha, node */

import proxyquire from 'proxyquire';
import sinon from 'sinon';
import {expect} from 'chai';

import {resetStoreRegistry} from './store';
import * as views from '../views';

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
      expect(onNext).to.have.been.calledWith(views.physical);
    });

    it('should use the process view as initial view if specified', () => {
      setHash('#/?view=' + views.process);
      loadModule();

      mod.view.subscribe(onNext);

      expect(onNext).to.have.callCount(1);
      expect(onNext).to.have.been.calledWith(views.process);
    });

    it('should use the physical view if URL defined view does not exist', () => {
      setHash('#/?view=undefinedView');
      loadModule();

      mod.view.subscribe(onNext);

      expect(onNext).to.have.callCount(1);
      expect(onNext).to.have.been.calledWith(views.physical);
    });

    it('should use the process view if defined with multiple other parameters', () => {
      setHash('#/?sPluginId=foo&view=' + views.process + '&sHostId=bar');
      loadModule();

      mod.view.subscribe(onNext);

      expect(onNext).to.have.callCount(1);
      expect(onNext).to.have.been.calledWith(views.process);
    });
  });

  function loadModule() {
    mod = proxyquire('./view', {});
  }

  function setHash(hash) {
    global.window = {
      location: {
        hash
      }
    };
  }

});

/* eslint-env mocha, node */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';


describe('stores.view', () => {

  let onKeyPressed;
  let onNext;
  let mod;

  beforeEach(() => {
    loadModule();

    mod.clearRegristry();
    onNext = sinon.stub();
  });

  describe('shortcuts', () => {

    it('should call registered callbacks', () => {
      mod.registerShortcut(mod.KEY_CODES.ESC, onNext);
      expect(onNext).to.have.callCount(0);

      pressKey(mod.KEY_CODES.ESC);
      expect(onNext).to.have.callCount(1);
    });

    it('can register und unregister different callbacks', () => {
      mod.registerShortcut(mod.KEY_CODES.ESC, onNext);
      expect(onNext).to.have.callCount(0);

      const onNext2 = sinon.stub();
      mod.registerShortcut(mod.KEY_CODES.ESC, onNext2);
      expect(onNext2).to.have.callCount(0);

      pressKey(mod.KEY_CODES.ESC);
      expect(onNext).to.have.callCount(1);
      expect(onNext2).to.have.callCount(1);

      mod.unregisterShortcut(mod.KEY_CODES.ESC, onNext2);

      pressKey(mod.KEY_CODES.ESC);
      expect(onNext).to.have.callCount(2);
      expect(onNext2).to.have.callCount(1);
    });

  });

  function loadModule() {
    onKeyPressed = create();

    mod = proxyquire('in-stores/shortcuts', {
      'reactive-observables': {
        on: () => onKeyPressed
      }
    });
    mod.init();
  }

  function pressKey(keyCode) {
    onKeyPressed.emit({keyCode});
  }
});

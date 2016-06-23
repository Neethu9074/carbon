/* eslint-env mocha, node */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import {isOpen$} from 'in-components/notificationCenter/Flyout/stores/visibilityStore';


describe('shortcuts/dashboard', () => {

  let isOpenSubscription;
  let onKeyPressed;
  let onUnregister;
  let onRegister;
  let shortcuts;
  let isOpen;
  let mod;

  beforeEach(() => {
    loadModules();

    isOpen = sinon.stub();
    isOpenSubscription = isOpen$.subscribe(isOpen);
  });

  afterEach(() => {
    isOpenSubscription.dispose();
  });

  it('should always register because NC is omni-present', () => {
    onRegister = sinon.stub();
    onUnregister = sinon.stub();
    mod.register(onRegister, onUnregister, shortcuts.KEY_CODES);

    expect(onRegister).to.have.callCount(1);
    expect(onUnregister).to.have.callCount(0);
  });

  it('should toggle NC flyout when n was pressed', () => {
    expect(isOpen).to.have.callCount(1);
    expect(isOpen.getCall(0).args[0]).to.equal(false);

    onKeyPressed.emit({keyCode: shortcuts.KEY_CODES.N});
    expect(isOpen).to.have.callCount(2);
    expect(isOpen.getCall(1).args[0]).to.equal(true);
  });

  function loadModules() {
    mod = proxyquire('in-services/shortcuts/shortcuts/notificationCenterFlyout', {});

    onKeyPressed = create();
    shortcuts = proxyquire('in-services/shortcuts', {
      'reactive-observables': {
        on: () => onKeyPressed
      }
    });
    shortcuts.init();
  }
});

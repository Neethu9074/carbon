/* eslint-env mocha, node */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import {isOpen$} from 'in-components/notificationCenter/Flyout/stores/visibilityStore';


describe('shortcuts/N', () => {

  let isOpenSubscription;
  let onKeyPressed;
  let shortcuts;
  let isOpen;

  beforeEach(() => {
    loadModules();

    isOpen = sinon.stub();
    isOpenSubscription = isOpen$.subscribe(isOpen);
  });

  afterEach(() => {
    isOpenSubscription.dispose();
  });

  it('should toggle NC flyout when N was pressed', () => {
    expect(isOpen).to.have.callCount(1);
    expect(isOpen.getCall(0).args[0]).to.equal(false);

    onKeyPressed.emit({keyCode: shortcuts.KEY_CODES.N});
    expect(isOpen).to.have.callCount(2);
    expect(isOpen.getCall(1).args[0]).to.equal(true);
  });

  function loadModules() {
    onKeyPressed = create();
    shortcuts = proxyquire('in-services/shortcuts', {
      'reactive-observables': {
        on: () => onKeyPressed
      },
      'in-stores/shortcuts': {
        shortcutsAreActive$: create().startWith(true)
      }
    });
    shortcuts.init();
  }
});

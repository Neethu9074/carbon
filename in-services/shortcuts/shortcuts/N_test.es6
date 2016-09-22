/* eslint-env mocha, node */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import {activeControl$} from 'in-components/RightSidebar/stores/rightSidebarActiveControlStore';
import {CONTROL_TYPES} from 'in-components/RightSidebar/stores/rightSidebarActiveControlStore';
import keyCodes from 'in-components/keyCodes';


describe('shortcuts/N', () => {

  let activeControlSubscription;
  let onKeyPressed;
  let shortcuts;
  let activeControl;

  beforeEach(() => {
    loadModules();

    activeControl = sinon.stub();
    activeControlSubscription = activeControl$.subscribe(activeControl);
  });

  afterEach(() => {
    activeControlSubscription.dispose();
  });

  it('should toggle NC flyout when N was pressed', () => {
    expect(activeControl).to.have.callCount(1);
    expect(activeControl.getCall(0).args[0]).to.equal(null);

    pressN();

    expect(activeControl).to.have.callCount(2);
    expect(activeControl.getCall(1).args[0]).to.equal(CONTROL_TYPES.NOTIFICATIONS);
  });

  function pressN() {
    onKeyPressed.emit({
      keyCode: keyCodes.n,
      target: {
        tagName: ''
      }
    });
  }

  function loadModules() {
    onKeyPressed = create();
    shortcuts = proxyquire('in-services/shortcuts', {
      'reactive-observables': {
        on: () => onKeyPressed
      }
    });
    shortcuts.init();
  }
});

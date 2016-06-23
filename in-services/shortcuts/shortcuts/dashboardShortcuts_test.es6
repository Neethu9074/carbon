/* eslint-env mocha, node */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import {resetStoreRegistry} from 'in-stores/store';
import {PATH_NAMES} from 'in-stores/navigation';
import {createStore} from 'in-stores/store';


describe('shortcuts/dashboard', () => {

  let paramsSubscription;
  let onKeyPressed;
  let onUnregister;
  let onRegister;
  let shortcuts;
  let params;

  let navigationParametersStore;
  let navigationMock;
  let mod;

  beforeEach(() => {
    resetStoreRegistry();
    loadModules();

    params = sinon.stub();
    paramsSubscription = navigationMock.navigationParameters$.subscribe(params);
  });

  afterEach(() => {
    paramsSubscription.dispose();
  });

  it('should only register when dashboard is open', () => {
    onRegister = sinon.stub();
    onUnregister = sinon.stub();
    mod.register(onRegister, onUnregister, shortcuts.KEY_CODES);

    expect(onRegister).to.have.callCount(0);
    expect(onUnregister).to.have.callCount(1);

    navigationMock.goHome();
    expect(onRegister).to.have.callCount(0);
    expect(onUnregister).to.have.callCount(1);

    navigationMock.goToDashboard();
    expect(onRegister).to.have.callCount(1);
    expect(onUnregister).to.have.callCount(1);

    navigationMock.goHome();
    expect(onRegister).to.have.callCount(1);
    expect(onUnregister).to.have.callCount(2);
  });

  it('should close dashboard when open and esc pressed', () => {
    mod.register(shortcuts.registerShortcut, shortcuts.unregisterShortcut, shortcuts.KEY_CODES);

    // initial call
    expect(params).to.have.callCount(1);

    navigationMock.goToDashboard();

    // dashboard was opened
    expect(params).to.have.callCount(2);
    expect(params.getCall(1).args[0].pathname).to.equal(PATH_NAMES.DASHBOARD);

    onKeyPressed.emit({keyCode: shortcuts.KEY_CODES.ESC});
    // dashboard was closed
    expect(params).to.have.callCount(3);
    expect(params.getCall(2).args[0].pathname).to.equal(PATH_NAMES.HOME);
  });

  function loadModules() {
    navigationParametersStore = createStore({
      name: 'navigationTestStore',
      initialValue: {
        pathname: '/',
        query: {}
      }
    });

    navigationMock = {
      goHome: () => navigationParametersStore.applyStateMutation(oldParams => {
        oldParams.pathname = PATH_NAMES.HOME;
        return oldParams;
      }),
      goToDashboard: () => navigationParametersStore.applyStateMutation(oldParams => {
        oldParams.pathname = PATH_NAMES.DASHBOARD;
        return oldParams;
      }),
      goToMap: () => navigationParametersStore.applyStateMutation(oldParams => {
        oldParams.pathname = PATH_NAMES.MAP;
        return oldParams;
      }),
      navigationParameters$: navigationParametersStore.observable
    };

    mod = proxyquire('in-services/shortcuts/shortcuts/dashboardShortcuts', {
      'in-stores/navigation': navigationMock
    });

    onKeyPressed = create();
    shortcuts = proxyquire('in-services/shortcuts', {
      'reactive-observables': {
        on: () => onKeyPressed
      }
    });
    shortcuts.init();
  }
});

/* eslint-env mocha, node */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import {resetStoreRegistry} from 'in-stores/store';
import {PATH_NAMES} from 'in-stores/navigation';
import {createStore} from 'in-stores/store';


describe('shortcuts/dashboard', () => {

  let onKeyPressed;
  let onUnregister;
  let onRegister;
  let shortcuts;

  let selectedSnapshotSubscription;
  let navigationParametersStore;
  let selectedSnapshotStore;
  let selectedSnapshotIdStub;
  let navigationMock;
  let mod;

  beforeEach(() => {
    resetStoreRegistry();
    loadModules();

    selectedSnapshotIdStub = sinon.stub();
    selectedSnapshotSubscription = selectedSnapshotStore.observable.subscribe(selectedSnapshotIdStub);
  });

  afterEach(() => {
    selectedSnapshotSubscription.dispose();
  });

  it('should only register when dashboard is closed and snapshotId is selected', () => {
    onRegister = sinon.stub();
    onUnregister = sinon.stub();
    mod.register(onRegister, onUnregister, shortcuts.KEY_CODES);

    expect(onRegister).to.have.callCount(0);
    expect(onUnregister).to.have.callCount(1);

    navigationMock.goToDashboard();
    expect(onRegister).to.have.callCount(0);
    expect(onUnregister).to.have.callCount(1);

    navigationMock.goToMap();
    expect(onRegister).to.have.callCount(0);
    expect(onUnregister).to.have.callCount(1);

    navigationMock.setSnapshotId('testId');
    expect(onRegister).to.have.callCount(1);
    expect(onUnregister).to.have.callCount(1);

    navigationMock.goToDashboard();
    expect(onRegister).to.have.callCount(1);
    expect(onUnregister).to.have.callCount(2);

    navigationMock.goToMap();
    expect(onRegister).to.have.callCount(2);
    expect(onUnregister).to.have.callCount(2);

    navigationMock.setSnapshotId(null);
    expect(onRegister).to.have.callCount(2);
    expect(onUnregister).to.have.callCount(3);
  });

  it('should remove snapshotId from URL', () => {
    mod.register(shortcuts.registerShortcut, shortcuts.unregisterShortcut, shortcuts.KEY_CODES);

    // initial call
    expect(selectedSnapshotIdStub).to.have.callCount(1);

    navigationMock.goToMap();
    navigationMock.setSnapshotId('testId');

    onKeyPressed.emit({keyCode: shortcuts.KEY_CODES.ESC});

    // snapshot was deleted
    expect(selectedSnapshotIdStub).to.have.callCount(2);
    expect(selectedSnapshotIdStub.getCall(1).args[0]).to.equal(null);
  });

  function loadModules() {
    navigationParametersStore = createStore({
      name: 'navigationTestStore',
      initialValue: {
        pathname: '/',
        query: {}
      }
    });

    selectedSnapshotStore = createStore({
      name: 'selectedSnapshotTestStore',
      initialValue: null
    });

    navigationMock = {
      goToDashboard: () => navigationParametersStore.applyStateMutation(oldParams => {
        oldParams.pathname = PATH_NAMES.DASHBOARD;
        return oldParams;
      }),
      goToMap: () => navigationParametersStore.applyStateMutation(oldParams => {
        oldParams.pathname = PATH_NAMES.MAP;
        return oldParams;
      }),
      setSnapshotId: id => navigationParametersStore.applyStateMutation(oldParams => {
        id ? oldParams.query.snapshotId = id : delete oldParams.query.snapshotId;
        return oldParams;
      }),
      navigationParameters$: navigationParametersStore.observable,
      PATH_NAMES
    };

    mod = proxyquire('in-services/shortcuts/shortcuts/sidebarShortcuts', {
      'in-stores/navigation': navigationMock,
      'in-stores/snapshot': {
        clearSelectedSnapshotId: () => selectedSnapshotStore.applyStateMutation(() => null)
      }
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

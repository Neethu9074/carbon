/* eslint-env mocha, node */
import { create } from 'reactive-observables';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import sinon from 'sinon';

import { resetStoreRegistry } from 'in-stores/store';
import { PATH_NAMES } from 'in-stores/navigation';
import keyCodes from 'in-components/keyCodes';
import { createStore } from 'in-stores/store';

describe('shortcuts/dashboard', () => {
  let onKeyPressed;
  let shortcuts;

  let navigationParametersSubscription;
  let selectedSnapshotSubscription;
  let navigationParametersStore;
  let navigationParametersStub;

  let filerDialogStore;
  let filterDialogSubscription;
  let filerDialogStub;
  let filerDialogMock;

  let selectedSnapshotIdStub;
  let selectedSnapshotStore;
  let navigationMock;

  beforeEach(() => {
    resetStoreRegistry();
    loadModules();

    selectedSnapshotIdStub = sinon.stub();
    selectedSnapshotSubscription = selectedSnapshotStore.observable.subscribe(selectedSnapshotIdStub);

    filerDialogStub = sinon.stub();
    filterDialogSubscription = filerDialogStore.observable.subscribe(filerDialogStub);

    navigationParametersStub = sinon.stub();
    navigationParametersSubscription = navigationParametersStore.observable.subscribe(navigationParametersStub);
  });

  afterEach(() => {
    selectedSnapshotSubscription.dispose();
    navigationParametersSubscription.dispose();
    filterDialogSubscription.dispose();
  });

  it('should remove snapshotId from URL', () => {
    // initial call
    expect(selectedSnapshotIdStub).to.have.callCount(1);

    navigationMock.goToRootOfView();
    navigationMock.setSnapshotId('testId');

    pressEscape();

    // snapshot was deleted
    expect(selectedSnapshotIdStub).to.have.callCount(2);
    expect(selectedSnapshotIdStub.getCall(1).args[0]).to.equal(null);
  });

  it('should close the filter dialog if visible', () => {
    // initial call
    expect(filerDialogStub).to.have.callCount(1);

    pressEscape();

    expect(filerDialogStub).to.have.callCount(2);
    expect(filerDialogStub.getCall(1).args[0]).to.equal(false);
  });

  it('should close dashboard first and then sidebar', () => {
    // initial call
    expect(selectedSnapshotIdStub).to.have.callCount(1);
    expect(navigationParametersStub).to.have.callCount(1);

    navigationMock.goToDashboard();
    expect(navigationParametersStub).to.have.callCount(2);

    navigationMock.setSnapshotId('testId');
    expect(navigationParametersStub).to.have.callCount(3);

    pressEscape();
    expect(selectedSnapshotIdStub).to.have.callCount(1);
    expect(navigationParametersStub).to.have.callCount(4);
    expect(navigationParametersStub.getCall(1).args[0].pathname).to.equal(PATH_NAMES.MAP);

    pressEscape();
    expect(selectedSnapshotIdStub).to.have.callCount(2);
    expect(selectedSnapshotIdStub.getCall(1).args[0]).to.equal(null);
  });

  function pressEscape() {
    onKeyPressed.emit({
      keyCode: keyCodes.escape,
      target: {
        tagName: ''
      }
    });
  }

  function loadModules() {
    navigationParametersStore = createStore({
      name: 'navigationTestStore',
      initialValue: {
        pathname: PATH_NAMES.HOME,
        query: {}
      }
    });

    selectedSnapshotStore = createStore({
      name: 'selectedSnapshotTestStore',
      initialValue: null
    });

    filerDialogStore = createStore({
      name: 'filterTestStore',
      initialValue: true
    });

    navigationMock = {
      goToDashboard: () =>
        navigationParametersStore.applyStateMutation(oldParams => {
          oldParams.pathname = PATH_NAMES.DASHBOARD;
          return oldParams;
        }),
      goToRootOfView: () =>
        navigationParametersStore.applyStateMutation(oldParams => {
          oldParams.pathname = PATH_NAMES.MAP;
          return oldParams;
        }),
      setSnapshotId: id =>
        navigationParametersStore.applyStateMutation(oldParams => {
          id ? (oldParams.query.snapshotId = id) : delete oldParams.query.snapshotId;
          return oldParams;
        }),
      navigationParameters$: navigationParametersStore.observable,
      PATH_NAMES
    };

    filerDialogMock = {
      togglePresets: () => {
        filerDialogStore.applyStateMutation(() => false);
      },
      presetsVisible$: filerDialogStore.observable
    };

    const mod = proxyquire('in-services/shortcuts/shortcuts/Esc', {
      'in-stores/navigation': navigationMock,
      'in-components/SearchBar/stores/presetsVisibility': filerDialogMock,
      'in-stores/snapshot': {
        clearSelectedSnapshotId: () => selectedSnapshotStore.applyStateMutation(() => null)
      }
    });

    onKeyPressed = create();
    shortcuts = proxyquire('in-services/shortcuts', {
      'reactive-observables': {
        on: () => onKeyPressed
      },
      'in-services/shortcuts/shortcuts/Esc': mod
    });
    shortcuts.init();
  }
});

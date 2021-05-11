/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest, node */
import { create } from '@instana/observables';
import { expect } from 'chai';
import sinon from 'sinon';

import { homePath } from 'in-stores/navigation/paths/mainPaths';
import { resetStoreRegistry } from 'in-stores/store';
import keyCodes from 'in-components/keyCodes';

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
    jest.resetModules();
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
    expect(navigationParametersStub.getCall(1).args[0].pathname).to.equal(homePath);

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
    const { createStore } = jest.requireActual('in-stores/store');

    navigationParametersStore = createStore({
      name: 'navigationTestStore',
      initialValue: {
        pathname: homePath,
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
          oldParams.pathname = '/dashboard';
          return oldParams;
        }),
      goToRootOfView: () =>
        navigationParametersStore.applyStateMutation(oldParams => {
          oldParams.pathname = homePath;
          return oldParams;
        }),
      setSnapshotId: id =>
        navigationParametersStore.applyStateMutation(oldParams => {
          if (id) {
            oldParams.query.snapshotId = id;
          } else {
            delete oldParams.query.snapshotId;
          }
          return oldParams;
        }),
      navigationParameters$: navigationParametersStore.observable
    };

    filerDialogMock = {
      togglePresets: () => {
        filerDialogStore.applyStateMutation(() => false);
      },
      presetsVisible$: filerDialogStore.observable
    };

    jest.doMock('in-stores/navigation', () => navigationMock);
    jest.doMock('in-components/SearchBar/stores/presetsVisibility', () => filerDialogMock);
    jest.doMock('in-stores/snapshot', () => ({
      ...jest.requireActual('in-stores/snapshot'),
      clearSelectedSnapshotId: () => selectedSnapshotStore.applyStateMutation(() => null)
    }));
    onKeyPressed = create();

    jest.doMock('@instana/observables', () => ({
      ...jest.requireActual('@instana/observables'),
      on: () => onKeyPressed
    }));

    shortcuts = require('in-services/shortcuts');
    shortcuts.init();
  }
});

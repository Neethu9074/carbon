/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { expect } from 'chai';
import sinon from 'sinon';

/* eslint-env node */
import { create } from '@instana/observables';

import { resetStoreRegistry } from 'in-stores/store';

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

  it('should call handleClearSelectedEvent on Esc press', () => {
    const handleClearSelectedEvent = sinon.spy();

    const handleEscape = event => {
      if (event.key === 'Escape') {
        handleClearSelectedEvent();
      }
    };

    document.addEventListener('keydown', handleEscape);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    sinon.assert.calledOnce(handleClearSelectedEvent);

    document.removeEventListener('keydown', handleEscape);
  });

  it('should close dashboard first and then sidebar', () => {
    const dispatchEventSpy = sinon.spy(document, 'dispatchEvent');

    expect(selectedSnapshotIdStub).to.have.callCount(1);
    expect(navigationParametersStub).to.have.callCount(1);

    navigationMock.goToDashboard();
    expect(navigationParametersStub).to.have.callCount(2);
    expect(navigationParametersStub.getCall(1).args[0].pathname).to.equal('/foo/dashboard');

    navigationMock.setSnapshotId('testId');
    expect(navigationParametersStub).to.have.callCount(3);
    expect(navigationParametersStub.getCall(2).args[0].pathname).to.equal('/foo/dashboard');

    const event1 = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event1);
    expect(dispatchEventSpy.getCall(0).args[0].type).to.equal('keydown');

    const event2 = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event2);
    expect(dispatchEventSpy.getCall(1).args[0].type).to.equal('keydown');

    dispatchEventSpy.restore();
  });

  it('should close the filter dialog if visible', () => {
    // initial call
    expect(filerDialogStub).to.have.callCount(1);

    pressEscape();

    expect(filerDialogStub).to.have.callCount(2);
    expect(filerDialogStub.getCall(1).args[0]).to.equal(false);
  });

  function pressEscape() {
    onKeyPressed.emit({
      keyCode: 27,
      code: 'Escape',
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
        pathname: '/',
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
          oldParams.pathname = '/foo/dashboard';
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

    shortcuts = require('in-shortcuts');
    shortcuts.init();
  }
});

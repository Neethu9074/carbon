/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest, node */
import { expect } from 'chai';
import sinon from 'sinon';

import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import { resetStoreRegistry } from 'in-stores/store';

describe('shortcuts/C', () => {
  let selectedEntityId;
  let currentService;
  let onKeyPressed;
  let shortcuts;

  beforeEach(() => {
    resetStoreRegistry();

    currentService = {
      init: () => {},
      initEvents: () => {},
      dispose: () => {},
      flyToPosition: sinon.stub(),
      focusMap: sinon.stub()
    };
    CameraControllerServiceLocator.provide(currentService);

    loadModules();

    selectedEntityId.emit(null);
  });

  it('should focus entity when C was pressed', () => {
    expect(currentService.flyToPosition).to.have.callCount(0);

    selectedEntityId.emit('foo');

    pressC();

    expect(currentService.flyToPosition).to.have.callCount(1);
    expect(currentService.flyToPosition.getCall(0).args[0]).to.deep.equal({
      x: 1,
      y: -1,
      z: 0
    });
  });

  function pressC() {
    onKeyPressed.emit({
      keyCode: 67,
      code: 'KeyC',
      target: {
        tagName: ''
      }
    });
  }

  function loadModules() {
    const defaultObjects = new Map();
    defaultObjects.set('id1', {
      getFocusPosition: () => {
        return {
          x: 1,
          y: -1,
          z: 0
        };
      }
    });
    const actualObservables = jest.requireActual('@instana/observables');

    selectedEntityId = actualObservables.create();

    jest.doMock('in-map/stores/focusableSceneObjectsStore', () => ({
      sceneObjects: {
        stream: actualObservables.create().startWith(defaultObjects)
      }
    }));
    jest.doMock('in-map/stores/selectedMapSceneObjectStore', () => ({
      selectedSnapshotIdForHighlightingInMap$: actualObservables.create().startWith('id1')
    }));

    onKeyPressed = actualObservables.create();
    jest.doMock('@instana/observables', () => ({
      ...actualObservables,
      on: () => onKeyPressed
    }));

    shortcuts = require('in-services/shortcuts');
    shortcuts.init();
  }
});

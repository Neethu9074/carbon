/* eslint-env mocha, node */
import { create } from 'reactive-observables';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import sinon from 'sinon';

import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import { resetStoreRegistry } from 'in-stores/store';
import keyCodes from 'in-components/keyCodes';

describe('shortcuts/C', () => {
  let selectedEntityId;
  let currentService;
  let focusEntityId;
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

    selectedEntityId = create();
    selectedEntityId.emit(null);
    loadModules();
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
      keyCode: keyCodes.c,
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
    focusEntityId = proxyquire('in-map/services/focus', {
      'in-map/stores/focusableSceneObjectsStore': {
        sceneObjects: {
          stream: create().startWith(defaultObjects)
        }
      },
      'in-map/stores/selectedMapSceneObjectStore': {
        selectedSnapshotIdForHighlightingInMap$: create().startWith('id1')
      }
    });

    const mod = proxyquire('in-services/shortcuts/shortcuts/C', {
      'in-map/services/focus': focusEntityId
    });

    onKeyPressed = create();
    shortcuts = proxyquire('in-services/shortcuts', {
      'reactive-observables': {
        on: () => onKeyPressed
      },
      'in-services/shortcuts/shortcuts/C': mod
    });
    shortcuts.init();
  }
});

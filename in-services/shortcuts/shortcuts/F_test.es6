/* eslint-env mocha, node */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import {resetStoreRegistry} from 'in-stores/store';


describe('shortcuts/C', () => {

  let flyToPositionStub;
  let selectedEntityId;
  let focusEntityId;
  let onKeyPressed;
  let shortcuts;

  beforeEach(() => {
    resetStoreRegistry();

    flyToPositionStub = sinon.stub();
    selectedEntityId = create();
    selectedEntityId.emit(null);
    loadModules();
  });

  it('should focus entity when F was pressed', () => {
    expect(flyToPositionStub).to.have.callCount(0);

    selectedEntityId.emit('foo');

    pressF();

    expect(flyToPositionStub).to.have.callCount(1);
    expect(flyToPositionStub.getCall(0).args[0]).to.deep.equal({
      x: 1,
      y: -1,
      z: 0
    });
  });

  function pressF() {
    onKeyPressed.emit({
      keyCode: shortcuts.KEY_CODES.F,
      target: {
        tagName: ''
      }
    });
  }

  function loadModules() {
    focusEntityId = proxyquire('in-map/services/focus', {
      'in-map/stores/focusableSceneObjectsStore': {
        sceneObjects: {
          stream: create().startWith({
            'id1': {
              getFocusPosition: () => {
                return {
                  x: 1,
                  y: -1,
                  z: 0
                };
              }
            }
          })
        }
      },
      'in-map/stores/cameraController': {
        cameraController$: create().startWith({
          flyToPosition: flyToPositionStub
        })
      },
      'in-map/stores/selectedMapSceneObjectStore': {
        selectedSnapshotIdForHighlightingInMap$: create().startWith('id1')
      }
    });

    const mod = proxyquire('in-services/shortcuts/shortcuts/F', {
      'in-map/services/focus': focusEntityId
    });

    onKeyPressed = create();
    shortcuts = proxyquire('in-services/shortcuts', {
      'reactive-observables': {
        on: () => onKeyPressed
      },
      'in-services/shortcuts/shortcuts/F': mod
    });
    shortcuts.init();
  }
});

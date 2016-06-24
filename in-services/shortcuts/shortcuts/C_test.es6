/* eslint-env mocha, node */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import {resetStoreRegistry} from 'in-stores/store';


describe('shortcuts/C', () => {

  let focusEntityIdSubscription;
  let focusEntityIdStub;
  let selectedEntityId;
  let focusEntityId;
  let onKeyPressed;
  let shortcuts;
  let mod;

  beforeEach(() => {
    resetStoreRegistry();

    selectedEntityId = create();
    selectedEntityId.emit(null);
    loadModules();

    focusEntityIdStub = sinon.stub();
    focusEntityIdSubscription = focusEntityId.focusEntityId$.subscribe(focusEntityIdStub);
  });

  afterEach(() => {
    focusEntityIdSubscription.dispose();
  });

  it('should focus entity when C was pressed', () => {
    expect(focusEntityIdStub).to.have.callCount(1);
    expect(focusEntityIdStub.getCall(0).args[0]).to.equal(null);

    selectedEntityId.emit('foo');
    onKeyPressed.emit({keyCode: shortcuts.KEY_CODES.C});

    expect(focusEntityIdStub).to.have.callCount(2);
    expect(focusEntityIdStub.getCall(1).args[0]).to.equal('foo');
  });

  function loadModules() {
    focusEntityId = proxyquire('in-map/src/stores/focusEntity', {
      'in-map/src/mapStores': {
        selectedSnapshotIdForHighlightingInMap: selectedEntityId
      }
    });

    mod = proxyquire('in-services/shortcuts/shortcuts/C', {
      'in-map/src/stores/focusEntity': focusEntityId
    });

    onKeyPressed = create();
    shortcuts = proxyquire('in-services/shortcuts', {
      'in-services/shortcuts/shortcuts/focusEntityShortcuts': mod,
      'reactive-observables': {
        on: () => onKeyPressed
      }
    });
    shortcuts.init();
  }
});

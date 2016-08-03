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

  it('should focus entity when F was pressed', () => {
    expect(focusEntityIdStub).to.have.callCount(0);

    selectedEntityId.emit('foo');

    pressF();

    expect(focusEntityIdStub).to.have.callCount(1);
    expect(focusEntityIdStub.getCall(0).args[0]).to.equal('foo');
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
    focusEntityId = proxyquire('in-map/stores/focusEntity', {
      'in-map/stores/selectedSnapshotIdForHighlightingInMap': {
        selectedSnapshotIdForHighlightingInMap$: selectedEntityId
      }
    });

    const mod = proxyquire('in-services/shortcuts/shortcuts/F', {
      'in-map/stores/focusEntity': focusEntityId
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

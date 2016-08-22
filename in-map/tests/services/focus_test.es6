/* eslint-env mocha,node */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import {sceneObjects} from 'in-map/stores/focusableSceneObjectsStore';
import {setCameraController} from 'in-map/stores/cameraController';


describe('layoutingStorage', () => {
  let mod;
  let selectedSnapshotIdForHighlightingInMap$;

  beforeEach(() => {
    setCameraController(null);

    selectedSnapshotIdForHighlightingInMap$ = create();
    mod = proxyquire('in-map/services/focus', {
      'in-map/stores/selectedMapSceneObjectStore': {
        selectedSnapshotIdForHighlightingInMap$
      }
    });
  });

  afterEach(() => {
  });

  it('should do nothing if there is either no camera nor focusable objects', () => {
    mod.focusId('id1');
  });

  it('should center map if there is a cameraController but no id', () => {
    const controller = getCameraController();
    setCameraController(controller);

    expect(controller.map.centerMap).to.have.callCount(0);

    mod.focusId(null);
    expect(controller.map.centerMap).to.have.callCount(1);
  });

  it('should do nothing if there is a cameraController and id but no focusable scene object', () => {
    const controller = getCameraController();
    setCameraController(controller);

    expect(controller.map.centerMap).to.have.callCount(0);
    expect(controller.flyToPosition).to.have.callCount(0);

    mod.focusId('id');
    expect(controller.map.centerMap).to.have.callCount(0);
    expect(controller.flyToPosition).to.have.callCount(0);
  });

  it('should fly to objects position if there is a focusable object and cameraController', () => {
    const controller = getCameraController();
    setCameraController(controller);

    sceneObjects.add('id1', {
      getFocusPosition: sinon.stub().returns('foo')
    });

    expect(controller.map.centerMap).to.have.callCount(0);
    expect(controller.flyToPosition).to.have.callCount(0);

    mod.focusId('id1');
    expect(controller.map.centerMap).to.have.callCount(0);
    expect(controller.flyToPosition).to.have.callCount(1);
    expect(sceneObjects.get('id1').getFocusPosition).to.have.callCount(1);
    expect(controller.flyToPosition.getCall(0).args[0]).to.equal('foo');

    sceneObjects.remove('id1');
  });
});


function getCameraController() {
  return {
    map: {
      centerMap: sinon.stub()
    },
    flyToPosition: sinon.stub()
  };
}

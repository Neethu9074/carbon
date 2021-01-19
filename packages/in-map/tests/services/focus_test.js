/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha,node */
import { create } from '@instana/observables';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import sinon from 'sinon';

import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import { sceneObjects } from 'in-map/stores/focusableSceneObjectsStore';

describe('layoutingStorage', () => {
  let mod;
  let selectedSnapshotIdForHighlightingInMap$;
  let currentService;

  beforeEach(() => {
    currentService = {
      init: () => {},
      initEvents: () => {},
      dispose: () => {},
      flyToPosition: sinon.stub(),
      focusMap: sinon.stub()
    };
    CameraControllerServiceLocator.provide(currentService);

    selectedSnapshotIdForHighlightingInMap$ = create();
    mod = proxyquire('in-map/services/focus', {
      'in-map/stores/selectedMapSceneObjectStore': {
        selectedSnapshotIdForHighlightingInMap$
      }
    });
  });

  afterEach(() => {});

  it('should do nothing if there is either no camera nor focusable objects', () => {
    mod.focusId('id1');
  });

  it('should center map if there is a cameraController but no id', () => {
    expect(currentService.flyToPosition).to.have.callCount(0);
    expect(currentService.focusMap).to.have.callCount(0);
    mod.focusId(null);
    expect(currentService.flyToPosition).to.have.callCount(0);
    expect(currentService.focusMap).to.have.callCount(1);
  });

  it('should do nothing if there is a cameraController and id but no focusable scene object', () => {
    expect(currentService.flyToPosition).to.have.callCount(0);
    mod.focusId('id');
    expect(currentService.flyToPosition).to.have.callCount(0);
  });

  it('should fly to objects position if there is a focusable object and cameraController', () => {
    sceneObjects.add('id1', {
      getFocusPosition: sinon.stub().returns('foo')
    });

    expect(currentService.flyToPosition).to.have.callCount(0);

    mod.focusId('id1');
    expect(currentService.flyToPosition).to.have.callCount(1);
    expect(currentService.flyToPosition.getCall(0).args[0]).to.equal('foo');
    expect(sceneObjects.get('id1').getFocusPosition).to.have.callCount(1);

    sceneObjects.remove('id1');
  });
});

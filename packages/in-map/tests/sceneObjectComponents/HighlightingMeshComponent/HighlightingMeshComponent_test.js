/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest, node */
import { expect } from 'chai';
import sinon from 'sinon';
import { getFactory } from 'in-map/stores/factoriesStore';

import { createSceneObject } from 'in-map/tests/sceneObjectComponents/helper';
import HighlightingMeshComponent from 'in-map/sceneObjectComponents/HighlightingMeshComponent';

jest.mock('in-map/stores/factoriesStore');
jest.mock('in-map/stores/selectedMapSceneObjectStore', () => {
  const { create } = jest.requireActual('@instana/observables');
  return { selectedSnapshotIdForHighlightingInMap$: create().startWith(null) };
});

describe('in-map', () => {
  describe('sceneObjectComponents/HighlightingMeshComponent', () => {
    let component;
    let component2;
    let sceneObject;
    let sceneObject2;
    let factory;

    beforeEach(() => {
      sceneObject = createSceneObject('id1');
      sceneObject2 = createSceneObject('id2');

      factory = {
        add: sinon.stub(),
        remove: sinon.stub(),
        needsUpdate: sinon.stub()
      };
      getFactory.mockReturnValue(factory);

      component = new HighlightingMeshComponent(sceneObject);
      component.initEvents();

      component2 = new HighlightingMeshComponent(sceneObject2);
      component2.initEvents();
    });

    afterEach(() => {
      component.disposeEvents();
      component.dispose();
      sceneObject.dispose();

      component2.disposeEvents();
      component2.dispose();
      sceneObject2.dispose();
    });

    it('should update fragment when node changes and is highlighted', () => {
      sceneObject.eventEmitter.emit('isHighlighted', false);
      sceneObject2.eventEmitter.emit('isHighlighted', true);

      expect(factory.add).to.have.callCount(1);
      expect(factory.needsUpdate).to.have.callCount(2);
      expect(factory.add.getCall(0).args[0].sceneObject.id).to.equal('id2');

      sceneObject2.eventEmitter.emit('transformationChanged', {
        position: { x: 1, y: 0, z: 2 },
        scale: { x: 1, y: 2, z: 1 }
      });
      expect(factory.needsUpdate).to.have.callCount(3);
    });
  });
});

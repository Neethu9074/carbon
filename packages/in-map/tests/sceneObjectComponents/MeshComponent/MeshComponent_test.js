/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest, node */
import { expect } from 'chai';
import sinon from 'sinon';
import { getFactory } from 'in-map/stores/factoriesStore';

import { createSceneObject } from 'in-map/tests/sceneObjectComponents/helper';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';

jest.mock('in-map/stores/factoriesStore');

describe('in-map', () => {
  describe('sceneObjectComponents/MeshComponent', () => {
    let sceneObject;
    let component;
    let factory;

    beforeEach(() => {
      sceneObject = createSceneObject('id1');

      factory = {
        add: sinon.stub(),
        remove: sinon.stub(),
        needsUpdate: sinon.stub()
      };
      getFactory.mockReturnValue(factory);

      component = new MeshComponent(sceneObject);
      component.initEvents();
    });

    afterEach(() => {
      component.disposeEvents();
      component.dispose();
      sceneObject.dispose();
    });

    it('should add a fragment at constructor time', () => {
      expect(factory.add).to.have.callCount(1);
    });

    it('should update fragment when node changes', () => {
      sceneObject.eventEmitter.emit('transformationChanged', {
        position: { x: 1, y: 0, z: 2 },
        scale: { x: 1, y: 2, z: 1 }
      });
      expect(factory.needsUpdate).to.have.callCount(1);

      sceneObject.eventEmitter.emit('colorChanged', { r: 1, g: 2, b: 1 });
      expect(factory.needsUpdate).to.have.callCount(2);
    });
  });
});

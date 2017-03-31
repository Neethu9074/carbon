/* eslint-env mocha, node */
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import sinon from 'sinon';

import { createSceneObject } from 'in-map/tests/sceneObjectComponents/helper';

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

      const Component = proxyquire('in-map/sceneObjectComponents/MeshComponent/MeshComponent', {
        'in-map/stores/factoriesStore': {
          getFactory: () => factory
        }
      }).default;

      component = new Component(sceneObject);
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
      sceneObject.eventEmitter.emit('positionChanged', { x: 1, y: 0, z: 2 });
      expect(factory.needsUpdate).to.have.callCount(1);

      sceneObject.eventEmitter.emit('scaleChanged', { x: 1, y: 2, z: 1 });
      expect(factory.needsUpdate).to.have.callCount(2);

      sceneObject.eventEmitter.emit('colorChanged', { r: 1, g: 2, b: 1 });
      expect(factory.needsUpdate).to.have.callCount(3);
    });
  });
});

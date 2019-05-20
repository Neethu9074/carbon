/* eslint-env mocha, node */
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import sinon from 'sinon';

import { createSceneObject } from 'in-map/tests/sceneObjectComponents/helper';

describe('in-map', () => {
  describe('sceneObjectComponents/iconComponents/IconComponent', () => {
    let getIconPositionCallback;
    let sceneObject;
    let component;
    let factory;

    beforeEach(() => {
      sceneObject = createSceneObject();

      getIconPositionCallback = sinon.stub().returns({ x: 0, y: 0, z: 0 });

      factory = {
        add: sinon.stub(),
        remove: sinon.stub(),
        needsUpdate: sinon.stub()
      };

      const Component = proxyquire('in-map/sceneObjectComponents/iconComponents/IconComponent', {
        'in-map/stores/factoriesStore': {
          getFactory: () => factory
        }
      }).default;

      component = new Component(sceneObject, 1, getIconPositionCallback);
      component.initEvents();
    });

    afterEach(() => {
      component.disposeEvents();
      component.dispose();
      sceneObject.dispose();
    });

    it('should add undefined fragment to factory at constructor time', () => {
      expect(factory.add).to.have.callCount(1);
      expect(factory.add.getCall(0).args[0].additionalParams.type).to.equal(undefined);
    });

    it('should update fragment when node changes', () => {
      expect(factory.add).to.have.callCount(1);
      expect(factory.needsUpdate).to.have.callCount(0);

      sceneObject.eventEmitter.emit('transformationChanged', {
        position: { x: 1, y: 0, z: 2 },
        scale: { x: 1, y: 2, z: 1 }
      });
      expect(factory.needsUpdate).to.have.callCount(1);

      expect(getIconPositionCallback).to.have.callCount(1);
      expect(getIconPositionCallback.getCall(0).args[0]).to.deep.equal({ x: 1, y: 0, z: 2 });
      expect(getIconPositionCallback.getCall(0).args[1]).to.deep.equal({ x: 1, y: 2, z: 1 });
    });
  });
});

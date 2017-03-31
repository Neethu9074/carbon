/* eslint-env mocha, node */
import { create } from 'reactive-observables';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import sinon from 'sinon';

import { createSceneObject } from 'in-map/tests/sceneObjectComponents/helper';

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

      const Component = proxyquire('in-map/sceneObjectComponents/HighlightingMeshComponent/HighlightingMeshComponent', {
        'in-map/stores/selectedMapSceneObjectStore': {
          selectedSnapshotIdForHighlightingInMap$: create().startWith(null)
        },
        'in-map/stores/factoriesStore': {
          getFactory: () => factory
        }
      }).default;

      component = new Component(sceneObject);
      component.initEvents();

      component2 = new Component(sceneObject2);
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

      sceneObject2.eventEmitter.emit('positionChanged', { x: 1, y: 0, z: 2 });
      expect(factory.needsUpdate).to.have.callCount(3);

      sceneObject2.eventEmitter.emit('scaleChanged', { x: 1, y: 2, z: 1 });
      expect(factory.needsUpdate).to.have.callCount(4);
    });
  });
});

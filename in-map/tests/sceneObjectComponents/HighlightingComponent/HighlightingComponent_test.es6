/* eslint-env mocha, node */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import {createSceneObject} from 'in-map/tests/sceneObjectComponents/helper';


describe('in-map', () => {
  describe('sceneObjectComponents/HealthComponent', () => {
    let component;
    let component2;
    let sceneObject;
    let sceneObject2;
    let factory;
    let isHighlighted;
    let isHighlighted2;

    beforeEach(() => {
      sceneObject = createSceneObject('id1');
      sceneObject2 = createSceneObject('id2');

      isHighlighted = sinon.stub();
      isHighlighted2 = sinon.stub();
      sceneObject.eventEmitter.on('isHighlighted').subscribe(isHighlighted);
      sceneObject2.eventEmitter.on('isHighlighted').subscribe(isHighlighted2);

      factory = {
        add: sinon.stub(),
        remove: sinon.stub(),
        needsUpdate: sinon.stub()
      };

      const Component = proxyquire('in-map/sceneObjectComponents/HighlightingComponent/HighlightingComponent', {
        'in-services/stores/highlightedEntityId': {
          highlightedEntityId$: create().startWith('id2')
        },
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
      component.dispose();
      sceneObject.dispose();

      component2.dispose();
      sceneObject2.dispose();
    });

    it('should only call highlighted entitys highlighting event', () => {
      expect(isHighlighted).to.have.callCount(1);
      expect(isHighlighted2).to.have.callCount(1);

      expect(isHighlighted.getCall(0).args[0]).to.equal(false);
      expect(isHighlighted2.getCall(0).args[0]).to.equal(true);
    });

    it('should update fragment when node changes and is highlighted', () => {
      expect(factory.add).to.have.callCount(1);
      expect(factory.needsUpdate).to.have.callCount(2);
      expect(factory.add.getCall(0).args[0].sceneObject.id).to.equal('id2');

      sceneObject2.eventEmitter.emit('positionChanged', {x: 1, y: 0, z: 2});
      expect(factory.needsUpdate).to.have.callCount(3);

      sceneObject2.eventEmitter.emit('scaleChanged', {x: 1, y: 2, z: 1});
      expect(factory.needsUpdate).to.have.callCount(4);
    });
  });
});

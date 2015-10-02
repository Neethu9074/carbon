/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
import proxyquire from 'proxyquire';
import Immutable from 'immutable';
import {expect} from 'chai';
import sinon from 'sinon';

import {create} from 'in-services/conveyer';

import {currentScene} from '../../mapStores';

class SnapshotConveyerMock {
  static getUniqueId() {
    return Math.random();
  }

  constructor(params) {
    this.params = params;
  }

  getFullFakeSnapshotForCoordinates(coordinates) {
    return Immutable.fromJS({
      hostId: coordinates.get('hostId'),
      pluginId: coordinates.get('pluginId'),
      steadyId: coordinates.get('steadyId'),
      data: {}
    });
  }

  start(onNext) {
    onNext(this.getFullFakeSnapshotForCoordinates(this.params.coords));
  }
}

describe('3D map', () => {
  let component;
  let sceneObject;

  beforeEach(() => {
    sceneObject = {};

    currentScene.emit({
      addCollisionObject: sinon.stub(),
      layerSingleMeshFactory: {
        addFragment: sinon.stub(),
        removeFragment: sinon.stub()
      },
      layerHighlightingSingleMeshFactory: {
        addFragment: sinon.stub(),
        removeFragment: sinon.stub()
      }
    });

    const LayerComponent = proxyquire('./LayerComponent.es6', {
      '../../sceneObjects/Layer': proxyquire('../../sceneObjects/Layer', {
        'in-services/snapshots': {
          getFullSnapshot(coords) {
            return create(SnapshotConveyerMock, {coords});
          }
        }
      })
    });

    component = new LayerComponent({ sceneObject });
  });

  describe('LayerComponent', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(true);
    });

  });

  describe('layer layouter', () => {

    it('should return an empty array if there are no layer', () => {
      const transformations = component.getLayerTransformations();
      expect(transformations.length).to.equal(0);
    });

    it('should return 10 transformations for 10 layer', () => {
      for (let i = 0; i < 10; i++) {
        component.addLayer(getRandomLayerCoordinates());
      }
      const transformations = component.getLayerTransformations();
      expect(transformations.length).to.equal(10);
    });

    it('should stack same layer equally', () => {
      // better to calculate
      component.heightChanged(10);

      for (let i = 0; i < 10; i++) {
        component.addLayer(getRandomLayerCoordinates());
      }

      const transformations = component.getLayerTransformations();
      expect(transformations.length).to.equal(10);
      for (let i = 0; i < 10; i++) {
        expect(transformations[i].position.y).to.equal(i);
      }
    });

    it('should be a gap between two layer of different type', () => {
      // better to calculate
      component.heightChanged(3);

      component.addLayer(getRandomLayerCoordinates('typeA'));
      component.addLayer(getRandomLayerCoordinates('typeB'));

      const transformations = component.getLayerTransformations();
      expect(transformations.length).to.equal(2);
      expect(transformations[0].position.y).to.equal(0);
      expect(transformations[1].position.y).to.equal(2);
    });

    it('should be a gap between four layer of different type', () => {
      // better to calculate
      component.heightChanged(11);

      component.addLayer(getRandomLayerCoordinates('typeA'));
      component.addLayer(getRandomLayerCoordinates('typeA'));
      component.addLayer(getRandomLayerCoordinates('typeA'));
      component.addLayer(getRandomLayerCoordinates('typeB'));
      component.addLayer(getRandomLayerCoordinates('typeB'));
      component.addLayer(getRandomLayerCoordinates('typeC'));
      component.addLayer(getRandomLayerCoordinates('typeC'));
      component.addLayer(getRandomLayerCoordinates('typeD'));

      const transformations = component.getLayerTransformations();
      expect(transformations.length).to.equal(8);
      expect(transformations[0].position.y).to.equal(0);
      expect(transformations[1].position.y).to.equal(1);
      expect(transformations[2].position.y).to.equal(2);
      expect(transformations[3].position.y).to.equal(4);
      expect(transformations[4].position.y).to.equal(5);
      expect(transformations[5].position.y).to.equal(7);
      expect(transformations[6].position.y).to.equal(8);
      expect(transformations[7].position.y).to.equal(10);
    });

    it('should count the different types correctly', () => {
      expect(component.countDifferentTypesFromSortedArray(component.getSortedLayer())).to.equal(1);

      component.addLayer(getRandomLayerCoordinates('typeA'));
      expect(component.countDifferentTypesFromSortedArray(component.getSortedLayer())).to.equal(1);

      component.addLayer(getRandomLayerCoordinates('typeA'));
      expect(component.countDifferentTypesFromSortedArray(component.getSortedLayer())).to.equal(1);

      component.addLayer(getRandomLayerCoordinates('typeB'));
      expect(component.countDifferentTypesFromSortedArray(component.getSortedLayer())).to.equal(2);

      component.addLayer(getRandomLayerCoordinates('typeA'));
      expect(component.countDifferentTypesFromSortedArray(component.getSortedLayer())).to.equal(2);

      component.addLayer(getRandomLayerCoordinates('typeC'));
      expect(component.countDifferentTypesFromSortedArray(component.getSortedLayer())).to.equal(3);
    });


  });

  function getRandomLayerCoordinates(pluginId = 'default') {
    const id = Math.random();
    return Immutable.fromJS([{
      id,
      pluginId,
      hostId: 'horst_' + id,
      steadyId: 'someting special'
    }]);
  }
});

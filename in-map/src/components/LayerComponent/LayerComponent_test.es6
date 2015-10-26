/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
import proxyquire from 'proxyquire';
import Immutable from 'immutable';
import {expect} from 'chai';
import sinon from 'sinon';

import getIdString from 'in-services/snapshots/getIdString';
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
    global.window = global.window || {};
    global.window.location = global.window.location || {};
    global.window.location.href = 'https://test-instana.instana.io';
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

    it('can add layer', () => {
      component.addLayer(getRandomLayerCoordinates());
      component.addLayer(getRandomLayerCoordinates());

      expect(component.layer.length).to.equal(2);
    });

    it('can clear layer that are not sended anymore', () => {
      const coord1 = { hostId: 'h_1', pluginId: 'd', steadyId: 'h' };
      const coord2 = { hostId: 'h_2', pluginId: 'd', steadyId: 'h' };
      const coord3 = { hostId: 'h_3', pluginId: 'd', steadyId: 'h' };

      coord1.id = getIdString(coord1);
      coord2.id = getIdString(coord2);
      coord3.id = getIdString(coord3);

      component.addLayer(Immutable.fromJS([coord1, coord2, coord3]));
      expect(component.layer.length).to.equal(3);

      component.removedVanishedLayer(Immutable.fromJS([coord1, coord3]));
      expect(component.layer.length).to.equal(2);

      component.removedVanishedLayer(Immutable.fromJS([coord3]));
      expect(component.layer.length).to.equal(1);

      component.addLayer(Immutable.fromJS([coord1, coord2, coord3]));
      expect(component.layer.length).to.equal(3);
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

    it('should default gap size', () => {
      expect(component.calculateHeightForEachGap(1, 1)).to.equal(0.1);
      expect(component.calculateHeightForEachGap(1, 2)).to.equal(0.05);
      expect(component.calculateHeightForEachGap(10, 2)).to.equal(0.1);
      expect(component.calculateHeightForEachGap(10, 10)).to.equal(0.1);
      expect(component.calculateHeightForEachGap(10, 100)).to.equal(0.01);
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

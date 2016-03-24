/* eslint-env mocha, node */
/* eslint-disable no-unused-expressions */
import proxyquire from 'proxyquire';
import Immutable from 'immutable';
import RoEmitter from 'roemitter';
import {expect} from 'chai';
import sinon from 'sinon';

import SceneObject from 'in-map/src/3DSceneObjects/common/SceneObject';
import {currentScene} from 'in-map/src/mapStores';


class SceneObjectWithSnapshotMock extends SceneObject {
  constructor({parent, id}) {
    super({parent, id});
  }
}

describe('3D map', () => {
  let component;
  let sceneObject;

  beforeEach(() => {
    global.window = global.window || {};
    global.window.location = global.window.location || {};
    global.window.location.href = 'https://test-instana.instana.io';
    sceneObject = {eventEmitter: new RoEmitter()};

    currentScene.emit({
      addCollisionObject: sinon.stub(),
      layerSingleMeshFactory: {
        addFragment: sinon.stub(),
        removeFragment: sinon.stub()
      },
      highlightingSingleMeshFactory: {
        addFragment: sinon.stub(),
        removeFragment: sinon.stub()
      }
    });

    const LayerComponent = proxyquire('./LayerComponent.es6', {
      'in-map/src/3DSceneObjects/physical/Layer': proxyquire('in-map/src/3DSceneObjects/physical/Layer', {
        '../common/SceneObjectWithSnapshot': SceneObjectWithSnapshotMock
      })
    });

    component = new LayerComponent({ sceneObject });
  });

  describe('LayerComponent', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(true);
    });

    it('can add layer', () => {
      component.addLayer(getRandomLayerCoordinates('typeA'));
      component.addLayer(getRandomLayerCoordinates('typeB'));

      expect(component.layer.length).to.equal(2);
    });

  });

  describe('layer layouter', () => {

    it('should return an empty array if there are no layer', () => {
      const transformations = component.getLayerTransformations();
      expect(transformations.length).to.equal(0);
    });

    it('should return 10 transformations for 10 layer', () => {
      for (let i = 0; i < 10; i++) {
        component.addLayer(getRandomLayerCoordinates('type' + i));
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

  function getRandomLayerCoordinates(type = 'default') {
    return Immutable.fromJS([{id: type}]);
  }
});

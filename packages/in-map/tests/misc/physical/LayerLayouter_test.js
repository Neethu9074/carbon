/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest, node */
import RoEmitter from '@instana/roemitter';
import { expect } from 'chai';
import sinon from 'sinon';
import { getFactory } from 'in-map/stores/factoriesStore';
import createLayouter from 'in-map/misc/physical/LayerLayouter';

import createObjectCollection from 'in-map/stores/ObjectCollectionStream';

jest.mock('in-map/stores/factoriesStore');
jest.mock('in-map/misc/TimingConfig', () => ({
  LAYER_LAYOUTING: 0
}));

describe('in-map', () => {
  describe('misc/physical/LayerLayouter', () => {
    let eventEmitter;
    let layouter;
    let factory;
    let layer;

    beforeEach(() => {
      factory = {
        add: sinon.stub(),
        remove: sinon.stub(),
        needsUpdate: sinon.stub()
      };
      getFactory.mockReturnValue(factory);

      layer = createObjectCollection();
      eventEmitter = new RoEmitter();
      const node = {
        eventEmitter,
        layer
      };

      layouter = createLayouter(node);
    });

    afterEach(() => {
      layouter.dispose();
      eventEmitter.dispose();
    });

    describe('count different plugins', () => {
      it('should return 0 if there are no plugins', () => {
        expect(layouter.countDifferentPluginsFromSortedArray([])).to.equal(0);
      });

      it('should return 1 if there are is one plugins', () => {
        expect(layouter.countDifferentPluginsFromSortedArray([{ _cachedPlugin: 'plugin1' }])).to.equal(1);
      });

      it('should return 2 if there are two plugins', () => {
        expect(
          layouter.countDifferentPluginsFromSortedArray([{ _cachedPlugin: 'plugin1' }, { _cachedPlugin: 'plugin2' }])
        ).to.equal(2);
      });

      it('should return 3 if there are multiple objects with the same plugins', () => {
        expect(
          layouter.countDifferentPluginsFromSortedArray([
            { _cachedPlugin: 'plugin1' },
            { _cachedPlugin: 'plugin1' },
            { _cachedPlugin: 'plugin2' },
            { _cachedPlugin: 'plugin2' },
            { _cachedPlugin: 'plugin3' },
            { _cachedPlugin: 'plugin2' }
          ])
        ).to.equal(3);
      });
    });

    it('should add a plugins to factory and center it', () => {
      const nodePosition = { x: 1, y: 2, z: 3 };
      const nodeScale = { x: 1, y: 4, z: 1 };

      eventEmitter.emit('transformationChanged', { position: nodePosition, scale: nodeScale });

      layer.add('id1', createLayer('plugin_1'));

      expect(factory.add).to.have.callCount(1);
      expect(factory.add.getCall(0).args).to.have.length(1);

      const first = factory.add.getCall(0).args[0];
      expect(first.additionalParams.positionOffset.y).to.equal(2);
    });

    it('should only add unique plugins to factory', () => {
      const nodePosition = { x: 1, y: 2, z: 3 };
      const nodeScale = { x: 1, y: 4, z: 1 };

      eventEmitter.emit('transformationChanged', { position: nodePosition, scale: nodeScale });

      layer.add('id1', createLayer('plugin_1'));
      layer.add('id2', createLayer('plugin_2'));

      expect(factory.add.getCall(0).args).to.have.length(1);

      const first = factory.add.getCall(0).args[0];
      expect(first.additionalParams.positionOffset.y).to.equal(2);
    });

    it('should position the layer icons in the middle', () => {
      const nodePosition = { x: 1, y: 2, z: 3 };
      const nodeScale = { x: 1, y: 4, z: 1 };

      layer.add('id1', createLayer('plugin_1'));
      layer.add('id2', createLayer('plugin_2'));

      eventEmitter.emit('transformationChanged', { position: nodePosition, scale: nodeScale });

      expect(factory.add.getCall(0).args).to.have.length(1);
      expect(factory.add.getCall(1).args).to.have.length(1);
    });

    it('should merge same plugins', () => {
      const nodePosition = { x: 1, y: 2, z: 3 };
      const nodeScale = { x: 1, y: 6, z: 1 };

      layer.add('id1', createLayer('plugin_1'));
      layer.add('id2', createLayer('plugin_1'));
      layer.add('id3', createLayer('plugin_2'));
      layer.add('id4', createLayer('plugin_2'));
      layer.add('id5', createLayer('plugin_3'));
      layer.add('id6', createLayer('plugin_4'));

      eventEmitter.emit('transformationChanged', { position: nodePosition, scale: nodeScale });

      expect(factory.add.getCall(0).args).to.have.length(1);
      expect(factory.add.getCall(1).args).to.have.length(1);
      expect(factory.add.getCall(2).args).to.have.length(1);
      expect(factory.add.getCall(3).args).to.have.length(1);
    });
  });
});

function createLayer(plugin) {
  return {
    _cachedPlugin: plugin,
    getComponent: () => {
      return {
        setTransformXYZ: sinon.stub(),
        setPositionXYZ: sinon.stub(),
        setScaleXYZ: sinon.stub()
      };
    }
  };
}

/* eslint-env mocha, node */
import proxyquire from 'proxyquire';
import Immutable from 'immutable';
import {expect} from 'chai';
import sinon from 'sinon';

import {createSceneObject} from 'in-map/tests/sceneObjectComponents/helper';
import * as constants from 'in-forge/constants';


describe('in-map', () => {
  describe('sceneObjectComponents/iconComponents/Physical', () => {
    let getIconPositionCallback;
    let sceneObject;
    let component;
    let factory;

    beforeEach(() => {
      sceneObject = createSceneObject();

      getIconPositionCallback = sinon.stub().returns({x: 0, y: 0, z: 0});

      factory = {
        add: sinon.stub(),
        remove: sinon.stub(),
        needsUpdate: sinon.stub()
      };

      const IconComponent = proxyquire('in-map/sceneObjectComponents/iconComponents/IconComponent', {
        'in-map/stores/factoriesStore': {
          getFactory: () => factory
        }
      }).default;

      const Component = proxyquire('in-map/sceneObjectComponents/iconComponents/Physical', {
        'in-map/sceneObjectComponents/iconComponents/IconComponent': {
          default: IconComponent
        }
      }).default;

      component = new Component(sceneObject, 1, getIconPositionCallback);
      component.initEvents();
    });

    afterEach(() => {
      component.dispose();
      sceneObject.dispose();
    });

    it('should add undefined fragment to factory at constructor time', () => {
      expect(factory.add).to.have.callCount(1);
      expect(factory.add.getCall(0).args[0].additionalParams.type).to.equal(undefined);
    });

    it('should change the icon type when snappi is available', () => {
      sceneObject.eventEmitter.emit('snapshotChanged', Immutable.fromJS({
        plugin: constants.plugins.cassandraCluster
      }));
      expect(factory.add).to.have.callCount(1);
      expect(factory.add.getCall(0).args[0].additionalParams.type).to.equal(constants.plugins.cassandraCluster);

      sceneObject.eventEmitter.emit('snapshotChanged', Immutable.fromJS({
        plugin: constants.plugins.cassandraNode
      }));
      expect(factory.add).to.have.callCount(1);
      expect(factory.add.getCall(0).args[0].additionalParams.type).to.equal(constants.plugins.cassandraNode);
    });
  });
});

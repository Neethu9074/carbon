/* eslint-env mocha, node */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {fromJS} from 'immutable';
import {expect} from 'chai';
import sinon from 'sinon';

import {createSceneObject} from 'in-map/tests/sceneObjectComponents/helper';
import {plugins} from 'in-forge/constants';


describe('in-map', () => {
  describe('sceneObjectComponents/iconComponents/Logical', () => {
    let getIconPositionCallback;
    let sceneObject;
    let component;
    let factory;
    let clusterMember;

    beforeEach(() => {
      sceneObject = createSceneObject();

      getIconPositionCallback = sinon.stub().returns({x: 0, y: 0, z: 0});

      factory = {
        add: sinon.stub(),
        remove: sinon.stub(),
        needsUpdate: sinon.stub()
      };

      clusterMember = create();

      const IconComponent = proxyquire('in-map/sceneObjectComponents/iconComponents/IconComponent', {
        'in-map/stores/factoriesStore': {
          getFactory: () => factory
        }
      }).default;

      const Component = proxyquire('in-map/sceneObjectComponents/iconComponents/Logical', {
        'in-map/sceneObjectComponents/iconComponents/IconComponent': {
          default: IconComponent
        },
        'in-stores/clusterMembers': {
          getClusterMembers: () => clusterMember
        },
        'in-stores/snapshot': {
          getSnapshot: id => create().startWith(
            id === 'cluster_member_1'
              ? fromJS({ plugin: plugins.cassandraNode })
              : fromJS({ plugin: plugins.elasticsearch })
          )
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

    it('should change the icon type to cluster member type if homogen', () => {
      clusterMember.emit(fromJS([
        'cluster_member_1'
      ]));

      sceneObject.eventEmitter.emit('snapshotChanged', fromJS({
        plugin: plugins.cassandraCluster
      }));
      expect(factory.add).to.have.callCount(1);
      expect(factory.add.getCall(0).args[0].additionalParams.type).to.equal(plugins.cassandraNode);
    });

    it('should change the icon type to service type if there are inhomogen cluster member', () => {
      clusterMember.emit(fromJS([
        'cluster_member_1',
        'cluster_member_2'
      ]));

      sceneObject.eventEmitter.emit('snapshotChanged', fromJS({
        plugin: plugins.cassandraCluster
      }));
      expect(factory.add).to.have.callCount(1);
      expect(factory.add.getCall(0).args[0].additionalParams.type).to.equal(plugins.cassandraCluster);
    });
  });
});

/* eslint-env mocha, node */
/* eslint-disable no-unused-expressions */
import RoEmitter from 'roemitter';
import {expect} from 'chai';
import sinon from 'sinon';

import MeshComponent from './MeshComponent';


describe('3D map', () => {
  let component;
  let sceneObject;

  beforeEach(() => {
    sceneObject = {
      eventEmitter: new RoEmitter(),
      positionChanged: sinon.stub()
    };
    component = new MeshComponent({
      sceneObject,
      contentProvider: {
        r: 1, g: 1, b: 1,
        contentProvider: {
          x: 0, y: 0, z: 0, position: {},
          contentProvider: {
            x: 1, y: 1, z: 1, scale: {}
          }
        }
      },
      factory: {
        addFragment: sinon.stub(),
        removeFragment: sinon.stub()
      }
    });
  });

  describe('MeshComponent', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(true);
      expect(component.factory.addFragment.callCount).to.equal(1);
    });

    it('dont call external method until time event was handled', () => {
      expect(component.factory.addFragment.callCount).to.equal(1);
      component.positionChanged({x: 1, y: 2, z: 3});
      expect(component.factory.addFragment.callCount).to.equal(1);
      component.sizeChanged(4, 5, 6);
      expect(component.factory.addFragment.callCount).to.equal(1);
      component.handleComponentTimeEvent();
      expect(component.factory.addFragment.callCount).to.equal(2);
    });

    it('should do force update even if there is no change', () => {
      component.positionChanged({x: 1, y: 2, z: 3});
      expect(component.factory.addFragment.callCount).to.equal(1);
      component.handleComponentTimeEvent();
      expect(component.factory.addFragment.callCount).to.equal(2);

      component.positionChanged({x: 1, y: 2, z: 3});
      expect(component.factory.addFragment.callCount).to.equal(2);
      component.handleComponentTimeEvent();
      expect(component.factory.addFragment.callCount).to.equal(3);
    });

  });
});

/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import {expect} from 'chai';
import sinon from 'sinon';

import MeshComponent from './MeshComponent';


describe('3D map', () => {
  let component;
  let sceneObject;

  beforeEach(() => {
    sceneObject = { positionChanged: sinon.stub(), colorChanged: sinon.stub() };
    component = new MeshComponent({
      sceneObject,
      contentProvider: {
        r: 1, g: 1, b: 1,
        contentProvider: {
          x: 0, y: 0, z: 0, contentProvider: {
            x: 1, y: 1, z: 1
          }
        }
      },
      id: 0,
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
      component.positionChanged(1, 2, 3);
      expect(component.factory.addFragment.callCount).to.equal(1);
      component.sizeChanged(4, 5, 6);
      expect(component.factory.addFragment.callCount).to.equal(1);
      component.handleTimeEvent30Fps();
      expect(component.factory.addFragment.callCount).to.equal(2);
    });

    it('should do nothing if there is no change', () => {
      component.positionChanged(1, 2, 3);
      expect(component.factory.addFragment.callCount).to.equal(1);
      component.handleTimeEvent30Fps();
      expect(component.factory.addFragment.callCount).to.equal(2);

      component.positionChanged(1, 2, 3);
      expect(component.factory.addFragment.callCount).to.equal(2);
      component.handleTimeEvent30Fps();
      expect(component.factory.addFragment.callCount).to.equal(2);
    });

  });
});

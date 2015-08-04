/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import {expect} from 'chai';
import sinon from 'sinon';

import SolidMeshComponent from './SolidMeshComponent';


describe('3D map', () => {
  let component;
  let sceneObject;

  beforeEach(() => {
    sceneObject = {
      positionChanged: sinon.stub(),
      scene: {
        highlightingSingleMeshFactory: {
          addFragment: sinon.stub(),
          removeFragment: sinon.stub()
        }
      }
    };
    component = new SolidMeshComponent({sceneObject});
  });

  describe('SolidMeshComponent', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(true);
      expect(sceneObject.scene.highlightingSingleMeshFactory.addFragment.callCount).to.equal(1);
    });

    it('dont call external method until time event was handled', () => {
      expect(sceneObject.scene.highlightingSingleMeshFactory.addFragment.callCount).to.equal(1);
      component.positionChanged(1, 2, 3);
      expect(sceneObject.scene.highlightingSingleMeshFactory.addFragment.callCount).to.equal(1);
      component.sizeChanged(4, 5, 6);
      expect(sceneObject.scene.highlightingSingleMeshFactory.addFragment.callCount).to.equal(1);
      component.handleTimeEvent30Fps();
      expect(sceneObject.scene.highlightingSingleMeshFactory.addFragment.callCount).to.equal(2);
    });

    it('should do nothing if there is no change', () => {
      component.positionChanged(1, 2, 3);
      expect(sceneObject.scene.highlightingSingleMeshFactory.addFragment.callCount).to.equal(1);
      component.handleTimeEvent30Fps();
      expect(sceneObject.scene.highlightingSingleMeshFactory.addFragment.callCount).to.equal(2);

      component.positionChanged(1, 2, 3);
      expect(sceneObject.scene.highlightingSingleMeshFactory.addFragment.callCount).to.equal(2);
      component.handleTimeEvent30Fps();
      expect(sceneObject.scene.highlightingSingleMeshFactory.addFragment.callCount).to.equal(2);
    });

  });
});

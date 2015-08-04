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
    });

    it('dont call external method until time event was handled', () => {

    });

    it('should do nothing if there is no change', () => {

    });

  });
});

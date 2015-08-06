/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import {expect} from 'chai';
import sinon from 'sinon';

import NodeGroundComponent from './NodeGroundComponent';


describe('3D map', () => {
  let component;
  let sceneObject;

  beforeEach(() => {
    sceneObject = {
      positionChanged: sinon.stub(),
      scene: {
        groundSingleMeshFactory: {
          addFragment: sinon.stub(),
          removeFragment: sinon.stub()
        },
        lineFactory: {
          addFragment: sinon.stub(),
          removeFragment: sinon.stub()
        }
      },
      calculateNodeColor() {
        return {r: 0, g: 0, b: 0};
      }
    };
    component = new NodeGroundComponent({
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

  describe('NodeGroundComponent', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(true);
    });

    it('dont call external method until time event was handled', () => {

    });

    it('should do nothing if there is no change', () => {

    });

  });
});

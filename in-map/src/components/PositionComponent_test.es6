/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import {expect} from 'chai';
import sinon from 'sinon';

import PositionComponent from './PositionComponent';


describe('3D map', () => {
  let component;
  let sceneObject;

  beforeEach(() => {
    sceneObject = {
      positionChanged: sinon.stub()
    };
    component = new PositionComponent({sceneObject});
  });

  describe('Component', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(true);
    });

    it('dont call external method until time event was handled', () => {
      component.setPosition(1, 2, 3);
      expect(sceneObject.positionChanged.callCount).to.equal(0);
      component.handleTimeEvent30Fps();
      expect(sceneObject.positionChanged.callCount).to.equal(1);

      const pos = component.getPosition();
      expect(pos.x).to.equal(1);
      expect(pos.y).to.equal(2);
      expect(pos.z).to.equal(3);
    });

    it('should do nothing if there is no change', () => {
      component.setPosition(1, 2, 3);
      expect(sceneObject.positionChanged.callCount).to.equal(0);
      component.handleTimeEvent30Fps();
      expect(sceneObject.positionChanged.callCount).to.equal(1);


      component.setPosition(1, 2, 3);
      expect(sceneObject.positionChanged.callCount).to.equal(1);
      component.handleTimeEvent30Fps();
      expect(sceneObject.positionChanged.callCount).to.equal(1);
    });

  });
});

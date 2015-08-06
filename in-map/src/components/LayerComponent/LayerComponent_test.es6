/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import {expect} from 'chai';
import sinon from 'sinon';

import LayerComponent from './LayerComponent';


describe('3D map', () => {
  let component;
  let sceneObject;

  beforeEach(() => {
    sceneObject = { positionChanged: sinon.stub() };
    component = new LayerComponent({
      sceneObject
    });
  });

  describe('LayerComponent', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(true);
    });

    it('dont call external method until time event was handled', () => {
      // expect(component.factory.addFragment.callCount).to.equal(1);
      // component.positionChanged(1, 2, 3);
      // expect(component.factory.addFragment.callCount).to.equal(1);
      // component.sizeChanged(4, 5, 6);
      // expect(component.factory.addFragment.callCount).to.equal(1);
      // component.handleTimeEvent30Fps();
      // expect(component.factory.addFragment.callCount).to.equal(2);
    });

    it('should do nothing if there is no change', () => {
      // component.positionChanged(1, 2, 3);
      // expect(component.factory.addFragment.callCount).to.equal(1);
      // component.handleTimeEvent30Fps();
      // expect(component.factory.addFragment.callCount).to.equal(2);
      //
      // component.positionChanged(1, 2, 3);
      // expect(component.factory.addFragment.callCount).to.equal(2);
      // component.handleTimeEvent30Fps();
      // expect(component.factory.addFragment.callCount).to.equal(2);
    });

  });
});

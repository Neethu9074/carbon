/* eslint-env mocha, node */
/* eslint-disable no-unused-expressions */
import {expect} from 'chai';
import sinon from 'sinon';

import Component from './Component';


describe('3D map', () => {
  let component;
  let sceneObject;

  beforeEach(() => {
    sceneObject = {};

    component = new Component(sceneObject);
    component.onInactiveEnter = sinon.stub();
    component.onInitialEnter = sinon.stub();
    component.onInitialLeave = sinon.stub();
  });

  describe('Component', () => {

    it('can be created', () => {
      component.initialized();
      expect(component.isActive()).to.equal(true);
    });
  });
});

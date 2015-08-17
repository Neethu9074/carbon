/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
import {expect} from 'chai';
import sinon from 'sinon';

import Component from './Component';


describe('3D map', () => {
  let component;

  beforeEach(() => {
    const so = {scene: {
      renderScene: sinon.stub()
    }};

    component = new Component(so);
    component.onInactiveEnter = sinon.stub();
    component.onInitialEnter = sinon.stub();
    component.onInitialLeave = sinon.stub();
  });

  describe('Component', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(true);
    });

  });
});

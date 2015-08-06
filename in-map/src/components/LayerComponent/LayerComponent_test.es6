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

  });
});

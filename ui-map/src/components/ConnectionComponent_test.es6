/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import {expect} from 'chai';
import sinon from 'sinon';

import ConnectionComponent from './ConnectionComponent';


describe('3D map', () => {
  let component;
  let sceneObject;

  beforeEach(() => {
    sceneObject = {
      highlightChanged: sinon.stub(),
      selectionChanged: sinon.stub()
    };
    component = new ConnectionComponent({sceneObject});
  });

  describe('Component', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(true);
    });

  });
});

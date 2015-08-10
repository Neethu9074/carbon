/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
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

  describe('ConnectionComponent', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(true);
    });

  });
});

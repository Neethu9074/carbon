/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
import {expect} from 'chai';

import ConnectionComponent from './ConnectionComponent';


describe('3D map', () => {
  let component;
  let sceneObject;

  beforeEach(() => {
    sceneObject = {
      scene: {
        lineFactory: {
          rebuild() {}
        }
      }
    };
    component = new ConnectionComponent({sceneObject});
  });

  describe('ConnectionComponent', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(false);
    });

  });
});

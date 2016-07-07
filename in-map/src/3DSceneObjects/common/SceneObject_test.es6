/* eslint-env mocha, node */
/* eslint-disable no-unused-expressions */
import {expect} from 'chai';

import SceneObject from './SceneObject';


class SpecificSceneObject extends SceneObject {
  constructor(params) {
    super(params);
  }
}

describe('3D map', () => {
  let obj;
  beforeEach(() => {
    obj = new SpecificSceneObject({id: 0});
  });

  describe('SceneObject', () => {
    it('can be disposed', () => {
      obj.dispose();
      expect(obj.subscriptions.length).to.equal(0);
    });
  });
});

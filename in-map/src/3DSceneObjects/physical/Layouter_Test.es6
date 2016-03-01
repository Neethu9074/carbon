/* eslint-disable no-unused-expressions */
/* eslint-env mocha, node */
import {expect} from 'chai';

import Layouter from './Layouter';

describe('3D map', () => {
  let layouter;

  beforeEach(() => {
    layouter = new Layouter();
  });

  describe('physical layouter', () => {

    it('should pass', () => {
      expect(layouter).to.not.equal(undefined);
    });

  });

});

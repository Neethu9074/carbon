/*eslint-env mocha, node */
import {expect} from 'chai';

import * as Handler from './AdaptiveDetailHandler';
// import * as time from '../timeCalculations';


describe('3D map', () => {
  let scene;
  let handler;

  beforeEach(() => {
    scene = {};
    handler = new Handler.AdaptiveDetailHandler(scene);
  });

  describe('AdaptiveDetailHandler', () => {

    it('can calculate state', () => {
      let value = -10000;
      expect(handler.getState(value)).to.equal(Handler.lowState);

      value = 30;
      expect(handler.getState(value)).to.equal(Handler.midState);

      value = 10000;
      expect(handler.getState(value)).to.equal(Handler.maxState);
    });

    it('can calculate average', () => {
      let values = [0, 0, 0, 0, 0];
      expect(handler.getAverage(values)).to.equal(0);

      values = [2, 4, 6, 8, 10];
      expect(handler.getAverage(values)).to.equal(6);
    });

  });

});

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha, node */
import { expect } from 'chai';

import { getBigBangTime, getDeltaTime, getFPS, getNow, reset, update } from 'in-map/misc/time';

describe('in-map', () => {
  describe('misc/time', () => {
    beforeEach(() => {
      reset();
    });

    it('should calculate the time between two timestamps', () => {
      expect(getDeltaTime()).to.equal(0);

      update(10);
      expect(getDeltaTime()).to.equal(0.01);

      update(20);
      expect(getDeltaTime()).to.equal(0.01);

      update(40);
      expect(getDeltaTime()).to.equal(0.02);
    });

    it('should clamp deltaTime to max of 100ms', () => {
      expect(getDeltaTime()).to.equal(0);

      update(1000);
      expect(getDeltaTime()).to.equal(0.1);

      update(20000);
      expect(getDeltaTime()).to.equal(0.1);
    });

    it('should set the big bang time to the time since started', () => {
      expect(getBigBangTime()).to.equal(0);

      update(10);
      expect(getBigBangTime()).to.equal(0.01);

      update(20);
      expect(getBigBangTime()).to.equal(0.02);

      update(100);
      expect(getBigBangTime()).to.equal(0.1);
    });

    it('should return the last given timestamp as now', () => {
      expect(getNow()).to.equal(0);

      update(10);
      expect(getNow()).to.equal(10);

      update(1243);
      expect(getNow()).to.equal(1243);
    });

    it('should return the number of current frames per second', () => {
      expect(getFPS()).to.equal(0);

      for (let i = 1; i <= 10; i++) {
        update(i * 100);
      }
      expect(getFPS()).to.equal(0);

      update(1001);
      expect(getFPS()).to.equal(11);

      update(1100);
      expect(getFPS()).to.equal(11);
    });
  });
});

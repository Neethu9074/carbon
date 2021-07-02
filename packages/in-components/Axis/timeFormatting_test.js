/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
import { expect } from 'chai';

import { days, hours, minutes } from 'in-services/time';
import { getAxisConfig } from './timeFormatting';

describe('timeFormatting', () => {
  let formatter;

  describe('formatting', () => {
    it('must format 10min time ranges as time only', () => {
      formatter = getAxisConfig(minutes.toMillis(10)).formatter;
      expect(formatter(1457124359542)).to.equal('21:45');
    });

    it('must format large time windows as date time', () => {
      formatter = getAxisConfig(hours.toMillis(23)).formatter;
      expect(formatter(1457124309542)).to.equal('2016-03-04, 21:45:09');
    });
  });

  describe('ceil', () => {
    const configTenMinutes = getAxisConfig(minutes.toMillis(10));
    const config24Hours = getAxisConfig(days.toMillis(1));

    it('must ceil to full minute', () => {
      // Sun Mar 06 2016 09:45:09:223 GMT+0100 (CET)
      const time = 1457253909223;
      expect(configTenMinutes.ceilToNearestStep(time)).to.equal(1457253960000);
    });

    it('must respect millis when ceiling', () => {
      // Sun Mar 06 2016 09:51:00:567 GMT+0100 (CET)
      const time = 1457254260567;
      expect(configTenMinutes.ceilToNearestStep(time)).to.equal(1457254320000);
    });

    it('must ceil to full hour', () => {
      // Sun Mar 06 2016 09:45:09:223 GMT+0100 (CET)
      const time = 1457253909223;
      expect(config24Hours.ceilToNearestStep(time)).to.equal(1457254800000);
    });
  });
});

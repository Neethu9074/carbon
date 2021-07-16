/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */
import { expect } from 'chai';

import { compactTimeInterval } from 'in-custom-dashboards/widgets/Slo/Tiles/SloTimeTile';

describe('in-custom-dashboards/widgets/Slo/Tiles/SloTimeTile', function() {
  describe('#compactTimeInterval', function() {
    function testConversionResule(fromDate, toDate) {
      const { fromStr, toStr } = compactTimeInterval(fromDate.getTime(), toDate.getTime());
      return fromStr + ' - ' + toStr;
    }

    it('should remove first year occurrence if equal', function() {
      expect(
        testConversionResule(
          // < just helps code formatting
          new Date(2021, 0, 1, 1, 1, 1),
          new Date(2021, 1, 2, 2, 2, 1)
        )
      ).to.be.equal('Jan. 01 01:01 - Feb. 02, 2021 02:02');
    });
  });
});

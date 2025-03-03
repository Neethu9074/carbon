/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { expect } from 'chai';

jest.mock('in-services/settings', () => ({
  getSingle: () => false
}));

describe('in-services/formatters/number/stringify', () => {
  let withSiPrefixZeroDecimalPlaces: (v: number) => string;

  beforeEach(() => {
    window.instana.numberLocale = {
      decimal: '٫',
      thousands: '٬',
      grouping: [3],
      currency: ['', ''],
      numerals: ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
    };

    jest.resetModules();

    withSiPrefixZeroDecimalPlaces = require('in-services/formatters/number').withSiPrefixZeroDecimalPlaces;
  });

  afterEach(() => {
    delete window.instana.numberLocale;
  });

  describe('withSiPrefixZeroDecimalPlaces', () => {
    it('must not fail for Arabic', () => {
      expect(withSiPrefixZeroDecimalPlaces(1234)).to.equal('١k');
    });
  });
});

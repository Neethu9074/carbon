/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */

import { expect } from 'chai';

jest.mock('in-services/settings', () => ({
  getSingle: () => false
}));

describe('in-services/formatters/number/stringify', () => {
  let withSiPrefixZeroDecimalPlaces: (v: number) => string;

  beforeEach(() => {
    window.instana.numberLocale = {
      // @ts-ignore The d3-format types are incomplete and do not reflect reality
      decimal: '٫',
      // @ts-ignore The d3-format types are incomplete and do not reflect reality
      thousands: '٬',
      grouping: [3],
      currency: ['', ''],
      // @ts-ignore The d3-format types are incomplete and do not reflect reality
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
      expect(withSiPrefixZeroDecimalPlaces(1234)).to.equal('1k');
    });
  });
});

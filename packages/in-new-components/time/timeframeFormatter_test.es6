/* eslint-env mocha */

import { expect } from 'chai';

import format from 'in-new-components/time/timeframeFormatter';

describe('in-new-components/time/timeframeFormatter', () => {
  it('must format live time modes', () => {
    expect(format({ to: null, windowSize: 60000 })).to.equal('Last minute');
    expect(format({ to: null, windowSize: 120000 })).to.equal('Last 2 minutes');
    expect(format({ to: null, windowSize: 3600000 })).to.equal('Last hour');
    expect(format({ to: null, windowSize: 3662000 })).to.equal('Last 1 hour 1 minute');
    expect(format({ to: null, windowSize: 86400000 })).to.equal('Last 24 hours');
  });

  it('must format fixed time modes', () => {
    expect(format({ to: 1519297047052, windowSize: 3600000 })).to.equal('2018-02-22 10:57:27 to 11:57:27 (1h)');
  });

  it('must format custom time modes on same day', () => {
    expect(format({ to: 1519297047052, windowSize: 8500000 })).to.equal('2018-02-22 09:35:47 to 11:57:27 (2h 21m)');
  });

  it('must format custom time modes on different days', () => {
    expect(format({ to: 1519297047052, windowSize: 123400000 })).to.equal(
      '2018-02-21 01:40:47 to 2018-02-22 11:57:27 (1d 10h 16m)'
    );
  });
});

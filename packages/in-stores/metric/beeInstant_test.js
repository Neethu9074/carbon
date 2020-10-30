/* eslint-env mocha */
import { expect } from 'chai';

import { granularityForBeeInstantMetrics } from 'in-stores/metric/beeInstant';
import { hours, minutes, seconds } from 'in-services/time';

const aroundNow = hours.toMillis(1);
const aboutADayAgo = hours.toMillis(25);
const aboutAMonthAgo = 31 * hours.toMillis(24);
const about3MonthsAgo = 91 * hours.toMillis(24);
const about13MonthsAgo = 14 * 30 * hours.toMillis(24);

const expectations = [
  // 10 second
  { age: aroundNow, desired: seconds.toMillis(10), expected: seconds.toMillis(10) },
  { age: aroundNow, desired: seconds.toMillis(1), expected: seconds.toMillis(10) },
  { age: aroundNow, desired: seconds.toMillis(11), expected: seconds.toMillis(10) },
  { age: aroundNow, desired: seconds.toMillis(24), expected: seconds.toMillis(20) },
  { age: aroundNow, desired: seconds.toMillis(59), expected: seconds.toMillis(50) },
  // 1 minute
  { age: aroundNow, desired: minutes.toMillis(1), expected: minutes.toMillis(1) },
  { age: aroundNow, desired: seconds.toMillis(65), expected: minutes.toMillis(1) },
  // 5 minutes
  { age: aroundNow, desired: minutes.toMillis(5), expected: minutes.toMillis(5) },
  { age: aroundNow, desired: minutes.toMillis(6), expected: minutes.toMillis(5) },
  { age: aroundNow, desired: minutes.toMillis(11), expected: minutes.toMillis(10) },
  { age: aroundNow, desired: minutes.toMillis(22), expected: minutes.toMillis(20) },
  { age: aroundNow, desired: minutes.toMillis(59), expected: minutes.toMillis(55) },
  // 1 hour
  { age: aroundNow, desired: hours.toMillis(1), expected: hours.toMillis(1) },
  { age: aroundNow, desired: minutes.toMillis(61), expected: hours.toMillis(1) },
  { age: aroundNow, desired: hours.toMillis(15), expected: hours.toMillis(15) },
  // drops 10 second resolution
  { age: aboutADayAgo, desired: seconds.toMillis(11), expected: minutes.toMillis(1) },
  // drops 1 minute resolution
  { age: aboutAMonthAgo, desired: seconds.toMillis(11), expected: minutes.toMillis(5) },
  { age: aboutAMonthAgo, desired: minutes.toMillis(2), expected: minutes.toMillis(5) },
  // drops 5 minute resolution
  { age: about3MonthsAgo, desired: seconds.toMillis(11), expected: hours.toMillis(1) },
  { age: about3MonthsAgo, desired: minutes.toMillis(2), expected: hours.toMillis(1) },
  { age: about3MonthsAgo, desired: minutes.toMillis(5), expected: hours.toMillis(1) },
  // no metrics
  // fall back to an hour, if there is no data available, then the plot will be empty
  { age: about13MonthsAgo, desired: minutes.toMillis(5), expected: hours.toMillis(1) }
];

describe('in-stores/metric/beeInstana', () => {
  describe('granularityForBeeInstantMetrics', () => {
    expectations.forEach(({ age, desired, expected }) => {
      it(`should return ${expected}ms given user desired ${desired}ms for a time ${age}ms ago`, () => {
        const windowSize = hours.toMillis(1);
        const to = Date.now() - age + windowSize;
        expect(granularityForBeeInstantMetrics(desired, { to, windowSize })).to.equal(expected);
      });
    });
  });
});

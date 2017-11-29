/* eslint-env mocha, node */
import { create } from 'reactive-observables';
import proxyquire from 'proxyquire';
import { expect } from 'chai';

import { resetStoreRegistry } from 'in-stores/store';

describe('timelineStore', () => {
  const TEN_MINUTES = 1000 * 60 * 10;
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const serverTimeMock = create().startWith(ONE_DAY);
  const bigBangTimestampMock = create().startWith(0);
  let mod;

  beforeEach(() => {
    resetStoreRegistry();

    mod = proxyquire('in-components/timeline/timelineStore', {
      'in-stores/timeline': {
        bigBangTimestamp$: bigBangTimestampMock
      },
      'in-stores/serverTime': {
        serverTime$: serverTimeMock
      }
    });
  });

  it('should calculate the correct to and windowSize', () => {
    mod.init();

    let newTimeframe = mod.getTimeframeToSet({ windowSize: TEN_MINUTES, to: ONE_DAY - 100 }, TEN_MINUTES * 2);
    expect(newTimeframe.windowSize).to.equal(TEN_MINUTES * 2);
    expect(newTimeframe.to).to.equal(ONE_DAY - 100);

    newTimeframe = mod.getTimeframeToSet({ windowSize: ONE_DAY - 100, to: ONE_DAY - 50 }, ONE_DAY - 20);
    expect(newTimeframe.windowSize).to.equal(ONE_DAY - 20);
    expect(newTimeframe.to).to.equal(ONE_DAY - 20);

    newTimeframe = mod.getTimeframeToSet({ windowSize: TEN_MINUTES, to: ONE_DAY - 100 }, ONE_DAY * 2);
    expect(newTimeframe.windowSize).to.equal(ONE_DAY);
    expect(newTimeframe.to).to.equal(ONE_DAY);
  });
});

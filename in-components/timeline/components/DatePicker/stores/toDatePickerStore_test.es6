/* eslint-env mocha */
import { create } from 'reactive-observables';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import { stub } from 'sinon';

import { resetStoreRegistry } from 'in-stores/store';

describe('timeline/datepicker/to', () => {
  let mod;
  let bigBangTimestamp$;
  let serverTime$;
  let fromTimestamp$;

  beforeEach(() => {
    resetStoreRegistry();

    bigBangTimestamp$ = create();
    serverTime$ = create();
    fromTimestamp$ = create();
    fromTimestamp$.emit('');

    const storeUtils = proxyquire('in-components/timeline/components/DatePicker/stores/storeUtils', {
      'in-stores/timeline': {
        bigBangTimestamp$
      },
      'in-stores/serverTime': {
        serverTime$
      }
    });

    mod = proxyquire('./toDatePickerStore', {
      'in-components/timeline/components/DatePicker/stores/storeUtils': storeUtils,
      'in-components/timeline/components/DatePicker/stores/fromDatePickerStore': {
        fromTimestamp$
      }
    });

    mod.reset();
  });

  describe('validateTime', () => {
    let isDateTimeValid;
    let isDateTimeValidSubscription;

    beforeEach(() => {
      isDateTimeValid = stub();
      isDateTimeValidSubscription = mod.isDateTimeValid$.subscribe(isDateTimeValid);
    });

    afterEach(() => {
      isDateTimeValidSubscription.dispose();
      isDateTimeValidSubscription = null;
    });

    it('should only validate times when bigbang and servertime are available', () => {
      expect(isDateTimeValid).to.have.callCount(0);

      setValidBigBangAndServertime();

      expect(isDateTimeValid).to.have.callCount(1);
      expect(isDateTimeValid.getCall(0).args[0].date).to.equal(false);
      expect(isDateTimeValid.getCall(0).args[0].time).to.equal(true);
    });

    it('should validate times when bigbang and servertime are available but to is not', () => {
      expect(isDateTimeValid).to.have.callCount(0);

      setValidBigBangAndServertime();
      mod.setDateString('2017-02-05');
      mod.setTimeString('04:13:25');

      expect(isDateTimeValid).to.have.callCount(3);
      expect(isDateTimeValid.getCall(2).args[0].date).to.equal(true);
      expect(isDateTimeValid.getCall(2).args[0].time).to.equal(true);
    });

    it('should validate times when bigbang, servertime and to are available and from is before to', () => {
      expect(isDateTimeValid).to.have.callCount(0);

      setValidBigBangAndServertime();
      mod.setDateString('2017-02-05');
      mod.setTimeString('12:00:01');

      fromTimestamp$.emit(Date.parse('02-05-2017 12:00:00 GMT+0100 (CET)'));

      expect(isDateTimeValid).to.have.callCount(4);
      expect(isDateTimeValid.getCall(3).args[0].date).to.equal(true);
      expect(isDateTimeValid.getCall(3).args[0].time).to.equal(true);

      fromTimestamp$.emit(Date.parse('02-04-2017 12:00:02 GMT+0100 (CET)'));

      expect(isDateTimeValid).to.have.callCount(5);
      expect(isDateTimeValid.getCall(4).args[0].date).to.equal(true);
      expect(isDateTimeValid.getCall(4).args[0].time).to.equal(true);
    });

    it('should not validate times when bigbang, servertime and to are available and from is behind to', () => {
      expect(isDateTimeValid).to.have.callCount(0);

      setValidBigBangAndServertime();
      mod.setDateString('2017-02-05');
      mod.setTimeString('12:00:00');

      fromTimestamp$.emit(Date.parse('02-05-2017 12:00:01 GMT+0100 (CET)'));

      expect(isDateTimeValid).to.have.callCount(4);
      expect(isDateTimeValid.getCall(3).args[0].date).to.equal(true);
      expect(isDateTimeValid.getCall(3).args[0].time).to.equal(false);

      fromTimestamp$.emit(Date.parse('02-06-2017 11:59:59 GMT+0100 (CET)'));

      expect(isDateTimeValid).to.have.callCount(5);
      expect(isDateTimeValid.getCall(4).args[0].date).to.equal(false);
      expect(isDateTimeValid.getCall(4).args[0].time).to.equal(true);
    });

    function setValidBigBangAndServertime() {
      // Sat Feb 04 2017 04:13:26 GMT+0100 (CET)
      bigBangTimestamp$.emit(1486178006594);

      // Mon Feb 06 2017 14:33:26 GMT+0100 (CET)
      serverTime$.emit(1486388006594);
    }
  });
});

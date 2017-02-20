/* eslint-env mocha */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import {stub} from 'sinon';

import {resetStoreRegistry} from 'in-stores/store';


describe('timeline/datepicker/focusedMoment', () => {
  let mod;
  let bigBangTimestamp$;
  let fromTimestamp$;
  let toTimestamp$;
  let serverTime$;


  beforeEach(() => {
    resetStoreRegistry();

    bigBangTimestamp$ = create();
    fromTimestamp$ = create();
    toTimestamp$ = create();
    serverTime$ = create();

    const storeUtils = proxyquire('in-components/timeline/components/DatePicker/stores/storeUtils', {
      'in-stores/timeline': {
        bigBangTimestamp$
      },
      'in-stores/serverTime': {
        serverTime$
      }
    });

    mod = proxyquire('./focusedMomentDatePickerStore', {
      'in-components/timeline/components/DatePicker/stores/storeUtils': storeUtils,
      'in-components/timeline/components/DatePicker/stores/toDatePickerStore': {
        toTimestamp$
      },
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

    it('should only validate times when bigbang, servertime, from and to are available', () => {
      expect(isDateTimeValid).to.have.callCount(0);

      setValidTimes();

      expect(isDateTimeValid).to.have.callCount(1);
      expect(isDateTimeValid.getCall(0).args[0].date).to.equal(false);
      expect(isDateTimeValid.getCall(0).args[0].time).to.equal(true);
    });

    it('should validate date if it is in the range', () => {
      setValidTimes();

      expect(isDateTimeValid).to.have.callCount(1);

      mod.setDateString('2017-02-06');
      mod.setTimeString('00:00:00');
      expect(isDateTimeValid).to.have.callCount(3);
      expect(isDateTimeValid.getCall(2).args[0].date).to.equal(true);
    });

    it('should not validate date if it is before big bang', () => {
      setValidTimes();

      expect(isDateTimeValid).to.have.callCount(1);

      mod.setDateString('2017-02-03');
      mod.setTimeString('00:00:00');
      expect(isDateTimeValid).to.have.callCount(3);
      expect(isDateTimeValid.getCall(2).args[0].date).to.equal(false);
    });

    it('should not validate date if it is after servers time', () => {
      setValidTimes();

      expect(isDateTimeValid).to.have.callCount(1);

      mod.setDateString('2017-02-07');
      mod.setTimeString('00:00:00');
      expect(isDateTimeValid).to.have.callCount(3);
      expect(isDateTimeValid.getCall(2).args[0].date).to.equal(false);
    });


    it('should validate time if it is in the range', () => {
      setValidTimes();

      // set valid date
      mod.setDateString('2017-02-04');

      mod.setTimeString('04:20:01');
      expect(isDateTimeValid.getCall(2).args[0].time).to.equal(true);
    });

    it('should not validate time if it is before big bang', () => {
      setValidTimes();

      // set valid date
      mod.setDateString('2017-02-04');

      mod.setTimeString('04:13:25');
      expect(isDateTimeValid.getCall(2).args[0].time).to.equal(false);
    });

    function setValidTimes() {
      // Sat Feb 04 2017 04:13:26 GMT+0100 (CET)
      bigBangTimestamp$.emit(1486178006594);

      // Mon Feb 06 2017 14:33:26 GMT+0100 (CET)
      serverTime$.emit(1486388006594);

      // Mon Feb 04 2017 14:20:00 GMT+0100 (CET)
      fromTimestamp$.emit(1486178400000);

      // Mon Feb 06 2017 14:25:00 GMT+0100 (CET)
      toTimestamp$.emit(1486387500000);
    }
  });
});

/* eslint-env mocha, node */
import {expect} from 'chai';
import sinon from 'sinon';

import * as time from 'in-map/misc/time';


describe('in-map', () => {
  describe('misc/time', () => {

    beforeEach(() => {
      time.reset();
    });

    it('should calculate the time between two timestamps', () => {
      expect(time.getDeltaTime()).to.equal(0);

      time.update(10);
      expect(time.getDeltaTime()).to.equal(0.01);

      time.update(20);
      expect(time.getDeltaTime()).to.equal(0.01);

      time.update(40);
      expect(time.getDeltaTime()).to.equal(0.02);
    });

    it('should clamp deltaTime to max of 100ms', () => {
      expect(time.getDeltaTime()).to.equal(0);

      time.update(1000);
      expect(time.getDeltaTime()).to.equal(0.1);

      time.update(20000);
      expect(time.getDeltaTime()).to.equal(0.1);
    });

    it('should set the big bang time to the time since started', () => {
      expect(time.getBigBangTime()).to.equal(0);

      time.update(10);
      expect(time.getBigBangTime()).to.equal(0.01);

      time.update(20);
      expect(time.getBigBangTime()).to.equal(0.02);

      time.update(100);
      expect(time.getBigBangTime()).to.equal(0.1);
    });

    it('should return the last given timestamp as now', () => {
      expect(time.getNow()).to.equal(0);

      time.update(10);
      expect(time.getNow()).to.equal(10);

      time.update(1243);
      expect(time.getNow()).to.equal(1243);
    });

    it('should call listener when a given time window has passed', () => {
      const callback = sinon.stub();
      const subscription = time.addTimeEventListener(callback);

      expect(callback).to.have.callCount(0);

      time.update(10);
      expect(callback).to.have.callCount(0);

      time.update(199);
      expect(callback).to.have.callCount(0);

      time.update(200);
      expect(callback).to.have.callCount(1);

      subscription.dispose();
    });

    it('should return the number of current frames per second', () => {
      expect(time.getFPS()).to.equal(0);

      for (let i = 1; i <= 10; i++) {
        time.update(i * 100);
      }
      expect(time.getFPS()).to.equal(0);

      time.update(1001);
      expect(time.getFPS()).to.equal(11);

      time.update(1100);
      expect(time.getFPS()).to.equal(11);
    });
  });
});

/* eslint-env mocha, node */
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';


let fpsToBeReturned = 60;

describe('3D map', () => {
  let scene;
  let handler;
  let Handler;
  let timeMock;

  beforeEach(() => {
    timeMock = {
      getFPS() { return fpsToBeReturned; },
      setFramesWaitingForComponentUpdate: sinon.stub()
    };

    Handler = proxyquire('./AdaptiveDetailHandler.es6', {
      '../timeCalculations': timeMock
    });

    scene = {};
    handler = new Handler.AdaptiveDetailHandler(scene);
  });

  describe('AdaptiveDetailHandler', () => {

    it('switches to max state by default', () => {
      expect(handler.state).to.equal(Handler.maxState);
      expect(timeMock.setFramesWaitingForComponentUpdate.callCount).to.equal(1);
    });

    it('can calculate state', () => {
      let value = -10000;
      expect(handler.getState(value)).to.equal(Handler.lowState);

      value = 30;
      expect(handler.getState(value)).to.equal(Handler.midState);

      value = 10000;
      expect(handler.getState(value)).to.equal(Handler.maxState);
    });

    it('stays in max state since the FPS avg. is > max state min border', () => {
      fpsToBeReturned = 45; // min border for max state

      // tick a few times
      for (let i = 0; i < 10; i++) {
        handler.tick();
      }

      expect(handler.state).to.equal(Handler.maxState);
      expect(timeMock.setFramesWaitingForComponentUpdate.callCount).to.equal(1);
    });

    it('switches to mid state if avg. FPS is between midState min and max', () => {
      // tick a few times
      for (let i = 0; i < 10; i++) {
        fpsToBeReturned = 30; // min border for mid state
        handler.tick();
        fpsToBeReturned = 45; // max border for mid state
        handler.tick();
      }

      expect(handler.state).to.equal(Handler.midState);
      expect(timeMock.setFramesWaitingForComponentUpdate.callCount).to.equal(2);
    });

    it('switches to min state if avg. FPS is between minState min and max', () => {
      // tick a few times
      for (let i = 0; i < 10; i++) {
        fpsToBeReturned = 0; // min border for min state
        handler.tick();
        fpsToBeReturned = 30; // max border for min state
        handler.tick();
      }

      expect(handler.state).to.equal(Handler.lowState);
      expect(timeMock.setFramesWaitingForComponentUpdate.callCount).to.equal(3);
    });

    it('switches: max -> mid -> min -> mid -> max', () => {
      expect(handler.state).to.equal(Handler.maxState);
      expect(timeMock.setFramesWaitingForComponentUpdate.callCount).to.equal(1);

      fpsToBeReturned = 40;
      handler.tick(); handler.tick(); handler.tick(); handler.tick(); handler.tick();
      expect(handler.state).to.equal(Handler.midState);
      expect(timeMock.setFramesWaitingForComponentUpdate.callCount).to.equal(2);

      fpsToBeReturned = 0;
      handler.tick(); handler.tick(); handler.tick(); handler.tick(); handler.tick();
      expect(handler.state).to.equal(Handler.lowState);
      expect(timeMock.setFramesWaitingForComponentUpdate.callCount).to.equal(3);

      fpsToBeReturned = 40;
      handler.tick(); handler.tick(); handler.tick(); handler.tick(); handler.tick();
      expect(handler.state).to.equal(Handler.midState);
      expect(timeMock.setFramesWaitingForComponentUpdate.callCount).to.equal(4);

      fpsToBeReturned = 60;
      handler.tick(); handler.tick(); handler.tick(); handler.tick(); handler.tick();
      expect(handler.state).to.equal(Handler.maxState);
      expect(timeMock.setFramesWaitingForComponentUpdate.callCount).to.equal(5);
    });

    it('can calculate average', () => {
      let values = [0, 0, 0, 0, 0];
      expect(handler.getAverage(values)).to.equal(0);

      values = [2, 4, 6, 8, 10];
      expect(handler.getAverage(values)).to.equal(6);
    });

  });

});

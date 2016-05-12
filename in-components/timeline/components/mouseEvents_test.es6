/* eslint-env mocha, node */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';


describe('mouseEvents', () => {
  let createMouseEvents;
  let mouseEvents;
  const ZOOM_IN = 1;
  const ZOOM_OUT = -1;
  const MIN_ZOOM_LEVEL = 0;
  const MAX_ZOOM_LEVEL = 1000;

  createMouseEvents = proxyquire('in-components/timeline/components/mouseEvents', {
    'in-components/timeline/timelineStore': {
      getValidWindowSize: wz => Math.max(MIN_ZOOM_LEVEL, Math.min(MAX_ZOOM_LEVEL, wz)),
      to$: create().startWith(100)
    },
    'in-stores/serverTime': {
      serverTime$: create().startWith(100)
    },
    'in-services/reactiveMouseEvents': {
      onWheel: () => create().subscribe(),
      onMove: () => create().subscribe(),
      onDown: () => create().subscribe(),
      onUp: () => create().subscribe(),
      onLeave: () => create().subscribe()
    },
    'in-stores/events': {
      eventsInTimeframe$: create().startWith(null)
    }
  });

  beforeEach(() => {
    mouseEvents = createMouseEvents();
  });

  afterEach(() => {
    mouseEvents.dispose();
  });

  describe('getNewTimeframeByScroll', () => {
    it('should clamp to min zoom level', () => {
      const frame = mouseEvents.getNewTimeframeByScroll(ZOOM_IN, 1, MIN_ZOOM_LEVEL, 1);
      expect(frame.windowSize).to.equal(MIN_ZOOM_LEVEL);
    });

    it('should clamp to max zoom level', () => {
      const frame = mouseEvents.getNewTimeframeByScroll(ZOOM_OUT, 1, MAX_ZOOM_LEVEL, 1);
      expect(frame.windowSize).to.equal(MAX_ZOOM_LEVEL);
    });

    it('should reduce/increase the window by 5% * scrollSpeed', () => {
      const oldWindowSize = 500;

      expect(mouseEvents.getNewTimeframeByScroll(ZOOM_OUT, 1, oldWindowSize, 1).windowSize)
        .to.equal(oldWindowSize * 1.05);
      expect(mouseEvents.getNewTimeframeByScroll(ZOOM_OUT, 2, oldWindowSize, 1).windowSize)
        .to.equal(oldWindowSize * 1.1);
      expect(mouseEvents.getNewTimeframeByScroll(ZOOM_IN, 1, oldWindowSize, 1).windowSize)
        .to.equal(oldWindowSize * 0.95);
      expect(mouseEvents.getNewTimeframeByScroll(ZOOM_IN, 2, oldWindowSize, 1).windowSize)
        .to.equal(oldWindowSize * 0.9);
    });

    it('should move the window to the middle if mouse is in the middle on the timeline', () => {
      const oldWindowSize = MIN_ZOOM_LEVEL + ((MAX_ZOOM_LEVEL - MIN_ZOOM_LEVEL) / 2);

      expect(oldWindowSize).to.equal(500);

      const frame = mouseEvents.getNewTimeframeByScroll(ZOOM_IN, 1, oldWindowSize, 0.5);
      expect(frame.windowSize).to.equal(oldWindowSize * 0.95);

      expect(frame.to).to.equal(100 - ((oldWindowSize - frame.windowSize) * 0.5));
    });

    it('should move the window to left if mouse is on the left on the timeline', () => {
      const oldWindowSize = MIN_ZOOM_LEVEL + ((MAX_ZOOM_LEVEL - MIN_ZOOM_LEVEL) / 2);
      const frame = mouseEvents.getNewTimeframeByScroll(ZOOM_IN, 1, oldWindowSize, 0);
      expect(frame.to).to.equal(100 - ((oldWindowSize - frame.windowSize) * 1));
    });

    it('should move the window to right if mouse is on the right on the timeline', () => {
      const oldWindowSize = MIN_ZOOM_LEVEL + ((MAX_ZOOM_LEVEL - MIN_ZOOM_LEVEL) / 2);
      const frame = mouseEvents.getNewTimeframeByScroll(ZOOM_IN, 1, oldWindowSize, 1);
      expect(frame.to).to.equal(100);
    });

    it('should move the window accroding to mouse position', () => {
      const oldWindowSize = MIN_ZOOM_LEVEL + ((MAX_ZOOM_LEVEL - MIN_ZOOM_LEVEL) / 2);

      for (let i = 0; i < 1; i += 0.01) {
        const frame = mouseEvents.getNewTimeframeByScroll(ZOOM_IN, 1, oldWindowSize, i);
        expect(frame.to).to.equal(100 - ((oldWindowSize - frame.windowSize) * (1 - i)));
      }
    });
  });
});

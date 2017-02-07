/* eslint-env mocha, node */
import {fromJS} from 'immutable';
import {expect} from 'chai';

import BasicEventRenderer from 'in-components/timeline/components/renderer/eventRenderer/BasicEventRenderer';
import {setHighlightedEntityId} from 'in-services/stores/highlightedEntityId';
import {setFocusedMoment} from 'in-components/timeline/timelineStore';
import {setSelectedSnapshotId} from 'in-stores/snapshot';


describe('BasicEventRenderer', () => {
  const eventRenderer = new BasicEventRenderer();

  beforeEach(() => {
    setFocusedMoment(null);
    setSelectedSnapshotId(null);
    setHighlightedEntityId(null);
  });

  describe('isEventActive', () => {
    it('should be active by default', () => {
      expect(eventRenderer.isEventActive(getEvent())).to.equal(true);
    });

    it('should be inactive if start is behind focused moment', () => {
      setFocusedMoment(99);
      expect(eventRenderer.isEventActive(getEvent())).to.equal(false);
    });

    it('should be active if start is before focused moment', () => {
      setFocusedMoment(101);
      expect(eventRenderer.isEventActive(getEvent())).to.equal(true);
    });

    it('should be active if it is realted to highlightedEntityId', () => {
      setHighlightedEntityId('schnipi');
      expect(eventRenderer.isEventActive(getEvent())).to.equal(true);
    });

    it('should be inactive if it is not realted to highlightedEntityId', () => {
      setHighlightedEntityId('not defined');
      expect(eventRenderer.isEventActive(getEvent())).to.equal(false);
    });

    it('should be active if it is realted to selectedSnapshotId', () => {
      setSelectedSnapshotId('schnipi');
      expect(eventRenderer.isEventActive(getEvent())).to.equal(true);
    });
  });

  function getEvent() {
    return fromJS({
      id: 'eventId',
      start: 100,
      problem: {
        snapshotId: 'schnipi'
      }
    });
  }
});

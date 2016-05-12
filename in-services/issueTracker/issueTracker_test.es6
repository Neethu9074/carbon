/* eslint-env mocha */
import proxyquire from 'proxyquire';
import Immutable from 'immutable';
import {expect} from 'chai';

import {resetStoreRegistry} from 'in-stores/store';
import {theme} from 'in-services/theme';


describe('issueTracker', () => {

  let issueTracker;

  beforeEach(() => {
    resetStoreRegistry();

    issueTracker = proxyquire('./issueTracker', {});
  });


  describe('getColorForEvent', () => {
    let event;

    beforeEach(() => {
      event = Immutable.fromJS({
        id: '1',
        problem: {
          severity: 10
        },
        type: 'issue',
        state: 'open'
      });
    });

    it('should return default color if the event is open', () => {
      const color = issueTracker.getColorForEvent(event);
      expect(color).to.equal(theme.health[10]);
    });

    it('should return default color if the event is closed', () => {
      event = event.set('state', 'closed');
      const color = issueTracker.getColorForEvent(event);
      expect(color).to.equal(theme.health[0]);
    });

  });
});

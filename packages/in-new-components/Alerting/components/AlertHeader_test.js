/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */

import { expect } from 'chai';

import { getRevision } from 'in-new-components/Alerting/components/AlertHeader';

describe('in-websites/WebsiteDashboard/tabs/Alerts/AlertHeader', () => {
  describe('#getRevision', () => {
    it('calculates if the given config is the newest one', () => {
      expect(getRevision({ created: 42 }, [])).equals(0);
      expect(getRevision({ created: 42 }, [{ created: 42 }])).equals(1);
      expect(getRevision({ created: 42 }, [{ created: 42 }, { created: 0 }])).equals(2);
      expect(getRevision({ created: 0 }, [{ created: 42 }, { created: 0 }])).equals(1);

      expect(getRevision({ created: 0 }, [{ created: 1377 }, { created: 42 }, { created: 0 }])).equals(1);
      expect(getRevision({ created: 42 }, [{ created: 1377 }, { created: 42 }, { created: 0 }])).equals(2);
      expect(getRevision({ created: 1377 }, [{ created: 1377 }, { created: 42 }, { created: 0 }])).equals(3);
    });
  });
});

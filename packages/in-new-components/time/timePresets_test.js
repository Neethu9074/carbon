/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */
import { expect } from 'chai';
import { t } from 'in-i18n';

import { format } from 'in-new-components/time/timePresets.js';

describe('in-new-components/time/timeframeFormatter', () => {
  describe('format', () => {
    it('must format live time modes', () => {
      expect(format(60000)).to.equal(t('in-new-components:time.timePresetsLast', { duration: 'minute' }));
      expect(format(120000)).to.equal(t('in-new-components:time.timePresetsLast', { duration: '2 minutes' }));
      expect(format(3600000)).to.equal(t('in-new-components:time.timePresetsLast', { duration: 'hour' }));
      expect(format(3662000)).to.equal(t('in-new-components:time.timePresetsLast', { duration: '1 hour 1 minute' }));
      expect(format(86400000)).to.equal(t('in-new-components:time.timePresetsLast24Hours'));
    });
  });
});

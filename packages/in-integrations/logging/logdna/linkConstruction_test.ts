/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha, node */
import { expect } from 'chai';

import {
  constructLink,
  ibmCloudDefaultBaseURL,
  logDnaDefaultBaseURL
} from 'in-integrations/logging/logdna/LinkConstruction';

describe('in-integrations/logging/logdna/LinkConstruction', () => {
  describe('constructLink', () => {
    it('should return the expected url given all the parameters', () => {
      expect(constructLink({}, 'LOG_DNA_SAAS', '1234', 'https://happy.com/')).to.deep.equal(
        'https://happy.com/1234/logs/view'
      );
      expect(constructLink({}, 'IBM_CLOUD', '1234', 'https://sunny.com/')).to.deep.equal('https://sunny.com/1234');
    });

    it('should work for previous logdna configurations as well', () => {
      expect(constructLink({}, 'LOG_DNA_SAAS', '1234', null)).to.satisfy((url: string) =>
        url.startsWith(logDnaDefaultBaseURL)
      );
      expect(constructLink({}, 'IBM_CLOUD', '1234', null)).to.satisfy((url: string) =>
        url.startsWith(ibmCloudDefaultBaseURL)
      );
    });
  });
});

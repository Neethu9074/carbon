/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */
import { expect } from 'chai';

import { serializeHosts } from 'in-integrations/logging/coralogix/CoralogixButton';

describe('serializeHosts', () => {
  it('for hostName', () => {
    expect(serializeHosts({ hostName: 'name' })).equals('host:"name" OR hostname:"name"');
  });
  it('when nothing given', () => {
    expect(serializeHosts({})).equals('');
  });
  it('for hostFqdn given', () => {
    expect(serializeHosts({ hostFqdn: 'fqdn' })).equals('host:"fqdn" OR hostname:"fqdn"');
  });
  it('for hostFqdn and hostName given', () => {
    expect(serializeHosts({ hostName: 'name', hostFqdn: 'fqdn' })).equals(
      'host:"name" OR hostname:"name" OR host:"fqdn" OR hostname:"fqdn"'
    );
  });
});

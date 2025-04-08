/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

jest.mock('../../src/serverConfig');

const { header, isDefaultUrlFormat, prefixPathWithTuSegments } = require('in-server/src/services/instanaUrls');
const serverConfig = require('../../src/serverConfig');

describe('in-server/src/services/instanaUrls', () => {
  describe('header', () => {
    it('must contain const request header names', async () => {
      expect(header.tenant).toEqual('x-instana-tenant');
      expect(header.unit).toEqual('x-instana-unit');
    });
  });

  describe('isDefaultUrlFormat', () => {
    it('must verify default url format', async () => {
      // Given
      serverConfig.urlFormatPathStyle = false;

      // When
      const result = await isDefaultUrlFormat();

      // Then
      expect(result).toEqual(true);
    });

    it('must verify custom url format', async () => {
      // Given
      serverConfig.urlFormatPathStyle = true;

      // When
      const result = await isDefaultUrlFormat();

      // Then
      expect(result).toEqual(false);
    });
  });

  describe('prefixPathWithTuSegments', () => {
    it('must prefix the given path with TU segments if urlFormat is path format', () => {
      // Given
      serverConfig.urlFormatPathStyle = true;
      serverConfig.clientConfig = { tenant: 'acme', tenantUnit: 'one' };
      const path = '/foo/bar';

      // When
      const tuPath = prefixPathWithTuSegments(path);

      // Then
      expect(tuPath).toEqual('/acme/one/foo/bar');
    });

    it('must NOT prefix the given path with TU segments if urlFormat is subdomain format', () => {
      // Given
      serverConfig.urlFormatPathStyle = false;
      serverConfig.clientConfig = { tenant: 'acme', tenantUnit: 'one' };
      const path = '/foo/bar';

      // When
      const tuPath = prefixPathWithTuSegments(path);

      // Then
      expect(tuPath).toEqual('/foo/bar');
    });
  });
});

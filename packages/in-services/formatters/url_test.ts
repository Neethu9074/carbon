/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { formatPathWithTU } from 'in-services/formatters/url';
import { config } from 'in-services/config';

jest.mock('in-services/config');

describe('in-services/formatters/url', () => {
  describe('formatPathWithTU', () => {
    it('does NOT prefix the given path with TU segments if urlFormat is not defined', () => {
      // Given
      config.urlFormatPathStyle = undefined;
      config.tenant = 'acme';
      config.tenantUnit = 'one';
      const path = '/foo/bar';

      const tuPath = formatPathWithTU(path);

      expect(tuPath).toEqual('/foo/bar');
    });

    it('does NOT prefix the given path with TU segments if urlFormat is subdomain format', () => {
      // Given
      config.urlFormatPathStyle = false;
      config.tenant = 'acme';
      config.tenantUnit = 'one';
      const path = '/foo/bar';

      const tuPath = formatPathWithTU(path);

      expect(tuPath).toEqual('/foo/bar');
    });

    it('prefixes the given path with TU segments if urlFormat is path format and the path starts with a "/"', () => {
      // Given
      config.urlFormatPathStyle = true;
      config.tenant = 'acme';
      config.tenantUnit = 'one';
      const path = '/foo/bar';

      const tuPath = formatPathWithTU(path);

      expect(tuPath).toEqual('/acme/one/foo/bar');
    });

    it('prefixes the given path with TU segments if urlFormat is path format and the path does NOT start with a "/"', () => {
      // Given
      config.urlFormatPathStyle = true;
      config.tenant = 'acme';
      config.tenantUnit = 'one';
      const path = 'foo/bar';

      const tuPath = formatPathWithTU(path);

      expect(tuPath).toEqual('/acme/one/foo/bar');
    });

    it('does NOT prefix the given path with TU segments if urlFormat is path format and the path starts with a schema like "any://"', () => {
      // Given
      config.urlFormatPathStyle = true;
      config.tenant = 'acme';
      config.tenantUnit = 'one';
      const path = 'any://acme.fun/foo/bar';

      const tuPath = formatPathWithTU(path);

      expect(tuPath).toEqual('any://acme.fun/foo/bar');
    });

    it('does NOT prefix the given path with TU segments if urlFormat is path format and the path starts with a relative schema "//"', () => {
      // Given
      config.urlFormatPathStyle = true;
      config.tenant = 'acme';
      config.tenantUnit = 'one';
      const path = '//acme.fun/foo/bar';

      const tuPath = formatPathWithTU(path);

      expect(tuPath).toEqual('//acme.fun/foo/bar');
    });
  });
});

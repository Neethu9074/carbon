/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error no type definitions available
// eslint-disable-next-line no-restricted-imports
import { pathUrlFormat } from 'in-server/src/services/sharedUrlUtils';
import { config } from 'in-services/config';

/**
 * Hydrates a given path with TU information if the path strategy is configured
 * on the TU and makes sure the given path is a relative path and not a fully
 * qualified or relative URL
 **/
export function formatPathWithTU(path: string) {
  // Make sure to apply TU path only if the given URL is a relative root path,
  // does not start with a schema (http://) or relative schema pattern ("//")
  // and the URL format uses path strategy.
  const isRelativePath = !!path.match(/^(?:(?!\/\/)(?![a-z]+:\/\/))/);
  const isPathStrategy = config.urlFormat === pathUrlFormat;

  if (isPathStrategy && isRelativePath) {
    const delimiter = !path.startsWith('/') ? `/` : '';
    return `/${config.tenant}/${config.tenantUnit}${delimiter}${path}`;
  }

  return path;
}

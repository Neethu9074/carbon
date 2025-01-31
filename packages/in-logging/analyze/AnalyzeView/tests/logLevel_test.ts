/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { LogTag } from '@instana/types';

// eslint-disable-next-line no-restricted-imports
import { LOG_LEVEL } from 'in-logging/queryBuilder';
// eslint-disable-next-line no-restricted-imports
import { getLogLevel } from '../logLevel';

describe('getLogLevel', () => {
  it('should return undefined if no matching tag is found', () => {
    const tags: LogTag[] = [{ name: 'otherTag', stringValue: 'info' }];
    expect(getLogLevel(tags)).toBeUndefined();
  });

  it('should return LogLevel from longValue if it exists', () => {
    const tags: LogTag[] = [{ name: LOG_LEVEL, longValue: 3 }];
    expect(getLogLevel(tags)).toBe('3');
  });

  it('should return LogLevel from booleanValue if it exists', () => {
    const tags: LogTag[] = [{ name: LOG_LEVEL, booleanValue: true }];
    expect(getLogLevel(tags)).toBe('true');
  });

  it('should return LogLevel from stringValue if it exists', () => {
    const tags: LogTag[] = [{ name: LOG_LEVEL, stringValue: 'error' }];
    expect(getLogLevel(tags)).toBe('error');
  });

  it('should return undefined if LOG_LEVEL tag has no valid value', () => {
    const tags: LogTag[] = [{ name: LOG_LEVEL, stringValue: '' }];
    expect(getLogLevel(tags)).toBeUndefined();
  });
});

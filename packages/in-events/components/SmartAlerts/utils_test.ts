/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { getCountLabel } from 'in-events/components/SmartAlerts/utils';

describe('getCountLabel', () => {
  it('returns the count as string if present', () => {
    const stats = { infraAlerts: 5 };
    expect(getCountLabel('infraAlerts', stats)).toBe('5');
  });

  it('returns undefined if id is not present in stats', () => {
    const stats = { infraAlerts: 5 };
    expect(getCountLabel('logAlerts', stats)).toBeUndefined();
  });

  it('returns undefined if stats is undefined', () => {
    expect(getCountLabel('infraAlerts', undefined)).toBeUndefined();
  });
});

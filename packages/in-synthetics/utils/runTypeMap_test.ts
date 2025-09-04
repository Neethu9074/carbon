/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { runTypeOnDemandKey, runTypeOnDemandValue } from 'in-synthetics/utils/constants';
import { getDisplayRunType } from 'in-synthetics/utils/runTypeMap';

describe('getDisplayRunType()', () => {
  it('should convert OnDemand runType to its display On demand', () => {
    expect(getDisplayRunType(runTypeOnDemandKey)).toBe(runTypeOnDemandValue);
    expect(getDisplayRunType('CI/CD')).toBe('CI/CD');
  });
});

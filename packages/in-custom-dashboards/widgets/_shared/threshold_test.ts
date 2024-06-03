/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { getThreshold } from 'in-custom-dashboards/widgets/_shared/threshold';

const formatter = 'number.details';

describe('getThreshold', () => {
  test('>= operator', () => {
    const thresholdFunction = getThreshold(
      { operator: '>=', critical: '100', warning: '50', thresholdEnabled: true },
      formatter
    );
    expect(thresholdFunction(110)).toBe('critical');
    expect(thresholdFunction(100)).toBe('critical');
    expect(thresholdFunction(90)).toBe('warning');
    expect(thresholdFunction(50)).toBe('warning');
    expect(thresholdFunction(40)).toBe('normal');
  });

  test('<= operator', () => {
    const thresholdFunction = getThreshold(
      { operator: '<=', critical: '50', warning: '80', thresholdEnabled: true },
      formatter
    );
    expect(thresholdFunction(110)).toBe('normal');
    expect(thresholdFunction(81)).toBe('normal');
    expect(thresholdFunction(80)).toBe('warning');
    expect(thresholdFunction(70)).toBe('warning');
    expect(thresholdFunction(65)).toBe('warning');
    expect(thresholdFunction(50)).toBe('critical');
    expect(thresholdFunction(40)).toBe('critical');
  });

  test('> operator', () => {
    const thresholdFunction = getThreshold(
      { operator: '>', critical: '100', warning: '50', thresholdEnabled: true },
      formatter
    );
    expect(thresholdFunction(110)).toBe('critical');
    expect(thresholdFunction(100)).toBe('warning');
    expect(thresholdFunction(90)).toBe('warning');
    expect(thresholdFunction(50)).toBe('normal');
    expect(thresholdFunction(49)).toBe('normal');
    expect(thresholdFunction(40)).toBe('normal');
  });

  test('< operator', () => {
    const thresholdFunction = getThreshold(
      { operator: '<', critical: '50', warning: '80', thresholdEnabled: true },
      formatter
    );
    expect(thresholdFunction(110)).toBe('normal');
    expect(thresholdFunction(81)).toBe('normal');
    expect(thresholdFunction(80)).toBe('normal');
    expect(thresholdFunction(70)).toBe('warning');
    expect(thresholdFunction(65)).toBe('warning');
    expect(thresholdFunction(50)).toBe('warning');
    expect(thresholdFunction(49)).toBe('critical');
    expect(thresholdFunction(40)).toBe('critical');
    expect(thresholdFunction(20)).toBe('critical');
  });

  test('undefined value', () => {
    expect(
      getThreshold({ operator: '>=', critical: '100', warning: '50', thresholdEnabled: true }, formatter)(undefined)
    ).toBe('normal');
    expect(
      getThreshold({ operator: '<=', critical: '100', warning: '50', thresholdEnabled: true }, formatter)(undefined)
    ).toBe('normal');
    expect(
      getThreshold({ operator: '>', critical: '100', warning: '50', thresholdEnabled: true }, formatter)(undefined)
    ).toBe('normal');
    expect(
      getThreshold({ operator: '<', critical: '100', warning: '50', thresholdEnabled: true }, formatter)(undefined)
    ).toBe('normal');
    expect(getThreshold(undefined, formatter)(70)).toBe('normal');
  });

  test('thresholdEnabled is false', () => {
    const thresholdFunction = getThreshold(
      { operator: '>=', critical: '100', warning: '50', thresholdEnabled: false },
      formatter
    );
    expect(thresholdFunction(70)).toBe('normal');
    expect(
      getThreshold({ operator: '>=', critical: '100', warning: '50', thresholdEnabled: true }, formatter)(70)
    ).toBe('warning');
  });
});

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { getThreshold } from 'in-custom-dashboards/widgets/_shared/threshold';

const formatter = 'number.details';
const percentageFormatter = 'percentage.details';

describe('getThreshold', () => {
  test('>= operator', () => {
    const thresholdFunction = getThreshold(
      { operator: '>=', critical: '100', warning: '50', thresholdEnabled: true },
      formatter
    );

    expect(thresholdFunction(0)).toBe('normal');
    expect(thresholdFunction(110)).toBe('critical');
    expect(thresholdFunction(100)).toBe('critical');
    expect(thresholdFunction(90)).toBe('warning');
    expect(thresholdFunction(50)).toBe('warning');
    expect(thresholdFunction(40)).toBe('normal');

    // Percentage
    const thresholdFn = getThreshold(
      { operator: '>=', critical: '5', warning: '4', thresholdEnabled: true },
      percentageFormatter
    );

    expect(thresholdFn(0.0)).toBe('normal');
    expect(thresholdFn(0.002)).toBe('normal');
    expect(thresholdFn(0.003)).toBe('normal');
    expect(thresholdFn(0.004)).toBe('normal');
    expect(thresholdFn(0.005)).toBe('normal');
    expect(thresholdFn(0.01)).toBe('normal');
    expect(thresholdFn(0.02)).toBe('normal');
    expect(thresholdFn(0.03)).toBe('normal');
    expect(thresholdFn(0.04)).toBe('warning');
    expect(thresholdFn(0.045)).toBe('warning');
    expect(thresholdFn(0.048)).toBe('warning');
    expect(thresholdFn(0.05)).toBe('critical');
    expect(thresholdFn(0.1)).toBe('critical');
    expect(thresholdFn(0.2)).toBe('critical');
    expect(thresholdFn(0.5)).toBe('critical');
    expect(thresholdFn(4.2)).toBe('critical');
    expect(thresholdFn(6.0)).toBe('critical');
  });

  test('<= operator', () => {
    const thresholdFunction = getThreshold(
      { operator: '<=', critical: '50', warning: '80', thresholdEnabled: true },
      formatter
    );

    expect(thresholdFunction(0)).toBe('critical');
    expect(thresholdFunction(110)).toBe('normal');
    expect(thresholdFunction(81)).toBe('normal');
    expect(thresholdFunction(80)).toBe('warning');
    expect(thresholdFunction(70)).toBe('warning');
    expect(thresholdFunction(65)).toBe('warning');
    expect(thresholdFunction(50)).toBe('critical');
    expect(thresholdFunction(40)).toBe('critical');

    // Percentage
    const thresholdFn = getThreshold(
      { operator: '<=', critical: '4', warning: '5', thresholdEnabled: true },
      percentageFormatter
    );

    expect(thresholdFn(0.0)).toBe('critical');
    expect(thresholdFn(0.002)).toBe('critical');
    expect(thresholdFn(0.003)).toBe('critical');
    expect(thresholdFn(0.004)).toBe('critical');
    expect(thresholdFn(0.005)).toBe('critical');
    expect(thresholdFn(0.01)).toBe('critical');
    expect(thresholdFn(0.02)).toBe('critical');
    expect(thresholdFn(0.03)).toBe('critical');
    expect(thresholdFn(0.04)).toBe('critical');
    expect(thresholdFn(0.045)).toBe('warning');
    expect(thresholdFn(0.048)).toBe('warning');
    expect(thresholdFn(0.05)).toBe('warning');
    expect(thresholdFn(0.1)).toBe('normal');
    expect(thresholdFn(0.2)).toBe('normal');
    expect(thresholdFn(0.5)).toBe('normal');
    expect(thresholdFn(4.2)).toBe('normal');
    expect(thresholdFn(6.0)).toBe('normal');
  });

  test('> operator', () => {
    const thresholdFunction = getThreshold(
      { operator: '>', critical: '100', warning: '50', thresholdEnabled: true },
      formatter
    );

    expect(thresholdFunction(0)).toBe('normal');
    expect(thresholdFunction(110)).toBe('critical');
    expect(thresholdFunction(100)).toBe('warning');
    expect(thresholdFunction(90)).toBe('warning');
    expect(thresholdFunction(50)).toBe('normal');
    expect(thresholdFunction(49)).toBe('normal');
    expect(thresholdFunction(40)).toBe('normal');

    // Percentage
    const thresholdFn = getThreshold(
      { operator: '>', critical: '5', warning: '4', thresholdEnabled: true },
      percentageFormatter
    );

    expect(thresholdFn(0.0)).toBe('normal');
    expect(thresholdFn(0.002)).toBe('normal');
    expect(thresholdFn(0.003)).toBe('normal');
    expect(thresholdFn(0.004)).toBe('normal');
    expect(thresholdFn(0.005)).toBe('normal');
    expect(thresholdFn(0.01)).toBe('normal');
    expect(thresholdFn(0.02)).toBe('normal');
    expect(thresholdFn(0.03)).toBe('normal');
    expect(thresholdFn(0.04)).toBe('normal');
    expect(thresholdFn(0.045)).toBe('warning');
    expect(thresholdFn(0.048)).toBe('warning');
    expect(thresholdFn(0.05)).toBe('warning');
    expect(thresholdFn(0.1)).toBe('critical');
    expect(thresholdFn(0.2)).toBe('critical');
    expect(thresholdFn(0.5)).toBe('critical');
    expect(thresholdFn(4.2)).toBe('critical');
    expect(thresholdFn(6.0)).toBe('critical');
  });

  test('< operator', () => {
    const thresholdFunction = getThreshold(
      { operator: '<', critical: '50', warning: '80', thresholdEnabled: true },
      formatter
    );

    expect(thresholdFunction(0)).toBe('critical');
    expect(thresholdFunction(110)).toBe('normal');
    expect(thresholdFunction(81)).toBe('normal');
    expect(thresholdFunction(80)).toBe('normal');
    expect(thresholdFunction(70)).toBe('warning');
    expect(thresholdFunction(65)).toBe('warning');
    expect(thresholdFunction(50)).toBe('warning');
    expect(thresholdFunction(49)).toBe('critical');
    expect(thresholdFunction(40)).toBe('critical');
    expect(thresholdFunction(20)).toBe('critical');

    // Percentage
    const thresholdFn = getThreshold(
      { operator: '<', critical: '4', warning: '5', thresholdEnabled: true },
      percentageFormatter
    );

    expect(thresholdFn(0.0)).toBe('critical');
    expect(thresholdFn(0.002)).toBe('critical');
    expect(thresholdFn(0.003)).toBe('critical');
    expect(thresholdFn(0.004)).toBe('critical');
    expect(thresholdFn(0.005)).toBe('critical');
    expect(thresholdFn(0.01)).toBe('critical');
    expect(thresholdFn(0.02)).toBe('critical');
    expect(thresholdFn(0.03)).toBe('critical');
    expect(thresholdFn(0.04)).toBe('warning');
    expect(thresholdFn(0.045)).toBe('warning');
    expect(thresholdFn(0.048)).toBe('warning');
    expect(thresholdFn(0.05)).toBe('normal');
    expect(thresholdFn(0.1)).toBe('normal');
    expect(thresholdFn(0.2)).toBe('normal');
    expect(thresholdFn(0.5)).toBe('normal');
    expect(thresholdFn(4.2)).toBe('normal');
    expect(thresholdFn(6.0)).toBe('normal');
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

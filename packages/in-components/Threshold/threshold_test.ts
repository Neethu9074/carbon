/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { getThreshold, extremeValueInSeries } from 'in-components/Threshold/threshold';

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

    const thresholdFunctionOnlyCritical = getThreshold(
      { operator: '>=', critical: '100', thresholdEnabled: true },
      formatter
    );

    expect(thresholdFunctionOnlyCritical(0)).toBe('normal');
    expect(thresholdFunctionOnlyCritical(110)).toBe('critical');
    expect(thresholdFunctionOnlyCritical(100)).toBe('critical');
    expect(thresholdFunctionOnlyCritical(90)).toBe('normal');
    expect(thresholdFunctionOnlyCritical(50)).toBe('normal');
    expect(thresholdFunctionOnlyCritical(40)).toBe('normal');

    const thresholdFunctionOnlyWarning = getThreshold(
      { operator: '>=', warning: '50', thresholdEnabled: true },
      formatter
    );

    expect(thresholdFunctionOnlyWarning(0)).toBe('normal');
    expect(thresholdFunctionOnlyWarning(110)).toBe('warning');
    expect(thresholdFunctionOnlyWarning(100)).toBe('warning');
    expect(thresholdFunctionOnlyWarning(90)).toBe('warning');
    expect(thresholdFunctionOnlyWarning(50)).toBe('warning');
    expect(thresholdFunctionOnlyWarning(40)).toBe('normal');

    // Percentage
    const thresholdPercentageFunction = getThreshold(
      { operator: '>=', critical: '5', warning: '4', thresholdEnabled: true },
      percentageFormatter
    );

    expect(thresholdPercentageFunction(0.0)).toBe('normal');
    expect(thresholdPercentageFunction(0.002)).toBe('normal');
    expect(thresholdPercentageFunction(0.003)).toBe('normal');
    expect(thresholdPercentageFunction(0.004)).toBe('normal');
    expect(thresholdPercentageFunction(0.005)).toBe('normal');
    expect(thresholdPercentageFunction(0.01)).toBe('normal');
    expect(thresholdPercentageFunction(0.02)).toBe('normal');
    expect(thresholdPercentageFunction(0.03)).toBe('normal');
    expect(thresholdPercentageFunction(0.04)).toBe('warning');
    expect(thresholdPercentageFunction(0.045)).toBe('warning');
    expect(thresholdPercentageFunction(0.048)).toBe('warning');
    expect(thresholdPercentageFunction(0.05)).toBe('critical');
    expect(thresholdPercentageFunction(0.1)).toBe('critical');
    expect(thresholdPercentageFunction(0.2)).toBe('critical');
    expect(thresholdPercentageFunction(0.5)).toBe('critical');
    expect(thresholdPercentageFunction(4.2)).toBe('critical');
    expect(thresholdPercentageFunction(6.0)).toBe('critical');
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
    const thresholdPercentageFunction = getThreshold(
      { operator: '<=', critical: '4', warning: '5', thresholdEnabled: true },
      percentageFormatter
    );

    expect(thresholdPercentageFunction(0.0)).toBe('critical');
    expect(thresholdPercentageFunction(0.002)).toBe('critical');
    expect(thresholdPercentageFunction(0.003)).toBe('critical');
    expect(thresholdPercentageFunction(0.004)).toBe('critical');
    expect(thresholdPercentageFunction(0.005)).toBe('critical');
    expect(thresholdPercentageFunction(0.01)).toBe('critical');
    expect(thresholdPercentageFunction(0.02)).toBe('critical');
    expect(thresholdPercentageFunction(0.03)).toBe('critical');
    expect(thresholdPercentageFunction(0.04)).toBe('critical');
    expect(thresholdPercentageFunction(0.045)).toBe('warning');
    expect(thresholdPercentageFunction(0.048)).toBe('warning');
    expect(thresholdPercentageFunction(0.05)).toBe('warning');
    expect(thresholdPercentageFunction(0.1)).toBe('normal');
    expect(thresholdPercentageFunction(0.2)).toBe('normal');
    expect(thresholdPercentageFunction(0.5)).toBe('normal');
    expect(thresholdPercentageFunction(4.2)).toBe('normal');
    expect(thresholdPercentageFunction(6.0)).toBe('normal');
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
    const thresholdPercentageFunction = getThreshold(
      { operator: '>', critical: '5', warning: '4', thresholdEnabled: true },
      percentageFormatter
    );

    expect(thresholdPercentageFunction(0.0)).toBe('normal');
    expect(thresholdPercentageFunction(0.002)).toBe('normal');
    expect(thresholdPercentageFunction(0.003)).toBe('normal');
    expect(thresholdPercentageFunction(0.004)).toBe('normal');
    expect(thresholdPercentageFunction(0.005)).toBe('normal');
    expect(thresholdPercentageFunction(0.01)).toBe('normal');
    expect(thresholdPercentageFunction(0.02)).toBe('normal');
    expect(thresholdPercentageFunction(0.03)).toBe('normal');
    expect(thresholdPercentageFunction(0.04)).toBe('normal');
    expect(thresholdPercentageFunction(0.045)).toBe('warning');
    expect(thresholdPercentageFunction(0.048)).toBe('warning');
    expect(thresholdPercentageFunction(0.05)).toBe('warning');
    expect(thresholdPercentageFunction(0.1)).toBe('critical');
    expect(thresholdPercentageFunction(0.2)).toBe('critical');
    expect(thresholdPercentageFunction(0.5)).toBe('critical');
    expect(thresholdPercentageFunction(4.2)).toBe('critical');
    expect(thresholdPercentageFunction(6.0)).toBe('critical');
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
    const thresholdPercentageFunction = getThreshold(
      { operator: '<', critical: '4', warning: '5', thresholdEnabled: true },
      percentageFormatter
    );

    expect(thresholdPercentageFunction(0.0)).toBe('critical');
    expect(thresholdPercentageFunction(0.002)).toBe('critical');
    expect(thresholdPercentageFunction(0.003)).toBe('critical');
    expect(thresholdPercentageFunction(0.004)).toBe('critical');
    expect(thresholdPercentageFunction(0.005)).toBe('critical');
    expect(thresholdPercentageFunction(0.01)).toBe('critical');
    expect(thresholdPercentageFunction(0.02)).toBe('critical');
    expect(thresholdPercentageFunction(0.03)).toBe('critical');
    expect(thresholdPercentageFunction(0.04)).toBe('warning');
    expect(thresholdPercentageFunction(0.045)).toBe('warning');
    expect(thresholdPercentageFunction(0.048)).toBe('warning');
    expect(thresholdPercentageFunction(0.05)).toBe('normal');
    expect(thresholdPercentageFunction(0.1)).toBe('normal');
    expect(thresholdPercentageFunction(0.2)).toBe('normal');
    expect(thresholdPercentageFunction(0.5)).toBe('normal');
    expect(thresholdPercentageFunction(4.2)).toBe('normal');
    expect(thresholdPercentageFunction(6.0)).toBe('normal');
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

describe('seriesMetricValue', () => {
  test('increasing', () => {
    expect(
      extremeValueInSeries({ operator: '>=', thresholdEnabled: true }, [
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5]
      ])
    ).toBe(5);
    expect(
      extremeValueInSeries({ operator: '<', thresholdEnabled: true }, [
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5]
      ])
    ).toBe(1);
  });
  test('up and down', () => {
    expect(
      extremeValueInSeries({ operator: '>=', thresholdEnabled: true }, [
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 2],
        [5, 1]
      ])
    ).toBe(3);
    expect(
      extremeValueInSeries({ operator: '<', thresholdEnabled: true }, [
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 2],
        [5, 1]
      ])
    ).toBe(1);
  });
});

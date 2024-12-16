/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import useMetricAlignedWidgetTimeConfig from 'in-custom-dashboards/widgets/SloLegacy/hooks/useMetricAlignedWidgetTimeConfig';

describe('in-custom-dashboards/widgets/SloLegacy/hooks/useMetricAlignedWidgetTimeConfig', () => {
  it('returns the original TimeWindowConfig unchanged if the metric is undefined', () => {
    // Given
    const metric = undefined;
    const timeConfig = {
      to: 10,
      windowSize: 2
    };
    const timeWindowConfig = {
      timeConfig,
      toTimestamp: 10,
      fromTimestamp: 8
    };

    // When
    const actual = useMetricAlignedWidgetTimeConfig(timeWindowConfig, metric);

    // Then
    expect(actual).toEqual(timeWindowConfig);
  });

  it('returns the original TimeWindowConfig unchanged if the metric does not contain an adjustedTimeframe', () => {
    // Given
    const metric = { adjustedTimeframe: undefined };
    const timeConfig = {
      to: 10,
      windowSize: 2,
      autoRefresh: false
    };
    const timeWindowConfig = {
      timeConfig,
      toTimestamp: 10,
      fromTimestamp: 8
    };

    // When
    const actual = useMetricAlignedWidgetTimeConfig(timeWindowConfig, metric);

    // Then
    expect(actual).toEqual(timeWindowConfig);
  });

  it('returns an updated TimeWindowConfig that is based on the metrics adjustedTimeframe if its present', () => {
    // Given
    const metric = {
      adjustedTimeframe: {
        to: 11,
        windowSize: 4
      }
    };
    const timeConfig = {
      to: 10,
      windowSize: 2,
      autoRefresh: false
    };
    const timeWindowConfig = {
      timeConfig,
      toTimestamp: 10,
      fromTimestamp: 8
    };

    // When
    const actual = useMetricAlignedWidgetTimeConfig(timeWindowConfig, metric);

    // Then
    expect(actual).toEqual({
      toTimestamp: 11,
      fromTimestamp: 7,
      timeConfig: {
        to: 11,
        windowSize: 4,
        autoRefresh: false
      }
    });
  });
});

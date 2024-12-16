/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { renderHook } from '@testing-library/react-hooks';

import useWidgetTimeConfig from 'in-custom-dashboards/widgets/SloLegacy/hooks/useWidgetTimeConfig';
import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import { dateFormat, timeFormat } from 'in-services/formatters/date';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { days } from 'in-services/time';

jest.mock('in-hooks/useTimeConfig', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.useFakeTimers('modern');

const defaultTimestamp = new Date(2015, 2, 12).getTime();

describe('in-custom-dashboards/widgets/SloLegacy/hooks/useWidgetTimeConfig', () => {
  beforeEach(() => {
    jest.setSystemTime(defaultTimestamp);
  });

  const oneWeekInMillis = days.toMillis(7);

  const now = new Date();
  const widgetTimeConfig = {
    isPreview: true,
    isRolling: false,
    isFixed: false,
    timeWindowDuration: 1,
    timeWindowDurationUnit: 'days',
    timeWindowStartDate: formatDateWithActiveLanguage(now, dateFormat),
    timeWindowStartTime: formatDateWithActiveLanguage(now, timeFormat)
  };

  it('should return a windowSize of 7 days if timeWindowDuration is less then 7 days', () => {
    // GIVEN
    const config = { ...widgetTimeConfig };

    // WHEN
    const { result } = renderHook(() => useWidgetTimeConfig(config));

    // THEN
    const { toTimestamp, fromTimestamp, timeConfig } = result.current;
    const { windowSize, to } = timeConfig;

    expect(windowSize).toBe(oneWeekInMillis);
    expect(toTimestamp).toBe(fromTimestamp + oneWeekInMillis);
    expect(to).toBe(undefined);
  });

  it('should return a windowSize of 7 days if timeWindowDuration is more then 7 days', () => {
    // GIVEN
    const config = {
      ...widgetTimeConfig,
      timeWindowDuration: 10
    };

    // WHEN
    const { result } = renderHook(() => useWidgetTimeConfig(config));

    // THEN
    const { toTimestamp, fromTimestamp, timeConfig } = result.current;
    const { windowSize, to } = timeConfig;

    expect(windowSize).toBe(oneWeekInMillis);
    expect(toTimestamp).toBe(fromTimestamp + oneWeekInMillis);
    expect(to).toBe(undefined);
  });

  it('should return a windowSize of 1 days if isRolling is true', () => {
    // GIVEN
    const config = { ...widgetTimeConfig, isRolling: true };

    // WHEN
    const { result } = renderHook(() => useWidgetTimeConfig(config));

    // THEN
    const { toTimestamp, fromTimestamp, timeConfig } = result.current;
    const { windowSize, to } = timeConfig;
    const daysInMillis = days.toMillis(config.timeWindowDuration);

    expect(windowSize).toBe(daysInMillis);
    expect(toTimestamp).toBe(fromTimestamp + daysInMillis);
    expect(to).toBe(toTimestamp);
  });

  it('should return a windowSize of 1 days if isFixed is true', () => {
    // GIVEN
    const config = { ...widgetTimeConfig, isFixed: true };

    // WHEN
    const { result } = renderHook(() => useWidgetTimeConfig(config));

    // THEN
    const { toTimestamp, fromTimestamp, timeConfig } = result.current;
    const { windowSize, to } = timeConfig;
    const daysInMillis = days.toMillis(config.timeWindowDuration);

    expect(windowSize).toBe(daysInMillis);
    expect(toTimestamp).toBe(fromTimestamp + daysInMillis);
    expect(to).toBe(toTimestamp);
  });

  it('should return a windowSize of 1 days if isRolling and isFixed are true', () => {
    // GIVEN
    const config = { ...widgetTimeConfig, isRolling: true, isFixed: true };

    // WHEN
    const { result } = renderHook(() => useWidgetTimeConfig(config));

    // THEN
    const { toTimestamp, fromTimestamp, timeConfig } = result.current;
    const { windowSize, to } = timeConfig;
    const daysInMillis = days.toMillis(config.timeWindowDuration);

    expect(windowSize).toBe(daysInMillis);
    expect(toTimestamp).toBe(fromTimestamp + daysInMillis);
    expect(to).toBe(toTimestamp);
  });

  it('should return timeConfig without specific properties if autoRefresh is enabled ', () => {
    // GIVEN
    const config = { ...widgetTimeConfig, isPreview: false };

    useTimeConfig.mockReturnValueOnce({
      windowSize: days.toMillis(7),
      autoRefresh: true
    });

    // WHEN
    const { result } = renderHook(() => useWidgetTimeConfig(config));

    // THEN
    const { timeConfig } = result.current;

    expect(timeConfig.autoRefresh).toBe(true);
    expect(timeConfig).not.toHaveProperty('to');
    expect(timeConfig).not.toHaveProperty('focusedMoment');
  });

  it('should return timeConfig with default time window', () => {
    // GIVEN
    const config = { ...widgetTimeConfig, timeWindowStartDate: null, isFixed: true };

    // WHEN
    const { result } = renderHook(() => useWidgetTimeConfig(config));

    // THEN
    const { timeConfig, fromTimestamp, toTimestamp } = result.current;
    const { windowSize } = timeConfig;
    const timestampDelta = toTimestamp - fromTimestamp;

    expect(windowSize).toEqual(timestampDelta);
  });
});

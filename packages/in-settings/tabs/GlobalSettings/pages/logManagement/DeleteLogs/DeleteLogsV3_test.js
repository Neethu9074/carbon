/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { addDays, addHours, getTime, hoursToMilliseconds, subDays } from 'date-fns';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';

import { formatTimeWithoutSeconds } from '@instana/format-date';

import useDeleteLogsV3Form from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsV3/useDeleteLogsV3Form';
import { modalLocalisationStrings } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/localisationStrings';
import { timeConfigFromTimeRange } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/utils';

const generateTagFilter = numberOfElements => {
  let tagFilterExpression = [];

  for (let i = 0; i < numberOfElements; i++) {
    tagFilterExpression = [
      ...tagFilterExpression,
      {
        type: 'TAG_FILTER',
        name: 'log.message',
        operator: 'CONTAINS',
        value: 'test'
      },
      {
        logicalOperator: 'AND',
        type: 'CONJUNCTION'
      }
    ];
  }

  return tagFilterExpression.slice(0, -1);
};

describe('useDeleteLogsV3Form', () => {
  const fixedTestDate = new Date('2025-07-02T10:00:00.000Z');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedTestDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('form time range validation works correctly', () => {
    const { result, rerender } = renderHook(() => useDeleteLogsV3Form());

    const currentDate = fixedTestDate;
    const currentTime = formatTimeWithoutSeconds(fixedTestDate);

    act(() => {
      result.current.setInputValues.endTime(currentTime);
      result.current.setInputValues.startTime(currentTime);
      result.current.setInputValues.endDate(currentDate);
      result.current.setInputValues.startDate(currentDate);
    });

    expect(result.current.validationMessages.timeRange).toBe(modalLocalisationStrings.invalidTimeRangeSameMoment);

    act(() => {
      result.current.setInputValues.endDate(subDays(currentDate, 1));
    });

    expect(result.current.validationMessages.timeRange).toBe(modalLocalisationStrings.invalidTimeRange);

    act(() => {
      result.current.setInputValues.startDate(subDays(currentDate, 2));
    });

    expect(result.current.validationMessages.timeRange).toBeFalsy();

    act(() => {
      result.current.setInputValues.endDate(addDays(fixedTestDate, 3));
    });

    expect(result.current.validationMessages.timeRange).toBe(modalLocalisationStrings.invalidTimeRangeFuture);

    rerender();
  });

  it('form filter validation is working correctly', () => {
    const { result, rerender } = renderHook(() => useDeleteLogsV3Form());

    act(() => {
      result.current.setInputValues.tagFilterExpression(generateTagFilter(5));
    });

    expect(result.current.validationMessages.tagFilterExpression).toBeFalsy();

    act(() => {
      result.current.setInputValues.tagFilterExpression(generateTagFilter(6));
    });

    expect(result.current.validationMessages.tagFilterExpression).toBe(modalLocalisationStrings.filterLimitReached);
  });

  it('time config is generated correctly', () => {
    const timeSelection = {
      startDate: fixedTestDate,
      startTime: formatTimeWithoutSeconds(fixedTestDate),
      endDate: fixedTestDate,
      endTime: formatTimeWithoutSeconds(fixedTestDate)
    };

    expect(timeConfigFromTimeRange(timeSelection)).toEqual({ to: getTime(fixedTestDate), windowSize: 0 });

    timeSelection.endDate = addDays(timeSelection.endDate, 1);

    expect(timeConfigFromTimeRange(timeSelection)).toEqual({
      to: getTime(addDays(fixedTestDate, 1)),
      windowSize: hoursToMilliseconds(24)
    });

    timeSelection.endDate = null;

    expect(timeConfigFromTimeRange(timeSelection)).toBeNull();
  });
});

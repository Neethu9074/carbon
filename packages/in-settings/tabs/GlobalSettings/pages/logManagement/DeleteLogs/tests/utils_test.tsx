/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render } from '@testing-library/react';
import React from 'react';

import { IconButton } from '@instana/components';
import { themes } from '@instana/design-tokens';

import {
  DELETE_STATUS,
  timestampToLocaleDateTime,
  renderIconsByStatus,
  addSecondsIfValidFormat,
  bytesToLargerUnit,
  getMonthName,
  getDeletedLineCount,
  getTableState,
  TableState,
  getCarbonDataRows
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/utils';
import { getDesignLibraryColorBySeverity, getDesignLibrarySeverityIcon } from 'in-stores/events';
import { DeleteLogsHistoryItem, DeleteLogsHistoryResult, Result } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeletionTable.mless';

describe('timestampToLocaleDateTime', () => {
  test('should convert nanosecond timestamp to formatted date string', () => {
    const timestamp = 1700000000000000;
    const expectedDate = new Date(Math.round(timestamp / 1000000)).toISOString().slice(0, 16).replace('T', ', ');

    expect(timestampToLocaleDateTime(timestamp)).toBe(expectedDate);
  });
  test('should correctly format a known timestamp', () => {
    const timestamp = 1700000000000000;
    const result = timestampToLocaleDateTime(timestamp);

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}, \d{2}:\d{2}$/);
  });

  test('should handle epoch timestamp (0 nanoseconds)', () => {
    expect(timestampToLocaleDateTime(0)).toBe('1970-01-01, 00:00');
  });
});

describe('renderIconsByStatus', () => {
  test('should return the correct icon for "done" status', () => {
    const result = renderIconsByStatus(DELETE_STATUS.done);
    expect(result).toEqual(
      <IconButton
        type="lib_uncheck"
        color={themes.default.ids.color.option.green[500]}
        iconSize={'xs'}
        isWrapperedByTooltip
        iconDescription={t('in-logging:deleteLogsTootilpSuccess')}
        enterDelayMs={500}
      />
    );
  });

  test('should return the correct icon for "failed" status', () => {
    const result = renderIconsByStatus(DELETE_STATUS.failed);
    expect(result).toEqual(
      <IconButton
        type={getDesignLibrarySeverityIcon(10)}
        color={getDesignLibraryColorBySeverity(10)}
        iconSize={'xs'}
        isWrapperedByTooltip
        iconDescription={t('in-logging:deleteLogsTooltipFailed')}
        enterDelayMs={500}
      />
    );
  });

  test('should return a spinner for "inProgress" status', () => {
    const result = renderIconsByStatus(DELETE_STATUS.inProgress);
    expect(result).not.toBeNull();
  });
});

describe('addSecondsIfValidFormat', () => {
  test('should add seconds to valid HH:mm format', () => {
    expect(addSecondsIfValidFormat('12:30')).toBe('12:30:00');
  });

  test('should return the same input if not in HH:mm format', () => {
    expect(addSecondsIfValidFormat('invalid')).toBe('invalid');
    expect(addSecondsIfValidFormat('123:456')).toBe('123:456');
  });
});

describe('bytesToLargerUnit', () => {
  test('correctly converts 1 GiB', () => {
    const result = bytesToLargerUnit(1024 ** 3); // 1 GiB in bytes
    expect(result.amount).toBeCloseTo(1, 2);
    expect(result.localizedUnit).toBe('GiB');
  });

  test('correctly converts 1 TiB', () => {
    const result = bytesToLargerUnit(1024 ** 4); // 1 TiB in bytes
    expect(result.amount).toBeCloseTo(1, 2);
    expect(result.localizedUnit).toBe('TiB');
  });

  test('correctly converts 5 TiB', () => {
    const result = bytesToLargerUnit(5 * 1024 ** 4); // 5 TiB in bytes
    expect(result.amount).toBeCloseTo(5, 2);
    expect(result.localizedUnit).toBe('TiB');
  });

  test('rounds to 2 decimal places correctly', () => {
    const result = bytesToLargerUnit(1500000000, 2); // ~1.4 GiB
    expect(result.amount).toBeCloseTo(1.4, 2);
    expect(result.localizedUnit).toBe('GiB');
  });

  test('handles small values correctly (below 1 GiB)', () => {
    const result = bytesToLargerUnit(500000000);
    expect(result.amount).toBeCloseTo(0.4657, 2);
    expect(result.localizedUnit).toBe('GiB');
  });
});

describe('getMonthName', () => {
  test('should return the correct month name', () => {
    expect(getMonthName(1)).toBe('January');
    expect(getMonthName(12)).toBe('December');
  });

  test('should return a valid month for mid-year values', () => {
    expect(getMonthName(6)).toBe('June');
  });
});

describe('getDeletedLineCount', () => {
  test('should return "–" when the status is "inProgress"', () => {
    const item: DeleteLogsHistoryItem = {
      deletedLineCount: 1000,
      deletedStatus: DELETE_STATUS.inProgress,
      reason: 'Test reason',
      timestamp: 123456789,
      triggeredByUser: 'User A'
    };
    expect(getDeletedLineCount(item)).toBe('–');
  });

  test('should return the formatted number when deletedLineCount is not null', () => {
    const item: DeleteLogsHistoryItem = {
      deletedLineCount: 5000,
      deletedStatus: DELETE_STATUS.done,
      reason: 'Test reason',
      timestamp: 123456789,
      triggeredByUser: 'User B'
    };
    expect(getDeletedLineCount(item)).toBe('5k');
  });

  test('should return LoadingSkeleton when deletedLineCount is null', () => {
    const item = {
      deletedLineCount: null,
      deletedStatus: DELETE_STATUS.done,
      reason: 'Test reason',
      timestamp: 123456789,
      triggeredByUser: 'User A'
    };

    const { container } = render(getDeletedLineCount(item as any) as any);
    const skeleton = container.querySelector(`.${locals.skeleton}`);

    expect(skeleton).not.toBeNull();
  });
});

describe('getTableState function', () => {
  it('should return LOADING when result is loading', () => {
    const result: Result<DeleteLogsHistoryResult> = {
      errors: [],
      progress: { loading: true }
    };

    expect(getTableState(result)).toBe(TableState.LOADING);
  });

  it('should return ERROR when result has errors', () => {
    const result: Result<DeleteLogsHistoryResult> = {
      errors: [{ code: 'NOT_FOUND', message: 'Data not found' }],
      progress: { loading: false }
    };

    expect(getTableState(result)).toBe(TableState.ERROR);
  });

  it('should return SUCCESS when there are deletions in the result', () => {
    const deletionItem: DeleteLogsHistoryItem = {
      deletedLineCount: 100,
      deletedStatus: 'Done',
      reason: 'Test reason',
      timestamp: 1638500000000,
      triggeredByUser: 'testUser'
    };

    const result: Result<DeleteLogsHistoryResult> = {
      errors: [],
      progress: { loading: false },
      data: { deletions: [deletionItem] }
    };

    expect(getTableState(result)).toBe(TableState.SUCCESS);
  });

  it('should return EMPTY when no deletions are present', () => {
    const result: Result<DeleteLogsHistoryResult> = {
      errors: [],
      progress: { loading: false },
      data: { deletions: [] }
    };

    expect(getTableState(result)).toBe(TableState.EMPTY);
  });

  it('should return EMPTY when no data is present in the result', () => {
    const result: Result<DeleteLogsHistoryResult> = {
      errors: [],
      progress: { loading: false },
      data: undefined
    };

    expect(getTableState(result)).toBe(TableState.EMPTY);
  });
});
describe('getCarbonDataRows', () => {
  it('should return an empty array if there are no deletions', () => {
    const result: Result<DeleteLogsHistoryResult> = {
      errors: [],
      progress: { loading: false },
      data: { deletions: [] }
    };

    const dataRows = getCarbonDataRows(result);
    expect(dataRows).toEqual([]);
  });

  it('should return an empty array when data.deletions is undefined', () => {
    const result: Result<DeleteLogsHistoryResult> = {
      errors: [],
      progress: { loading: false },
      data: { deletions: undefined }
    };

    const dataRows = getCarbonDataRows(result);
    expect(dataRows).toEqual([]);
  });
  it('should sort deletions by timestamp and map data correctly, including date and line count formatting', () => {
    const deletionItem1 = {
      deletedLineCount: 100,
      deletedStatus: DELETE_STATUS.done,
      reason: 'Reason 1',
      timestamp: 1638500000000,
      triggeredByUser: 'user1'
    };

    const deletionItem2 = {
      deletedLineCount: 200,
      deletedStatus: DELETE_STATUS.inProgress,
      reason: 'Reason 2',
      timestamp: 1638600000000,
      triggeredByUser: 'user2'
    };

    const deletionHistoryResult = {
      data: { deletions: [deletionItem1, deletionItem2] },
      errors: [],
      progress: { loading: false }
    };

    const dataRows = getCarbonDataRows(deletionHistoryResult);

    expect(dataRows[0].id).toBe('0');
    expect(dataRows[1].id).toBe('1');

    expect(dataRows[0].Status).not.toBeNull();
    expect(dataRows[1].Status).not.toBeNull();
    //Its sorted
    expect(dataRows[0].Timestamp).toBe(timestampToLocaleDateTime(deletionItem1.timestamp));
    expect(dataRows[1].Timestamp).toBe(timestampToLocaleDateTime(deletionItem2.timestamp));

    expect(dataRows[0].Reason).toBe(deletionItem2.reason);
    expect(dataRows[1].Reason).toBe(deletionItem1.reason);

    expect(dataRows[0]['Number of logs']).toBe(getDeletedLineCount(deletionItem2));
    expect(dataRows[1]['Number of logs']).toBe(getDeletedLineCount(deletionItem1));

    expect(dataRows[0]['Triggered by']).toBe(deletionItem2.triggeredByUser);
    expect(dataRows[1]['Triggered by']).toBe(deletionItem1.triggeredByUser);
  });
});

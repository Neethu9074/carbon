/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { LogGroupItem, LogItem, TagFilter, TagFilterExpression } from '@instana/types';

import { extractTagNames, getLabel, getMetric, handleLogCallsWithFilters, isLogItem } from '..';
import { ANALYZE_LOGGING_LOG_GETLOGS_FILTERS } from 'in-services/tracking/eventNames';

describe('Log Functions', () => {
  describe('getMetric', () => {
    it('should return numberOfLogs from LogGroupItem', () => {
      const logGroupItem: LogGroupItem = {
        cursor: { ingestionTime: 1609459200, offset: 1234 },
        label: 'Test Logs',
        numberOfLogs: 100,
        percentage: 50
      };
      const result = getMetric(logGroupItem);
      expect(result).toBe(100);
    });
  });

  describe('getLabel', () => {
    it('should return label from LogGroupItem', () => {
      const logGroupItem: LogGroupItem = {
        cursor: { ingestionTime: 1609459200, offset: 1234 },
        label: 'Test Logs',
        numberOfLogs: 100,
        percentage: 50
      };
      const result = getLabel(logGroupItem);
      expect(result).toBe('Test Logs');
    });
  });

  describe('isLogItem', () => {
    it('should return true for valid LogItem', () => {
      const validLogItem: LogItem = { tags: [], itemId: '123', timestamp: 1609459200, message: 'Test log message' };
      const result = isLogItem(validLogItem);
      expect(result).toBe(true);
    });

    it('should return false for invalid LogItem', () => {
      const invalidLogItem = { id: '123', time: 1609459200 };
      const result = isLogItem(invalidLogItem);
      expect(result).toBe(false);
    });

    it('should return false when log is undefined', () => {
      const result = isLogItem(undefined);
      expect(result).toBe(false);
    });
  });

  describe('handleLogCallsWithFilters', () => {
    const mockTrackCta = jest.fn();
    const timeConfig = { windowSize: 1000, autoRefresh: true };
    const tagFilterExpression: TagFilterExpression = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [
        { type: 'TAG_FILTER', name: 'host' } as TagFilter,
        { type: 'TAG_FILTER', name: 'service' } as TagFilter
      ]
    };

    it('should call trackCta with correct parameters', () => {
      handleLogCallsWithFilters(mockTrackCta, { timeConfig, tagFilterExpression });

      expect(mockTrackCta).toHaveBeenCalledWith(ANALYZE_LOGGING_LOG_GETLOGS_FILTERS, {
        timeConfig,
        tags: ['host', 'service']
      });
    });
  });

  describe('extractTagNames', () => {
    it('should extract tag names from a single tag filter', () => {
      const tagFilter: TagFilter = {
        booleanValue: true,
        entity: 'NOT_APPLICABLE',
        name: 'host',
        operator: 'EQUALS',
        type: 'TAG_FILTER'
      };
      const result = extractTagNames(tagFilter);
      expect(result).toEqual(['host']);
    });

    it('should extract tag names from a nested expression', () => {
      const tagFilterExpression: TagFilterExpression = {
        type: 'EXPRESSION',
        logicalOperator: 'AND',
        elements: [
          { type: 'TAG_FILTER', name: 'host' } as TagFilter,
          { type: 'TAG_FILTER', name: 'service' } as TagFilter
        ]
      };
      const result = extractTagNames(tagFilterExpression);
      expect(result).toEqual(['host', 'service']);
    });

    it('should handle an empty expression', () => {
      const tagFilterExpression: TagFilterExpression = {
        type: 'EXPRESSION',
        logicalOperator: 'AND',
        elements: []
      };
      const result = extractTagNames(tagFilterExpression);
      expect(result).toEqual([]);
    });

    it('should remove duplicate tag names', () => {
      const tagFilterExpression: TagFilterExpression = {
        type: 'EXPRESSION',
        logicalOperator: 'AND',
        elements: [{ type: 'TAG_FILTER', name: 'host' } as TagFilter, { type: 'TAG_FILTER', name: 'host' } as TagFilter]
      };
      const result = extractTagNames(tagFilterExpression);
      expect(result).toEqual(['host']);
    });
  });
});

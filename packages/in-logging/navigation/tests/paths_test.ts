/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

// eslint-disable-next-line no-restricted-imports
import {
  dashboardManagementPath,
  dashboardDeletePath,
  dashboardSmartAlertsPath,
  loggingDashboardPath,
  useGenerateLinkToLogs,
  useLinkToLogs
} from '../paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { TagFilterExpression, TimeConfig } from 'in-types';
import { setTimeConfig } from 'in-stores/time/config';

jest.mock('in-stores/navigation/matrix', () => ({
  setOrDeleteMatrixKey: jest.fn(),
  buildJsonSerializer: jest.fn(() => jest.fn(JSON.stringify))
}));

jest.mock('in-stores/navigation/hooks/useNavigation', () => ({
  useNavigation: jest.fn(() => ({
    location: { pathname: '/logs' },
    createHref: jest.fn(location => location.pathname + '?query')
  }))
}));

jest.mock('in-stores/time/config', () => ({
  setTimeConfig: jest.fn()
}));

describe('Navigation Paths and Functions', () => {
  it('should correctly define navigation paths', () => {
    expect(loggingDashboardPath).toBe('/logging');
    expect(dashboardSmartAlertsPath).toBe('/logging/alerts');
    expect(dashboardDeletePath).toBe('/logging/delete');
    expect(dashboardManagementPath).toBe('/logging/manage');
  });

  describe('useGenerateLinkToLogs', () => {
    it('should generate a link to /logs with correct parameters', () => {
      const { location } = useNavigation();
      const generateLink = useGenerateLinkToLogs();
      const validTimeConfig: TimeConfig = {
        windowSize: 1000,
        autoRefresh: true
      };
      const result = generateLink({ tagFilterExpression: [], timeConfig: validTimeConfig });

      expect(setOrDeleteMatrixKey).toHaveBeenCalledWith(location, '/logs', 'dataSource', 'logs');
      expect(setOrDeleteMatrixKey).toHaveBeenCalledWith(location, '/logs', 'tagFilterExpression', '[]');
      expect(setTimeConfig).toHaveBeenCalledWith(location, validTimeConfig);
      expect(result).toBe('/logs?query');
    });
  });

  describe('useLinkToLogs', () => {
    it('should generate a link to /logs when called directly', () => {
      const { location } = useNavigation();
      const validTimeConfig: TimeConfig = {
        windowSize: 1000,
        autoRefresh: true
      };
      const result = useLinkToLogs({ tagFilterExpression: [], timeConfig: validTimeConfig });

      expect(setOrDeleteMatrixKey).toHaveBeenCalledWith(location, '/logs', 'tagFilterExpression', '[]');
      expect(setTimeConfig).toHaveBeenCalledWith(location, validTimeConfig);
      expect(result).toBe('/logs?query');
    });
  });

  describe('useGenerateLinkToLogs', () => {
    it('should wrap tagFilterExpression in an array if not already an array', () => {
      const { location } = useNavigation();
      const generateLink = useGenerateLinkToLogs();
      const tagFilterExpression = {
        type: 'EXPRESSION',
        logicalOperator: 'OR',
        elements: []
      } as TagFilterExpression;

      const validTimeConfig: TimeConfig = {
        windowSize: 1000,
        autoRefresh: true
      };

      const result = generateLink({ tagFilterExpression, timeConfig: validTimeConfig });

      expect(setOrDeleteMatrixKey).toHaveBeenCalledWith(
        location,
        '/logs',
        'tagFilterExpression',
        JSON.stringify([tagFilterExpression])
      );
      expect(setTimeConfig).toHaveBeenCalledWith(location, validTimeConfig);
      expect(result).toBe('/logs?query');
    });
  });
});

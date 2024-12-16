/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';

import {
  LOG_CUSTOM_KEY_APPLICATION_ID,
  LOG_CUSTOM,
  LOG_CUSTOM_KEY_SERVICE_ID,
  LOG_CUSTOM_KEY_ENDPOINT_NAME,
  LOG_TRACE_ID,
  ID_PROCESS,
  ID_HOST,
  LOG_FILE_PATH,
  LOG_CUSTOM_KEY_ENDPOINT_ID
} from 'in-logging/queryBuilder';
import {
  useLinkToApplicationDashboard,
  useLinkToServiceDashboard,
  useLinkToEndpointDashboard
} from 'in-applications/navigation/paths';
// eslint-disable-next-line no-restricted-imports
import useResolvedLink, { getServiceId } from '../useResolvedLink';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { useLinkToTraceDetail } from 'in-analyze/navigation/paths';
import { LogItem, LogTag } from 'in-types';

jest.mock('in-applications/navigation/paths', () => ({
  useLinkToApplicationDashboard: jest.fn(),
  useLinkToServiceDashboard: jest.fn(),
  useLinkToEndpointDashboard: jest.fn()
}));
jest.mock('in-analyze/navigation/paths', () => ({
  useLinkToTraceDetail: jest.fn()
}));

jest.mock('in-stores/navigation/paths/dashboardPaths', () => ({
  useGetDashboardLink: jest.fn()
}));

jest.mock('in-logging/analyze/AnalyzeView/components/hooks/getKubernetesLink', () => ({
  useGetKubernetesLink: jest.fn()
}));

describe('getServiceId', () => {
  it('should return the service ID when it is present', () => {
    const tags = [
      { name: LOG_CUSTOM, key: LOG_CUSTOM_KEY_SERVICE_ID, stringValue: 'service-123' },
      { name: 'OTHER_TAG', key: 'OTHER_KEY', stringValue: 'value' }
    ];
    const result = getServiceId(tags);
    expect(result).toBe('service-123');
  });

  it('should return null when service ID is not present', () => {
    const tags = [{ name: 'OTHER_TAG', key: 'OTHER_KEY', stringValue: 'value' }];
    const result = getServiceId(tags);
    expect(result).toBeNull();
  });

  it('should return null when service ID has a different name or key', () => {
    const tags = [
      { name: 'OTHER_TAG', key: LOG_CUSTOM_KEY_SERVICE_ID, stringValue: 'service-123' },
      { name: LOG_CUSTOM, key: 'OTHER_KEY', stringValue: 'value' }
    ];
    const result = getServiceId(tags);
    expect(result).toBeNull();
  });
});

describe('useResolvedLink', () => {
  const mockLogItem: LogItem = {
    tags: [
      { name: LOG_CUSTOM, key: LOG_CUSTOM_KEY_SERVICE_ID, stringValue: 'service-123' },
      { name: LOG_CUSTOM, key: LOG_CUSTOM_KEY_ENDPOINT_NAME, stringValue: 'endpoint-456' },
      { name: LOG_CUSTOM, key: LOG_CUSTOM_KEY_ENDPOINT_ID, stringValue: 'endpoint-456' },
      { name: LOG_TRACE_ID, stringValue: 'trace-789' }
    ]
  } as LogItem;

  it('should return application dashboard link for LOG_CUSTOM_KEY_APPLICATION_ID', () => {
    const mockTag: LogTag = { name: LOG_CUSTOM_KEY_APPLICATION_ID, stringValue: 'app-123' };

    const mockAppDashboardLink = jest.fn().mockReturnValue('http://app-dashboard');
    (useLinkToApplicationDashboard as jest.Mock).mockReturnValue(mockAppDashboardLink);

    const { result } = renderHook(() => useResolvedLink(LOG_CUSTOM_KEY_APPLICATION_ID, mockTag, mockLogItem));

    expect(result.current).toBe('http://app-dashboard');

    expect(mockAppDashboardLink).toHaveBeenCalledWith({ applicationId: 'app-123' });
  });

  it('should return service dashboard link for LOG_CUSTOM_KEY_SERVICE_ID', () => {
    const mockTag: LogTag = { name: `${LOG_CUSTOM}-${LOG_CUSTOM_KEY_SERVICE_ID}`, stringValue: 'service-123' };

    const mockServiceDashboardLink = jest.fn().mockReturnValue('http://service-dashboard');
    (useLinkToServiceDashboard as jest.Mock).mockReturnValue(mockServiceDashboardLink);

    const { result } = renderHook(() =>
      useResolvedLink(`${LOG_CUSTOM}-${LOG_CUSTOM_KEY_SERVICE_ID}`, mockTag, mockLogItem)
    );

    expect(result.current).toBe('http://service-dashboard');

    expect(mockServiceDashboardLink).toHaveBeenCalledWith({ serviceId: 'service-123' });
  });

  it('should return endpoint dashboard link for LOG_CUSTOM_KEY_ENDPOINT_NAME', () => {
    const mockTag: LogTag = { name: `${LOG_CUSTOM}-${LOG_CUSTOM_KEY_ENDPOINT_NAME}`, stringValue: 'endpoint-456' };

    const mockEndpointDashboardLink = jest.fn().mockReturnValue('http://endpoint-dashboard');
    (useLinkToEndpointDashboard as jest.Mock).mockReturnValue(mockEndpointDashboardLink);

    const { result } = renderHook(() =>
      useResolvedLink(`${LOG_CUSTOM}-${LOG_CUSTOM_KEY_ENDPOINT_NAME}`, mockTag, mockLogItem)
    );

    expect(result.current).toBe('http://endpoint-dashboard');

    expect(mockEndpointDashboardLink).toHaveBeenCalledWith({ endpointId: 'endpoint-456' });
  });

  it('should return trace detail link for LOG_TRACE_ID', () => {
    const mockTraceDetailLink = jest.fn().mockReturnValue('http://trace-detail/trace-789');
    (useLinkToTraceDetail as jest.Mock).mockReturnValue(mockTraceDetailLink);

    const mockTag: LogTag = { name: LOG_TRACE_ID, stringValue: 'trace-789' };

    const { result } = renderHook(() => useResolvedLink(LOG_TRACE_ID, mockTag, mockLogItem));

    expect(result.current).toBe('http://trace-detail/trace-789');

    expect(mockTraceDetailLink).toHaveBeenCalledWith('trace-789');
  });

  it('should return null for unknown tag', () => {
    const mockTag: LogTag = { name: 'UNKNOWN_TAG', stringValue: 'unknown' };

    const { result } = renderHook(() => useResolvedLink('UNKNOWN_TAG', mockTag, mockLogItem));

    expect(result.current).toBeNull();
  });

  it('should return dashboard link for ID_PROCESS', () => {
    const mockTag: LogTag = { name: ID_PROCESS, stringValue: 'process-123' };

    const mockGetDashboardLink = jest.fn().mockReturnValue('http://dashboard');
    (useGetDashboardLink as jest.Mock).mockReturnValue(mockGetDashboardLink);

    const { result } = renderHook(() => useResolvedLink(ID_PROCESS, mockTag, mockLogItem));

    expect(result.current).toBe('http://dashboard');
    expect(mockGetDashboardLink).toHaveBeenCalledWith('process-123', { pathname: '/physical/dashboard' });
  });

  it('should return dashboard link for ID_HOST', () => {
    const mockTag: LogTag = { name: ID_HOST, stringValue: 'host-123' };

    const mockGetDashboardLink = jest.fn().mockReturnValue('http://dashboard');
    (useGetDashboardLink as jest.Mock).mockReturnValue(mockGetDashboardLink);

    const { result } = renderHook(() => useResolvedLink(ID_HOST, mockTag, mockLogItem));

    expect(result.current).toBe('http://dashboard');
    expect(mockGetDashboardLink).toHaveBeenCalledWith('host-123', { pathname: '/physical/dashboard' });
  });

  it('should return dashboard link for LOG_FILE_PATH', () => {
    const mockTag: LogTag = { name: LOG_FILE_PATH, stringValue: '/path/to/file' };

    const mockGetDashboardLink = jest.fn().mockReturnValue('http://dashboard');
    (useGetDashboardLink as jest.Mock).mockReturnValue(mockGetDashboardLink);

    const { result } = renderHook(() => useResolvedLink(LOG_FILE_PATH, mockTag, mockLogItem));

    expect(result.current).toBe('http://dashboard');
    expect(mockGetDashboardLink).toHaveBeenCalledWith('/path/to/file', { pathname: '/physical/dashboard' });
  });
});

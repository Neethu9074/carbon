/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';

import { useGetKubernetesLink } from 'in-logging/analyze/AnalyzeView/components/hooks/getKubernetesLink';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { capitalize } from 'in-services/formatters/string';
import { LogItem, LogTag } from 'in-types';

jest.mock('in-stores/navigation/hooks/useNavigation');
jest.mock('in-services/formatters/string', () => ({
  capitalize: jest.fn()
}));

describe('useGetKubernetesLink', () => {
  let mockCreateHref: jest.Mock;
  let mockLocation;

  beforeEach(() => {
    mockCreateHref = jest.fn(loc => {
      const params = Object.entries(loc.matrix || {})
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join(';');
      return `${loc.pathname};${params}`;
    });

    mockLocation = {
      pathname: '/current/path',
      search: '',
      hash: '',
      matrix: {}
    };

    (useNavigation as jest.Mock).mockReturnValue({
      createHref: mockCreateHref,
      location: mockLocation
    });
  });

  it('should return a correct Kubernetes link', () => {
    const entityIdValue = 'example-pod-id';

    // Mocking capitalize function
    (capitalize as jest.Mock).mockImplementation(str => str.charAt(0).toUpperCase() + str.slice(1));

    const tag: LogTag = { name: 'kubernetes.pod', stringValue: entityIdValue };
    const log: LogItem = {
      tags: [{ name: `id.kubernetesPod`, stringValue: entityIdValue }],
      itemId: '',
      message: '',
      timestamp: 0
    };

    const { result } = renderHook(() => useGetKubernetesLink());

    const href = result.current(tag, log);

    expect(href).not.toBeNull();
    expect(capitalize).toHaveBeenCalledWith('pod');
    expect(mockCreateHref).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: `/kubernetes/pod;podId=${entityIdValue}/summary`
      })
    );
  });

  it('should return null if entity is not present in tag', () => {
    const tag: LogTag = { name: 'kubernetes.', stringValue: '' };
    const log: LogItem = {
      tags: [],
      itemId: '',
      message: '',
      timestamp: 0
    };

    const { result } = renderHook(() => useGetKubernetesLink());

    const href = result.current(tag, log);

    expect(href).toBeNull();
  });

  it('should return null if entityId is not found in log tags', () => {
    (capitalize as jest.Mock).mockImplementation(str => str.charAt(0).toUpperCase() + str.slice(1));

    const tag: LogTag = { name: 'kubernetes.pod', stringValue: '' };
    const log: LogItem = {
      tags: [],
      itemId: '',
      message: '',
      timestamp: 0
    };

    const { result } = renderHook(() => useGetKubernetesLink());

    const href = result.current(tag, log);

    expect(href).toBeNull();
  });
});

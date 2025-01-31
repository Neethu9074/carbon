/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { renderHook } from '@testing-library/react-hooks';

import { useObservable } from '@instana/hooks';

// eslint-disable-next-line no-restricted-imports
import useTagCatalog from '../useTagCatalog';
import { getTagCatalog } from 'in-logging/api/catalog';
import useTimeConfig from 'in-hooks/useTimeConfig';

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

jest.mock('in-logging/api/catalog', () => ({
  getTagCatalog: jest.fn()
}));

jest.mock('in-hooks/useTimeConfig', () => jest.fn());

describe('useTagCatalog', () => {
  let mockUseObservable: jest.Mock;
  let mockUseTimeConfig: jest.Mock;

  beforeEach(() => {
    mockUseObservable = useObservable as jest.Mock;
    mockUseTimeConfig = useTimeConfig as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls getTagCatalog with the correct parameters', async () => {
    const mockTimeConfig = { to: Date.now(), windowSize: 60000, autoRefresh: false };
    mockUseTimeConfig.mockReturnValue(mockTimeConfig);

    mockUseObservable.mockImplementationOnce(fn => {
      fn();
      return { data: { tags: ['tag1', 'tag2'] } };
    });

    const useCase = 'FILTERING';

    renderHook(() => useTagCatalog(useCase));

    expect(getTagCatalog).toHaveBeenCalledWith({ useCase, timeConfig: mockTimeConfig });
  });

  it('returns data from useObservable', () => {
    const mockTimeConfig = { to: Date.now(), windowSize: 60000, autoRefresh: false };
    mockUseTimeConfig.mockReturnValue(mockTimeConfig);
    mockUseObservable.mockReturnValue({ data: { tags: ['tag1', 'tag2'] } });

    const { result } = renderHook(() => useTagCatalog('FILTERING'));

    expect(result.current).toEqual({ tags: ['tag1', 'tag2'] });
  });

  it('returns undefined when useObservable returns undefined', () => {
    const mockTimeConfig = { to: Date.now(), windowSize: 60000, autoRefresh: false };
    mockUseTimeConfig.mockReturnValue(mockTimeConfig);
    mockUseObservable.mockReturnValue(undefined);

    const { result } = renderHook(() => useTagCatalog('FILTERING'));

    expect(result.current).toBeUndefined();
  });
});

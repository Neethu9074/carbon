/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { act, renderHook } from '@testing-library/react-hooks';

import {
  emptySloData,
  mockPaginatedSloList,
  mockPaginatedTwoSloList,
  mockSloList,
  mockWebsitePaginatedSloList,
  mockWebsiteSloList,
  mockedDebouncedValue,
  pageOneResult,
  pageTwoResult,
  selectedSLO,
  selectedSloData,
  sloData
} from 'in-alerting/smart-alerts/slo/components/SloListSelection/mockData';
import {
  UseBufferedSloDataResult,
  usePaginatedSloList
} from 'in-alerting/smart-alerts/slo/components/SloListSelection/hooks/usePaginatedSloList';
import { SloData, useSloList } from 'in-alerting/smart-alerts/slo/components/SloListSelection/SloListSelection';
import { useSelectedIds } from 'in-alerting/smart-alerts/slo/components/SloListSelection/hooks/useSelectedIds';
import useDebouncedValue from 'in-hooks/useDebouncedValue';

jest.mock('in-hooks/useDebouncedValue');
jest.mock('in-alerting/smart-alerts/slo/components/SloListSelection/hooks/useSelectedIds');
jest.mock('in-alerting/smart-alerts/slo/components/SloListSelection/hooks/usePaginatedSloList');

const mockUseDebouncedValue = useDebouncedValue as jest.MockedFunction<typeof useDebouncedValue>;
const mockUsePaginatedSloList = usePaginatedSloList as jest.MockedFunction<typeof usePaginatedSloList>;
const mockUseSelectedIds = useSelectedIds as jest.MockedFunction<typeof useSelectedIds>;

describe('in-alerting/smart-alerts/slo/components/SloListSelection', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should keep the selected sloId while creating new Smart Alert from a particular SLO', () => {
    // Given
    mockUseDebouncedValue.mockReturnValue(mockedDebouncedValue);

    mockUsePaginatedSloList.mockReturnValue(mockPaginatedSloList as UseBufferedSloDataResult);

    mockUseSelectedIds.mockReturnValue(sloData);

    // When
    const { result } = renderHook(() => useSloList(['SLO-selected'], 'application'));

    // Then
    expect(result.current.page).toBe(1);
    expect(result.current.selected).toHaveLength(1);
    expect(result.current.selected[0].id).toBe('SLO-selected');
  });

  it('Should keep the multiple selected sloId while creating new Smart Alert from a particular SLO', () => {
    // Given
    mockUseDebouncedValue.mockReturnValue(mockedDebouncedValue);

    mockUsePaginatedSloList.mockReturnValue(mockPaginatedSloList as UseBufferedSloDataResult);

    mockUseSelectedIds.mockReturnValue(selectedSloData);

    // When
    const { result } = renderHook(() => useSloList(['SLO-1', 'SLO-2', 'SLO-3'], 'application'));

    // Then
    expect(result.current.page).toBe(1);
    expect(result.current.selected).toHaveLength(3);
  });

  it('When toggled the entityType there must be no selected SLO in the list', () => {
    // Given
    mockUseDebouncedValue.mockReturnValue(mockedDebouncedValue);

    mockUseSelectedIds.mockReturnValueOnce(sloData).mockReturnValueOnce(emptySloData);

    mockUsePaginatedSloList
      .mockReturnValueOnce(mockPaginatedSloList as UseBufferedSloDataResult)
      .mockReturnValueOnce(mockWebsitePaginatedSloList as UseBufferedSloDataResult);

    // When
    const { result, rerender } = renderHook(() => useSloList(['SLO-selected'], 'application'));

    expect(result.current.selected).toStrictEqual([selectedSLO]);
    expect(result.current.sloList).toStrictEqual(mockSloList);

    rerender({ selectedIds: [], entityType: 'website' });

    // Then
    expect(result.current.page).toBe(1);
    expect(result.current.selected).toStrictEqual([]);
    expect(result.current.sloList).toStrictEqual(mockWebsiteSloList);
  });

  it('Should keep the existing data in the list when loadMore has been called', () => {
    //  Given
    mockUseDebouncedValue.mockReturnValue(mockedDebouncedValue);

    mockUsePaginatedSloList
      .mockReturnValueOnce({
        sloList: pageOneResult as SloData[],
        clear: jest.fn(),
        page: 1,
        progress: { loading: false },
        pageSize: 6,
        totalHits: 73
      })
      .mockReturnValueOnce({
        sloList: [...pageOneResult, ...pageTwoResult] as SloData[],
        clear: jest.fn(),
        page: 2,
        progress: { loading: false },
        pageSize: 6,
        totalHits: 73
      });

    mockUseSelectedIds.mockReturnValue(sloData);

    // When
    const { result } = renderHook(() => useSloList(['SLO-selected'], 'application'));

    expect(result.current.page).toBe(1);
    expect(result.current.selected).toEqual([selectedSLO]);
    expect(result.current.sloList).toHaveLength(6);

    act(() => {
      result.current.loadMore();
    });

    // Then
    expect(result.current.page).toBe(2);
    expect(result.current.selected).toEqual([selectedSLO]);
    expect(result.current.sloList).toHaveLength(12);
  });

  it('Should reset the page when entityType is changed', () => {
    // Given
    mockUseDebouncedValue.mockReturnValue(mockedDebouncedValue);
    mockUsePaginatedSloList
      .mockReturnValueOnce(mockPaginatedTwoSloList as UseBufferedSloDataResult)
      .mockReturnValueOnce(mockWebsitePaginatedSloList as UseBufferedSloDataResult);
    mockUseSelectedIds.mockReturnValue(selectedSloData);

    // When
    const { result, rerender } = renderHook(() => useSloList(['SLO-selected'], 'application'));

    expect(result.current.page).toBe(2);

    rerender({ selectedIds: [], entityType: 'website' });
    // Then
    expect(result.current.page).toBe(1);
  });
});

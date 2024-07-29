/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { act, renderHook } from '@testing-library/react-hooks';

import {
  emptySloData,
  mockPaginatedSloList,
  mockPaginatedSloListWithEvent,
  mockSloList,
  mockSloListEvent,
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
    expect(result.current.selected).toEqual([selectedSLO]);
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
        sloList: pageTwoResult as SloData[],
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

  it('Should return an empty SloList and the selected SLO when there is no matching search input', () => {
    // Given
    mockUseDebouncedValue.mockReturnValue({
      value: 'NOTFOUND',
      debouncedValue: 'NOTFOUND',
      onChange: jest.fn()
    });

    mockUsePaginatedSloList.mockReturnValue({
      sloList: [],
      clear: jest.fn(),
      page: 1,
      progress: { loading: false },
      pageSize: 6,
      totalHits: 0
    });

    mockUseSelectedIds.mockReturnValue(sloData);

    // When
    const { result } = renderHook(() => useSloList(['SLO-selected'], 'application'));

    // Then
    expect(result.current.sloList).toStrictEqual([]);
    expect(result.current.selected).toEqual([selectedSLO]);
  });

  it('Should return the selected SLO and the searched query SLO in the list when search query matches', () => {
    // Given
    mockUseDebouncedValue.mockReturnValue({
      value: 'AndreiK',
      debouncedValue: 'AndreiK',
      onChange: jest.fn()
    });

    mockUsePaginatedSloList.mockReturnValue({
      sloList: [
        {
          id: 'SLO-1',
          label: 'AndreiK Test Edited',
          entityName: '',
          entityType: 'application'
        }
      ],
      clear: jest.fn(),
      page: 1,
      progress: { loading: false },
      pageSize: 1,
      totalHits: 73
    });

    mockUseSelectedIds.mockReturnValue(selectedSloData);

    // When
    const { result } = renderHook(() => useSloList(['SLO-1', 'SLO-2', 'SLO-3'], 'application'));

    // Then
    expect(result.current.sloList).toStrictEqual([
      {
        id: 'SLO-1',
        label: 'AndreiK Test Edited',
        entityName: '',
        entityType: 'application'
      }
    ]);
    expect(result.current.selected).toEqual(mockSloList);
  });

  it('Should return empty SLO list when there is no matching SLO query and no selected SLO ', () => {
    // Given
    mockUseDebouncedValue.mockReturnValue({
      value: 'NOTFOUND',
      debouncedValue: 'NOTFOUND',
      onChange: jest.fn()
    });

    mockUsePaginatedSloList.mockReturnValue({
      sloList: [],
      page: 1,
      pageSize: 6,
      totalHits: 0,
      clear: jest.fn(),
      progress: {
        loading: false
      }
    });

    mockUseSelectedIds.mockReturnValue(emptySloData);

    // When
    const { result } = renderHook(() => useSloList([], 'application'));

    // Then
    expect(result.current.sloList).toEqual([]);
    expect(result.current.selected).toEqual([]);
  });

  it('Should show the selected SLO and all matching query SLOs in a case-insensitive manner', () => {
    // Given
    mockUseDebouncedValue.mockReturnValue({
      value: 'test',
      debouncedValue: 'test',
      onChange: jest.fn()
    });

    mockUsePaginatedSloList.mockReturnValue(mockPaginatedSloListWithEvent as UseBufferedSloDataResult);

    mockUseSelectedIds.mockReturnValue(sloData);

    // When
    const { result } = renderHook(() => useSloList(['SLO-selected'], 'application'));

    // Then
    expect(result.current.selected).toStrictEqual([selectedSLO]);
    expect(result.current.sloList).toStrictEqual(mockSloListEvent);
  });
});

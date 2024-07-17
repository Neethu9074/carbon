/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';

import { SloData, useSloList } from 'in-alerting/smart-alerts/slo/components/SloListSelection';
import { usePaginatedSloList } from 'in-alerting/smart-alerts/slo/hooks/usePaginatedSloList';
import { useSelectedIds } from 'in-alerting/smart-alerts/slo/hooks/useSelectedIds';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { FetchedState } from 'in-hooks/utils/types';

jest.mock('in-hooks/useDebouncedValue');
jest.mock('in-alerting/smart-alerts/slo/hooks/useSelectedIds');
jest.mock('in-alerting/smart-alerts/slo/hooks/usePaginatedSloList');

const mockUseDebouncedValue = useDebouncedValue as jest.MockedFunction<typeof useDebouncedValue>;
const mockUsePaginatedSloList = usePaginatedSloList as jest.MockedFunction<typeof usePaginatedSloList>;
const mockUseSelectedIds = useSelectedIds as jest.MockedFunction<typeof useSelectedIds>;

const sloData = [
  [
    {
      id: 'SLO-selected',
      label: 'Blessy-event',
      entityName: '',
      entityType: 'application'
    }
  ],
  'resolved',
  [],
  {
    loading: false
  }
] as FetchedState<SloData[]>;

const emptySloData = [
  [],
  'resolved',
  [],
  {
    loading: false
  }
] as FetchedState<SloData[]>;

const selectedSLO = [
  {
    id: 'SLO-selected',
    label: 'Blessy-event',
    entityName: '',
    entityType: 'application'
  }
];

describe('in-alerting/smart-alerts/slo/components/SloListSelection', () => {
  it('Should keep the sloId while creating new Smart Alert', () => {
    // Given
    mockUseDebouncedValue.mockReturnValue({
      value: '',
      debouncedValue: '',
      onChange: jest.fn()
    });

    mockUsePaginatedSloList.mockReturnValue({
      sloList: [
        {
          id: 'SLO-1',
          label: 'Andre Test',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-2',
          label: 'Andrei Test',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-3',
          label: 'AndreiK Test Edited',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-4',
          label: 'Application Availability Time Based 80%',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-5',
          label: 'avail-mean-test',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-6',
          label: 'Blessy-event',
          entityName: '',
          entityType: 'application'
        }
      ],
      clear: jest.fn(),
      page: 1,
      progress: { loading: false },
      pageSize: 6,
      totalHits: 73
    });

    mockUseSelectedIds.mockReturnValue(sloData);

    // When
    const { result } = renderHook(() => useSloList(['SLO-selected'], 'application'));

    // Then
    expect(result.current.page).toBe(1);
    expect(result.current.selected).toEqual(selectedSLO);
  });

  it('When toggled the entityType there must be no selected SLO in the list', () => {
    // Given
    const resetSloData = [
      [],
      'resolved',
      [],
      {
        loading: false
      }
    ] as FetchedState<SloData[]>;

    mockUseDebouncedValue.mockReturnValue({
      value: '',
      debouncedValue: '',
      onChange: jest.fn()
    });

    mockUseSelectedIds.mockReturnValue(resetSloData);

    mockUsePaginatedSloList.mockReturnValue({
      sloList: [
        {
          id: 'SLO-1',
          label: 'demo4slo-web-timebased-latency',
          entityName: '',
          entityType: 'website'
        },
        {
          id: 'SLO-2',
          label: 'hughesj-slo-robot-shop',
          entityName: '',
          entityType: 'website'
        },
        {
          id: 'SLO-3',
          label: 'robotshop-test latency',
          entityName: '',
          entityType: 'website'
        },
        {
          id: 'SLO-4',
          label: 'SLO-TBD-web',
          entityName: '',
          entityType: 'website'
        },
        {
          id: 'SLO-5',
          label: 'Soft Drink Shop reliability by event count',
          entityName: '',
          entityType: 'website'
        },
        {
          id: 'SLO-6',
          label: 'Stans shop availability event SLO',
          entityName: '',
          entityType: 'website'
        }
      ],
      clear: jest.fn(),
      page: 1,
      progress: { loading: false },
      pageSize: 6,
      totalHits: 73
    });

    // When
    const { result } = renderHook(() => useSloList([], 'website'));

    // Then
    expect(result.current.page).toBe(1);
    expect(result.current.selected).toStrictEqual([]);
  });

  it(' Should keep the existing data in the list when loadMore has been called', () => {
    //  Given
    mockUseDebouncedValue.mockReturnValue({
      value: '',
      debouncedValue: '',
      onChange: jest.fn()
    });

    mockUsePaginatedSloList.mockReturnValue({
      sloList: [
        {
          id: 'SLO-1',
          label: 'Andre Test',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-2',
          label: 'Andrei Test',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-3',
          label: 'AndreiK Test Edited',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-4',
          label: 'Application Availability Time Based 80%',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-5',
          label: 'avail-mean-test',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-6',
          label: 'Blessy-event',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-7',
          label: 'Andre Test',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-8',
          label: 'Andrei Test',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-9',
          label: 'AndreiK Test Edited',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-10',
          label: 'Application Availability Time Based 80%',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-11',
          label: 'avail-mean-test',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-12',
          label: 'Blessy-event',
          entityName: '',
          entityType: 'application'
        }
      ],
      clear: jest.fn(),
      page: 2,
      progress: { loading: false },
      pageSize: 6,
      totalHits: 73
    });

    mockUseSelectedIds.mockReturnValue(sloData);

    // When
    const { result } = renderHook(() => useSloList(['SLO-selected'], 'application'));

    // Then
    expect(result.current.page).toBe(2);
    expect(result.current.selected).toEqual(selectedSLO);
    expect(result.current.sloList).toHaveLength(12);
  });

  it('Should return an empty SloList when no matching search input and the selected SLO must be listed out', () => {
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
    expect(result.current.selected).toEqual(selectedSLO);
  });

  it('Should return the selected SLO and the searched query SLO in the list', () => {
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
      pageSize: 6,
      totalHits: 73
    });

    mockUseSelectedIds.mockReturnValue(sloData);

    // When
    const { result } = renderHook(() => useSloList(['SLO-selected'], 'application'));

    // Then
    expect(result.current.sloList).toStrictEqual([
      {
        id: 'SLO-1',
        label: 'AndreiK Test Edited',
        entityName: '',
        entityType: 'application'
      }
    ]);
    expect(result.current.selected).toEqual(selectedSLO);
  });

  it('Should return empty SLO list when there is no matching search input and no selected SLO', () => {
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

  it('Should show all SLOs with the matching query in a case-insensitive manner,when there is no selected SLO', () => {
    // Given
    mockUseDebouncedValue.mockReturnValue({
      value: 'event',
      debouncedValue: 'event',
      onChange: jest.fn()
    });

    mockUsePaginatedSloList.mockReturnValue({
      sloList: [
        {
          id: 'SLO-1',
          label: 'Blessy-event',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-2',
          label: 'Event Based Application SLO',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-3',
          label: 'Stans first availability event-based SLO',
          entityName: '',
          entityType: 'application'
        }
      ],
      clear: jest.fn(),
      page: 1,
      progress: { loading: false },
      pageSize: 6,
      totalHits: 73
    });

    mockUseSelectedIds.mockReturnValue(emptySloData);

    // When
    const { result } = renderHook(() => useSloList([], 'application'));

    // Then
    expect(result.current.selected).toStrictEqual([]);
    expect(result.current.sloList).toStrictEqual([
      {
        id: 'SLO-1',
        label: 'Blessy-event',
        entityName: '',
        entityType: 'application'
      },
      {
        id: 'SLO-2',
        label: 'Event Based Application SLO',
        entityName: '',
        entityType: 'application'
      },
      {
        id: 'SLO-3',
        label: 'Stans first availability event-based SLO',
        entityName: '',
        entityType: 'application'
      }
    ]);
  });

  it('Should show all SLOs that are matching search query  and the selected SLO in a case-insensitive manner', () => {
    // Given

    mockUseDebouncedValue.mockReturnValue({
      value: 'test',
      debouncedValue: 'test',
      onChange: jest.fn()
    });

    mockUsePaginatedSloList.mockReturnValue({
      sloList: [
        {
          id: 'SLO-1',
          label: 'Test-event',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-2',
          label: 'Event Based Application SLO test',
          entityName: '',
          entityType: 'application'
        },
        {
          id: 'SLO-3',
          label: 'Test availability event-based SLO',
          entityName: '',
          entityType: 'application'
        }
      ],
      clear: jest.fn(),
      page: 1,
      progress: { loading: false },
      pageSize: 6,
      totalHits: 73
    });

    mockUseSelectedIds.mockReturnValue(sloData);

    // When
    const { result } = renderHook(() => useSloList([], 'application'));

    // Then
    expect(result.current.selected).toStrictEqual(selectedSLO);
    expect(result.current.sloList).toStrictEqual([
      {
        id: 'SLO-1',
        label: 'Test-event',
        entityName: '',
        entityType: 'application'
      },
      {
        id: 'SLO-2',
        label: 'Event Based Application SLO test',
        entityName: '',
        entityType: 'application'
      },
      {
        id: 'SLO-3',
        label: 'Test availability event-based SLO',
        entityName: '',
        entityType: 'application'
      }
    ]);
  });
});

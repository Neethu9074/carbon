/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { SloData, UseBufferedSloDataResult } from 'in-service-levels/hooks/usePaginatedSloList';
import { FetchedState } from 'in-hooks/utils/types';

export const selectedSLO = {
  id: 'SLO-selected',
  label: 'Blessy-event',
  entityName: '',
  entityType: 'application'
};

export const sloData = [
  [selectedSLO],
  'resolved',
  [],
  {
    loading: false
  }
] as FetchedState<SloData[]>;

export const mockSloList: SloData[] = [
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
  }
];

export const selectedSloData = [
  mockSloList,
  'resolved',
  [],
  {
    loading: false
  }
] as FetchedState<SloData[]>;

export const emptySloData = [
  [],
  'resolved',
  [],
  {
    loading: false
  }
] as FetchedState<SloData[]>;

export const mockedDebouncedValue = {
  value: '',
  debouncedValue: '',
  onChange: jest.fn()
};

export const mockPaginatedSloList: UseBufferedSloDataResult = {
  sloList: mockSloList,
  clear: jest.fn(),
  page: 1,
  progress: { loading: false },
  pageSize: 3,
  totalHits: 73
};

export const mockPaginatedTwoSloList = {
  sloList: mockSloList,
  clear: jest.fn(),
  page: 2,
  progress: { loading: false },
  pageSize: 3,
  totalHits: 73
};
export const mockWebsiteSloList: SloData[] = [
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
  }
];

export const mockWebsitePaginatedSloList: UseBufferedSloDataResult = {
  sloList: mockWebsiteSloList,
  clear: jest.fn(),
  page: 1,
  progress: { loading: false },
  pageSize: 3,
  totalHits: 73
};

export const pageOneResult: SloData[] = [
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
];

export const pageTwoResult: SloData[] = [
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
];

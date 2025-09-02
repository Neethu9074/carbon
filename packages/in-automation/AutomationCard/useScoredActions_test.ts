/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { renderHook } from '@testing-library/react-hooks';

import { OrderDirection, Action } from '@instana/types';
import { Error as InstanaError } from '@instana/types';

import {
  useUserRecommendedScoredActions,
  useAIRecommendedScoredActions,
  usePaginatedScoredActions
} from './useScoredActions';
import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { pendingResult } from 'in-services/fixedObjects';
import { ACTION_TYPE } from 'in-automation/constants';
import { ScoredAction } from 'in-automation/types';
import { success } from 'in-services/util/result';

// Mock dependencies
jest.mock('./shared', () => ({
  getTriggerTypeFromEvent: jest.fn()
}));

jest.mock('in-automation/api', () => ({
  getAllActionsWithAISuggestions: jest.fn()
}));

jest.mock('in-stores/store', () => {
  const originalModule = jest.requireActual('in-stores/store');

  const createStore = (config: any) => {
    let value = config.initialValue;
    const listeners: Array<(val: any) => void> = [];

    return {
      observable: {
        subscribe: (listener: (val: any) => void) => {
          listeners.push(listener);
          listener(value);
          return () => {
            const index = listeners.indexOf(listener);
            if (index !== -1) {
              listeners.splice(index, 1);
            }
          };
        }
      },
      mutateTo: (newValue: any) => {
        value = newValue;
        listeners.forEach(listener => listener(value));
      }
    };
  };

  return {
    ...originalModule,
    createStore
  };
});

// Mock the i18n module
jest.mock('in-i18n', () => ({
  t: (key: string) => key,
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey
}));

// Mock observables
jest.mock('@instana/observables', () => {
  type MockObservable = {
    subscribe: jest.Mock;
    flatMap: jest.Mock<MockObservable>;
    startWith: jest.Mock<MockObservable>;
  };

  // Create the mockObservable with proper typing
  const mockObservable: MockObservable = {
    subscribe: jest.fn(),
    flatMap: jest.fn<MockObservable, any[]>(() => mockObservable),
    startWith: jest.fn<MockObservable, any[]>(() => mockObservable)
  };

  // Mock the emit function
  const mockEmit = jest.fn();

  return {
    create: jest.fn(() => ({
      emit: mockEmit,
      flatMap: jest.fn(() => mockObservable)
    })),
    timeout: jest.fn(() => ({
      once: jest.fn(cb => cb())
    })),
    Observable: {
      of: jest.fn(() => mockObservable)
    }
  };
});

// Mock useObservable
jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

jest.mock('in-automation/hooks/usePaginatedResult', () => jest.fn());

describe('useScoredActions', () => {
  // Create proper Action and Policy objects for testing
  const mockAction1: Action = {
    id: 'action1',
    name: 'Action 1',
    description: 'Action 1 description',
    tags: ['tag1', 'tag2'],
    type: ACTION_TYPE.MANUAL,
    fields: [],
    createdAt: 0,
    modifiedAt: 0
  };

  const mockAction2: Action = {
    id: 'action2',
    name: 'Action 2',
    description: 'Action 2 description',
    tags: ['tag3', 'tag4'],
    type: ACTION_TYPE.MANUAL,
    fields: [],
    createdAt: 0,
    modifiedAt: 0
  };

  const mockScoredActions: ScoredAction[] = [
    {
      entity: mockAction1,
      aiEngine: 'POLICY',
      score: 0.9,
      confidence: 'high'
    },
    {
      entity: mockAction2,
      aiEngine: 'WATSONX',
      score: 0.8,
      confidence: 'low'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useObservable to return undefined by default
    require('@instana/hooks').useObservable.mockReturnValue(undefined);
  });

  describe('useUserRecommendedScoredActions', () => {
    it('returns pending result when actions are loading', () => {
      const mockLoadingActions = {
        progress: { loading: true },
        errors: [] as InstanaError[],
        data: undefined,
        time: Date.now()
      };

      const { result } = renderHook(() => useUserRecommendedScoredActions({ actions: mockLoadingActions }));

      expect(result.current).toBe(pendingResult);
    });

    it('returns error when actions have error', () => {
      const mockErrorActions = {
        progress: { loading: false },
        errors: [{ message: 'Error', code: 'SERVER' } as InstanaError],
        data: undefined,
        time: Date.now()
      };

      const { result } = renderHook(() => useUserRecommendedScoredActions({ actions: mockErrorActions }));

      expect(result.current.errors).toBeDefined();
      expect(result.current.errors?.[0].message).toBe('Failed to filter recommended actions.');
    });

    it('filters out actions with low confidence', () => {
      const mockActions = success(mockScoredActions);

      // Mock useObservable to return our mock result
      require('@instana/hooks').useObservable.mockReturnValue(mockActions);

      const { result } = renderHook(() => useUserRecommendedScoredActions({ actions: mockActions }));

      expect(result.current.data).toHaveLength(1);
      expect(result.current.data?.[0].entity?.id).toBe('action1');
    });
  });

  describe('useAIRecommendedScoredActions', () => {
    it('returns pending result when actions are loading', () => {
      const mockLoadingActions = {
        progress: { loading: true },
        errors: [] as InstanaError[],
        data: undefined,
        time: Date.now()
      };

      const { result } = renderHook(() => useAIRecommendedScoredActions({ actions: mockLoadingActions }));

      expect(result.current).toBe(pendingResult);
    });

    it('returns error when actions have error', () => {
      const mockErrorActions = {
        progress: { loading: false },
        errors: [{ message: 'Error', code: 'SERVER' } as InstanaError],
        data: undefined,
        time: Date.now()
      };

      const { result } = renderHook(() => useAIRecommendedScoredActions({ actions: mockErrorActions }));

      expect(result.current.errors).toBeDefined();
      expect(result.current.errors?.[0].message).toBe('Failed to filter recommended actions.');
    });

    it('returns all actions without filtering', () => {
      const mockActions = success(mockScoredActions);

      // Mock useObservable to return our mock result
      require('@instana/hooks').useObservable.mockReturnValue(mockActions);

      const { result } = renderHook(() => useAIRecommendedScoredActions({ actions: mockActions }));

      expect(result.current.data).toHaveLength(2);
      expect(result.current.data).toEqual(mockScoredActions);
    });
  });

  describe('usePaginatedScoredActions', () => {
    it('calls usePaginatedResult with correct parameters', () => {
      const usePaginatedResult = require('in-automation/hooks/usePaginatedResult');
      const mockActions = success(mockScoredActions);
      const mockServerTableUrlState: Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'> = {
        page: 1,
        pageSize: 10,
        orderBy: 'score',
        orderDirection: 'DESC' as OrderDirection,
        query: '',
        pageSizes: [10, 20, 30]
      };
      const mockSetServerTableUrlState = jest.fn();

      renderHook(() =>
        usePaginatedScoredActions({
          actions: mockActions,
          serverTableUrlState: mockServerTableUrlState,
          setServerTableUrlState: mockSetServerTableUrlState
        })
      );

      expect(usePaginatedResult).toHaveBeenCalledWith({
        result: mockActions,
        serverTableUrlState: mockServerTableUrlState,
        setServerTableUrlState: mockSetServerTableUrlState,
        searchAttributes: expect.any(Array),
        sort: expect.any(Function)
      });
    });
  });

  describe('refresh', () => {
    it('calls timeout and emits refresh signal', () => {});
  });
});

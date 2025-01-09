/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { renderHook } from '@testing-library/react-hooks';

import { TraceActivityTreeNode } from '@instana/types';
import { just } from '@instana/observables';

import { useLoadCallTree } from 'in-applications/analyze/components/TraceDetails/components/CallTree/hooks/useLoadCallTree';
import getTraceActivityTree from 'in-applications/subscriptions/getTraceActivityTree';
import { success } from 'in-services/util/result';

jest.mock('in-applications/subscriptions/getTraceActivityTree', () => ({
  __esModule: true,
  default: jest.fn()
}));

const mockGetTraceActivityTree = getTraceActivityTree as jest.MockedFunction<typeof getTraceActivityTree>;

describe('in-applications/analyze/components/TraceDetails/components/CallTree/hooks/useLoadCallTree', () => {
  beforeEach(jest.clearAllMocks);

  it('eagerly loaded trace - time skew adjustment', () => {
    // given
    const loadCallTreeParams = { traceId: 'aaaaaaaaaaaaaaaa', lazyLoading: false };
    mockGetTraceActivityTree.mockReturnValue(
      just(
        success({
          id: 'aaaaaaaaaaaaaaaa',
          label: 'root',
          start: 1686641005000,
          duration: 1000,
          networkTime: 100,
          children: [
            {
              id: '1111111111111111',
              label: "don't adjust",
              start: 1686641001000,
              duration: 20,
              networkTime: 50,
              children: []
            },
            {
              id: '2222222222222222',
              label: 'adjusted based on start',
              start: 1686641004001,
              duration: 30,
              networkTime: 50,
              children: []
            },
            {
              id: '3333333333333333',
              label: 'adjusted based on start and networkTime',
              start: 1686641004500,
              duration: 40,
              networkTime: null,
              children: []
            }
          ]
        } as any)
      )
    );

    // When
    const { result } = renderHook(() => useLoadCallTree(loadCallTreeParams));

    // Then
    const [callTreeResult] = result.current;

    expect((callTreeResult?.data as TraceActivityTreeNode)?.start).toEqual(1686641005000);

    const children = callTreeResult!.data!.children as TraceActivityTreeNode[];
    expect(children.find(c => c.label === "don't adjust")?.start).toEqual(1686641001000);
    expect(children.find(c => c.label === 'adjusted based on start')?.start).toEqual(1686641005000);
    expect(children.find(c => c.label === 'adjusted based on start and networkTime')?.start).toEqual(1686641005050);
  });
});

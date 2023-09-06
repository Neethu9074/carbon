/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { cloneDeep } from 'lodash';
import { expect } from 'chai';

import {
  initLazyCallTree,
  FAKE_PARENT_CALL_FOREIGN,
  FAKE_PARENT_CALL_NOT_YET_ARRIVED,
  updateLazyCallTreeWithParentAndSiblingCalls,
  Relations,
  LazyNodeType,
  updateLazyCallTreeWithRelatedCalls,
  refreshAllParentNodesToForcePropsChange,
  CallNode
} from 'in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree';
import { SearchIndex } from 'in-applications/analyze/components/TraceDetails/components/CallTree/callTrees';
import { GetRelatedCallsDetailsResult } from 'in-applications/subscriptions/getRelatedCallsDetails';
import { GetCallDetailsResult } from 'in-applications/subscriptions/getCallDetails';
import { finishedProgress, pendingResult } from 'in-services/fixedObjects';
import { CallDetails, CallDetailsItem, ErrorCode } from 'in-types';

const TEST_TRACE_ID = '176e3934e0d92d74';

const FOREIGN_PARENT_ID = 'aaaaaaaaaaaaaaaaa';

const emptyRelatedCallsResult = {
  progress: finishedProgress,
  errors: [],
  data: {
    items: [],
    canLoadMore: false,
    totalHits: 0,
    totalRepresentedItemCount: 0,
    totalRetainedItemCount: 0
  }
};

function createSuccessfulResult(callDetails: CallDetails[], totalHits: number): GetRelatedCallsDetailsResult {
  const items: CallDetailsItem[] = callDetails.map(
    (cd, i) =>
      ({
        ...cd,
        cursor: {
          ingestionTime: 1678116808000,
          offset: ++i
        }
      } as CallDetailsItem)
  );

  return {
    progress: finishedProgress,
    errors: [],
    data: {
      items,
      canLoadMore: totalHits > callDetails.length,
      totalHits,
      totalRepresentedItemCount: totalHits,
      totalRetainedItemCount: totalHits
    }
  };
}

const erroneousResult = {
  progress: finishedProgress,
  errors: [{ code: 'TOO_MANY_REQUESTS' as ErrorCode, message: 'boom' }]
};

const PARENT_CALL: CallDetails = {
  batchCount: 1,
  duration: 30,
  endpoint: {
    id: 'post_foo_id',
    serviceId: 'foo_service_id',
    label: 'POST /foo',
    technologies: [],
    type: 'HTTP'
  },
  errorCount: 0,
  hasChildren: true,
  isOrphan: false,
  id: '1111111111111111',
  label: 'POST /foo',
  networkTime: 7,
  selfTime: 1,
  service: {
    id: 'foo_service_id',
    label: 'foo service',
    snapshotIds: [],
    technologies: [],
    types: ['HTTP']
  },
  start: 1677835549000,
  type: 'HTTP',
  waitingTime: 1
};

const CHILD_CALL: CallDetails = {
  batchCount: 1,
  duration: 20,
  endpoint: {
    id: 'post_bar_id',
    serviceId: 'bar_service_id',
    label: 'POST /bar',
    technologies: [],
    type: 'HTTP'
  },
  errorCount: 0,
  hasChildren: true,
  isOrphan: false,
  id: '2222222222222222',
  label: 'POST /bar',
  networkTime: 5,
  selfTime: 2,
  service: {
    id: 'bar_service_id',
    label: 'bar',
    snapshotIds: [],
    technologies: [],
    types: ['HTTP']
  },
  start: 1677835549100,
  type: 'HTTP',
  waitingTime: 1
};

const CHILD_CALL_BEFORE: CallDetails = {
  ...CHILD_CALL,
  id: '3333333333333333',
  start: CHILD_CALL.start - 10,
  parentId: PARENT_CALL.id,
  hasChildren: false
};

const CHILD_CALL_AFTER: CallDetails = {
  ...CHILD_CALL,
  id: '4444444444444444',
  start: CHILD_CALL.start + 10,
  parentId: PARENT_CALL.id,
  hasChildren: false
};

describe('in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree/initLazyCallTree', () => {
  it('call has a parent', () => {
    const lazyCallTree = initLazyCallTree({ callDetails: cloneDeep(CHILD_CALL), traceId: TEST_TRACE_ID });
    expect(lazyCallTree.root).to.deep.equal({
      ...CHILD_CALL,
      children: []
    });
    expect(lazyCallTree.traceId).to.equal(TEST_TRACE_ID);
    expect(Array.from(lazyCallTree.searchIndex.keys())).to.have.members([CHILD_CALL.id]);
  });
});

describe('in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree/updateLazyCallTreeWithParentAndSiblingCalls', () => {
  it('parent not monitored by instana', () => {
    const callWithForeignParent = {
      ...CHILD_CALL,
      foreignParentId: FOREIGN_PARENT_ID
    };
    const initialLazyCallTree = initLazyCallTree({
      callDetails: cloneDeep(callWithForeignParent),
      traceId: TEST_TRACE_ID
    });

    const updatedLazyCallTree = updateLazyCallTreeWithParentAndSiblingCalls(
      initialLazyCallTree,
      CHILD_CALL.id,
      // if not monitored by Instana, we won't even try to fetch the parent, i.e., the parent call details result will be always 'pendingResult'
      pendingResult,
      emptyRelatedCallsResult,
      emptyRelatedCallsResult
    );

    expect(updatedLazyCallTree.root).to.deep.equal({
      ...FAKE_PARENT_CALL_FOREIGN,
      start: callWithForeignParent.start,
      duration: callWithForeignParent.duration,
      children: [
        {
          ...callWithForeignParent,
          parentId: FAKE_PARENT_CALL_FOREIGN.id,
          children: []
        }
      ]
    });

    expect(updatedLazyCallTree.traceId).to.equal(TEST_TRACE_ID);
    expect(Array.from(updatedLazyCallTree.searchIndex.keys())).to.have.members([
      callWithForeignParent.id,
      FAKE_PARENT_CALL_FOREIGN.id
    ]);
  });

  it('parent not yet received', () => {
    const callWithNotYetReceivedParent = {
      ...CHILD_CALL,
      parentId: PARENT_CALL.id
    };

    const initialLazyCallTree = initLazyCallTree({
      callDetails: cloneDeep(callWithNotYetReceivedParent),
      traceId: TEST_TRACE_ID
    });

    const updatedLazyCallTree = updateLazyCallTreeWithParentAndSiblingCalls(
      initialLazyCallTree,
      CHILD_CALL.id,
      {
        progress: finishedProgress,
        errors: [
          {
            message: `Call with callId: ${callWithNotYetReceivedParent.parentId} and traceId: ${TEST_TRACE_ID} not found.`,
            code: 'NOT_FOUND'
          }
        ]
      },
      emptyRelatedCallsResult,
      emptyRelatedCallsResult
    );

    expect(updatedLazyCallTree.root).to.deep.equal({
      ...FAKE_PARENT_CALL_NOT_YET_ARRIVED,
      start: CHILD_CALL.start,
      duration: CHILD_CALL.duration,
      children: [
        {
          ...CHILD_CALL,
          parentId: FAKE_PARENT_CALL_NOT_YET_ARRIVED.id,
          children: []
        }
      ]
    });
    expect(updatedLazyCallTree.traceId).to.equal(TEST_TRACE_ID);
    expect(Array.from(updatedLazyCallTree.searchIndex.keys())).to.have.members([
      CHILD_CALL.id,
      FAKE_PARENT_CALL_NOT_YET_ARRIVED.id
    ]);
  });

  it('grand parent not monitored by instana', () => {
    const callWithParent = {
      ...CHILD_CALL,
      parentId: PARENT_CALL.id
    };
    const initialLazyCallTree = initLazyCallTree({ callDetails: cloneDeep(callWithParent), traceId: TEST_TRACE_ID });

    const parentCall = {
      ...cloneDeep(PARENT_CALL),
      foreignParentId: FOREIGN_PARENT_ID
    };

    const updatedLazyCallTree = updateLazyCallTreeWithParentAndSiblingCalls(
      initialLazyCallTree,
      CHILD_CALL.id,
      {
        progress: finishedProgress,
        data: parentCall
      } as GetCallDetailsResult,
      emptyRelatedCallsResult,
      emptyRelatedCallsResult
    );

    expect(updatedLazyCallTree.root).to.deep.equal({
      ...FAKE_PARENT_CALL_FOREIGN,
      start: PARENT_CALL.start,
      duration: PARENT_CALL.duration,
      children: [
        {
          ...parentCall,
          parentId: FAKE_PARENT_CALL_FOREIGN.id,
          children: [
            {
              ...CHILD_CALL,
              parentId: PARENT_CALL.id,
              children: []
            }
          ]
        }
      ]
    });

    expect(updatedLazyCallTree.traceId).to.equal(TEST_TRACE_ID);
    expect(Array.from(updatedLazyCallTree.searchIndex.keys())).to.have.members([
      PARENT_CALL.id,
      CHILD_CALL.id,
      FAKE_PARENT_CALL_FOREIGN.id
    ]);
  });

  it('create lazy siblings if initial loading of sibling calls (before and after) fails', () => {
    const callWithParent = {
      ...CHILD_CALL,
      parentId: PARENT_CALL.id
    };
    const initialLazyCallTree = initLazyCallTree({ callDetails: cloneDeep(callWithParent), traceId: TEST_TRACE_ID });

    const updatedLazyCallTree = updateLazyCallTreeWithParentAndSiblingCalls(
      initialLazyCallTree,
      CHILD_CALL.id,
      {
        progress: finishedProgress,
        data: cloneDeep(PARENT_CALL),
        errors: []
      },
      erroneousResult,
      erroneousResult
    );

    expect(updatedLazyCallTree.root).to.deep.equal({
      ...PARENT_CALL,
      children: [
        {
          callId: CHILD_CALL.id,
          children: [],
          id: 'SIBLINGS_BEFORE:' + CHILD_CALL.id,
          lazyNodeType: LazyNodeType.SIBLINGS_BEFORE,
          relation: Relations.SIBLINGS_BEFORE,
          traceId: TEST_TRACE_ID,
          parentId: PARENT_CALL.id,
          errors: [{ code: 'TOO_MANY_REQUESTS', message: 'boom' }]
        },
        {
          ...callWithParent,
          children: []
        },
        {
          callId: CHILD_CALL.id,
          children: [],
          id: 'SIBLINGS_AFTER:' + CHILD_CALL.id,
          lazyNodeType: LazyNodeType.SIBLINGS_AFTER,
          relation: Relations.SIBLINGS_AFTER,
          traceId: TEST_TRACE_ID,
          parentId: PARENT_CALL.id,
          errors: [{ code: 'TOO_MANY_REQUESTS', message: 'boom' }]
        }
      ]
    });

    expect(updatedLazyCallTree.traceId).to.equal(TEST_TRACE_ID);
    expect(Array.from(updatedLazyCallTree.searchIndex.keys())).to.have.members([
      PARENT_CALL.id,
      CHILD_CALL.id,
      'SIBLINGS_BEFORE:' + CHILD_CALL.id,
      'SIBLINGS_AFTER:' + CHILD_CALL.id
    ]);
  });

  it('discard successful related calls results if loading of parent fails', () => {
    const callWithParent = {
      ...CHILD_CALL,
      parentId: PARENT_CALL.id,
      children: []
    };
    const initialLazyCallTree = initLazyCallTree({ callDetails: cloneDeep(callWithParent), traceId: TEST_TRACE_ID });

    const updatedLazyCallTree = updateLazyCallTreeWithParentAndSiblingCalls(
      initialLazyCallTree,
      CHILD_CALL.id,
      erroneousResult,
      createSuccessfulResult([CHILD_CALL_BEFORE], 2),
      createSuccessfulResult([CHILD_CALL_AFTER], 2)
    );

    expect(updatedLazyCallTree.root).to.deep.equal({
      callId: callWithParent.id,
      id: 'PARENT:' + callWithParent.id,
      lazyNodeType: LazyNodeType.PARENT,
      traceId: TEST_TRACE_ID,
      parentId: callWithParent.parentId,
      errors: [{ code: 'TOO_MANY_REQUESTS', message: 'boom' }],
      children: [callWithParent]
    });

    expect(updatedLazyCallTree.traceId).to.equal(TEST_TRACE_ID);
    expect(Array.from(updatedLazyCallTree.searchIndex.keys())).to.have.members([
      'PARENT:' + callWithParent.id,
      callWithParent.id
    ]);
  });

  it('create lazy nodes for siblings before and after', () => {
    const callWithParent = {
      ...CHILD_CALL,
      parentId: PARENT_CALL.id,
      children: []
    };
    const initialLazyCallTree = initLazyCallTree({ callDetails: cloneDeep(callWithParent), traceId: TEST_TRACE_ID });

    const updatedLazyCallTree = updateLazyCallTreeWithParentAndSiblingCalls(
      initialLazyCallTree,
      CHILD_CALL.id,
      {
        progress: finishedProgress,
        data: cloneDeep(PARENT_CALL),
        errors: []
      },
      createSuccessfulResult([CHILD_CALL_BEFORE, CHILD_CALL_BEFORE], 3),
      createSuccessfulResult([CHILD_CALL_AFTER, CHILD_CALL_AFTER], 3)
    );

    expect(updatedLazyCallTree.root).to.deep.equal({
      ...PARENT_CALL,
      children: [
        {
          callId: CHILD_CALL.id,
          children: [],
          id: 'SIBLINGS_BEFORE:' + CHILD_CALL.id,
          lazyNodeType: LazyNodeType.SIBLINGS_BEFORE,
          relation: Relations.SIBLINGS_BEFORE,
          traceId: TEST_TRACE_ID,
          parentId: PARENT_CALL.id,
          cursor: {
            ingestionTime: 1678116808000,
            offset: 2
          }
        },
        {
          ...CHILD_CALL_BEFORE,
          parentId: PARENT_CALL.id,
          children: []
        },
        {
          ...CHILD_CALL_BEFORE,
          parentId: PARENT_CALL.id,
          children: []
        },
        {
          ...callWithParent,
          children: []
        },
        {
          ...CHILD_CALL_AFTER,
          parentId: PARENT_CALL.id,
          children: []
        },
        {
          ...CHILD_CALL_AFTER,
          parentId: PARENT_CALL.id,
          children: []
        },
        {
          callId: CHILD_CALL.id,
          children: [],
          id: 'SIBLINGS_AFTER:' + CHILD_CALL.id,
          lazyNodeType: LazyNodeType.SIBLINGS_AFTER,
          relation: Relations.SIBLINGS_AFTER,
          traceId: TEST_TRACE_ID,
          parentId: PARENT_CALL.id,
          cursor: {
            ingestionTime: 1678116808000,
            offset: 2
          }
        }
      ]
    });

    expect(updatedLazyCallTree.traceId).to.equal(TEST_TRACE_ID);
    expect(Array.from(updatedLazyCallTree.searchIndex.keys())).to.have.members([
      PARENT_CALL.id,
      'SIBLINGS_BEFORE:' + CHILD_CALL.id,
      CHILD_CALL_BEFORE.id,
      callWithParent.id,
      CHILD_CALL_AFTER.id,
      'SIBLINGS_AFTER:' + CHILD_CALL.id
    ]);
  });
});

describe('in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree/updateLazyCallTreeWithRelatedCalls', () => {
  it('update fake root call start and duration, when new child calls are fetched', () => {
    const callWithParent = {
      ...CHILD_CALL,
      parentId: PARENT_CALL.id
    };
    const initialLazyCallTree = initLazyCallTree({ callDetails: cloneDeep(callWithParent), traceId: TEST_TRACE_ID });

    const childBefore1 = { ...CHILD_CALL_BEFORE, start: CHILD_CALL.start - 1000 };
    const childBefore2 = { ...CHILD_CALL_BEFORE, start: CHILD_CALL.start - 2000 };
    const childAfter1 = { ...CHILD_CALL_AFTER, start: CHILD_CALL.start + 1000, duration: CHILD_CALL.duration + 500 };
    const childAfter2 = { ...CHILD_CALL_AFTER, start: CHILD_CALL.start + 2000, duration: CHILD_CALL.duration + 500 };

    let updatedLazyCallTree = updateLazyCallTreeWithParentAndSiblingCalls(
      initialLazyCallTree,
      CHILD_CALL.id,
      // if not monitored by Instana, we won't even try to fetch the parent, i.e., the parent call details result will be always 'pendingResult'
      pendingResult,
      createSuccessfulResult([childBefore1], 2),
      createSuccessfulResult([childAfter1], 2)
    );

    let fakeRootCall = updatedLazyCallTree.root as CallDetails;
    expect(fakeRootCall.label).to.equal('Not monitored by Instana');

    expect(fakeRootCall.start).to.equal(childBefore1.start);
    expect(fakeRootCall.duration).to.equal(childAfter1.start - childBefore1.start + childAfter1.duration);

    // fetching one more sibling before
    updatedLazyCallTree = updateLazyCallTreeWithRelatedCalls(
      initialLazyCallTree,
      CHILD_CALL.id,
      Relations.SIBLINGS_BEFORE,
      createSuccessfulResult([childBefore2], 2)
    );

    fakeRootCall = updatedLazyCallTree.root as CallDetails;
    expect(fakeRootCall.start).to.equal(childBefore2.start);
    expect(fakeRootCall.duration).to.equal(childAfter1.start - childBefore2.start + childAfter1.duration);

    // fetching one more sibling after
    updatedLazyCallTree = updateLazyCallTreeWithRelatedCalls(
      initialLazyCallTree,
      CHILD_CALL.id,
      Relations.SIBLINGS_AFTER,
      createSuccessfulResult([childAfter2], 2)
    );

    fakeRootCall = updatedLazyCallTree.root as CallDetails;
    expect(fakeRootCall.start).to.equal(childBefore2.start);
    expect(fakeRootCall.duration).to.equal(childAfter2.start - childBefore2.start + childAfter2.duration);
  });
});

describe('in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree/refreshAllParentNodesToForcePropsChange', () => {
  it.each([
    {
      name: 'lazy parent call',
      parentNode: {
        id: 'PARENT:' + CHILD_CALL.id,
        lazyNodeType: LazyNodeType.PARENT,
        parentId: PARENT_CALL.id,
        callId: CHILD_CALL.id,
        traceId: TEST_TRACE_ID
      }
    },
    { name: 'loaded root node', parentNode: PARENT_CALL },
    { name: 'missing not yet arrived root call', parentNode: FAKE_PARENT_CALL_NOT_YET_ARRIVED },
    { name: 'fake foreign parent root call', parentNode: FAKE_PARENT_CALL_FOREIGN }
  ])('refresh all nodes with $name', ({ parentNode }) => {
    const root = {
      ...parentNode,
      children: [
        {
          ...CHILD_CALL_BEFORE,
          parentId: parentNode.id,
          foreignParentId: FOREIGN_PARENT_ID,
          children: []
        },
        {
          ...CHILD_CALL,
          parentId: parentNode.id,
          foreignParentId: FOREIGN_PARENT_ID,
          children: []
        },
        {
          ...CHILD_CALL_AFTER,
          parentId: parentNode.id,
          foreignParentId: FOREIGN_PARENT_ID,
          children: []
        }
      ]
    };

    const lazyCallTree = {
      root: root,
      searchIndex: new Map() as SearchIndex<CallNode>,
      traceId: TEST_TRACE_ID
    };
    populateSearchIndex(lazyCallTree.searchIndex, lazyCallTree.root);

    const newLazyCallTree = {
      root: cloneDeep(lazyCallTree.root),
      searchIndex: new Map() as SearchIndex<CallNode>,
      traceId: lazyCallTree.traceId
    };
    populateSearchIndex(newLazyCallTree.searchIndex, newLazyCallTree.root);

    const rootNodeRef = newLazyCallTree.root;
    const childBeforeNodeRef = newLazyCallTree.root.children[0];
    const childNodeRef = newLazyCallTree.root.children[1];
    const childAfterNodeRef = newLazyCallTree.root.children[2];

    const refreshedChildNode = refreshAllParentNodesToForcePropsChange(newLazyCallTree, CHILD_CALL.id);

    expect(refreshedChildNode).not.be.equal(childNodeRef);
    expect(newLazyCallTree.root).not.be.equal(rootNodeRef);
    expect(newLazyCallTree.root.children[1]).not.be.equal(childNodeRef);
    // children before and after should remain unchanged
    expect(newLazyCallTree.root.children[0]).be.equal(childBeforeNodeRef);
    expect(newLazyCallTree.root.children[2]).be.equal(childAfterNodeRef);

    expect(Array.from(newLazyCallTree.searchIndex.keys())).to.deep.equal(Array.from(lazyCallTree.searchIndex.keys()));
    expect(newLazyCallTree.root).to.deep.equal(lazyCallTree.root);
  });
});

function populateSearchIndex(searchIndex: SearchIndex<CallNode>, node: CallNode) {
  if (node) {
    searchIndex.set(node.id, node);
  }
  node.children.forEach(child => populateSearchIndex(searchIndex, child));
}

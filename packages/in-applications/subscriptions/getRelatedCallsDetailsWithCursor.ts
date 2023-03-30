/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import getRelatedCallsDetails from 'in-applications/subscriptions/getRelatedCallsDetails';
import { IngestionOffsetCursor, Relation } from 'in-types';

/**
 * Number of children or siblings to fetch in a single batch.
 */
const RETRIEVAL_SIZE = 5;

export default function getRelatedCallsDetailsWithCursor({
  traceId,
  callId,
  relation,
  cursor
}: {
  traceId: string;
  callId: string;
  relation: Relation;
  cursor?: IngestionOffsetCursor;
}) {
  return getRelatedCallsDetails({
    traceId,
    callId,
    relation,
    pagination: {
      cursor,
      // Work-around for a backend issue, where the "canLoadMore" field is sometimes not properly set.
      // We will try to retrieve one extra item, which we will then discard, but if the extra item
      // will be returned, we will know that more items can be loaded.
      // https://instana.kanbanize.com/ctrl_board/66/cards/122152/details/
      retrievalSize: RETRIEVAL_SIZE + 1
    }
  }).map(result => {
    if (result.data && result.data.items.length > RETRIEVAL_SIZE) {
      return {
        ...result,
        data: {
          ...result.data,
          items: result.data.items.slice(0, RETRIEVAL_SIZE),
          canLoadMore: true
        }
      };
    }
    return result;
  });
}

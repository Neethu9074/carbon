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
      retrievalSize: RETRIEVAL_SIZE
    }
  });
}

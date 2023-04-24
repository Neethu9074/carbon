/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { getRawPayload } from 'in-stores/snapshot';

export default function getAnnotations(snapshotId) {
  return getRawPayload(snapshotId, 'annotations').map(annotations => {
    return annotations
      .entrySeq()
      .toJS()
      .map(([key, value]) => ({ key, value }));
  });
}

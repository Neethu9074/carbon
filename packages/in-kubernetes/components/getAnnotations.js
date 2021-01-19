/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
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

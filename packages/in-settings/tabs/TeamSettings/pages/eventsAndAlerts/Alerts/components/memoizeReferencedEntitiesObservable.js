/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import memoize from 'in-services/util/memoizingObservableGenerator';

export default function createMemoizedObservableForReferencedEntities(createObservable, tti = 60000) {
  return memoize(
    createObservable,
    // generate cache ID by concatenating all referenced IDs
    arrayOfIds => (arrayOfIds == null ? 'null' : arrayOfIds.join(':')),
    tti
  );
}

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import memoize, { ObservableCreator, TtiGenerator } from 'in-services/util/memoizingObservableGenerator';

export default function createMemoizedObservableForReferencedEntities<RESULT>(
  createObservable: ObservableCreator<string[], RESULT>,
  tti: number | TtiGenerator<string[], RESULT> = 60000
) {
  return memoize(
    createObservable,
    // generate cache ID by concatenating all referenced IDs
    arrayOfIds => (arrayOfIds == null ? 'null' : arrayOfIds.join(':')),
    tti
  );
}

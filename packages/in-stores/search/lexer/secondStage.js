/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isTerm, isFieldSeparator } from 'in-stores/search/lexer';

export default function lexSecondStage(firstStageLexResult) {
  // skip first element, beacuse we are searching for an ':' with a prev element === term
  for (let i = 1, length = firstStageLexResult.length; i < length; i++) {
    const queryPart = firstStageLexResult[i];

    if (isFieldSeparator(queryPart)) {
      const prevToken = firstStageLexResult[i - 1];
      if (isTerm(prevToken)) {
        prevToken.token = 'field';
      }
    }
  }

  return firstStageLexResult;
}

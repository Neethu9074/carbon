/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { GREATER_OR_EQUAL_THAN, LESS_OR_EQUAL_THAN } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { or } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';

export const TAG_CALL_HTTP_STATUS = 'call.http.status';

// includedRanges - array of single digit numbers representing the whole range which starts with that digit,
// e.g. [2] includes all 2xx HTTP status codes
export default function formModelFromHttpStatusRange(includedRanges) {
  let rangesExpression = [];
  while (includedRanges.length > 0 && includedRanges.length < 5) {
    const start = includedRanges.shift();
    let end = start + 1;
    // iterate to the end of the continuous range
    while (includedRanges.length > 0 && includedRanges[0] === end) {
      end = includedRanges.shift() + 1;
    }

    if (end === 6) {
      // no range end needed
      rangesExpression = joinExpressions({
        logicalOperator: or,
        expressions: [rangesExpression, tagFilter(TAG_CALL_HTTP_STATUS, GREATER_OR_EQUAL_THAN, start * 100)]
      });
    } else if (start == 1) {
      // no range start needed
      rangesExpression = joinExpressions({
        logicalOperator: or,
        expressions: [rangesExpression, tagFilter(TAG_CALL_HTTP_STATUS, LESS_OR_EQUAL_THAN, end * 100 - 1)]
      });
    } else {
      rangesExpression = joinExpressions({
        logicalOperator: or,
        expressions: [
          rangesExpression,
          joinExpressions({
            expressions: [
              tagFilter(TAG_CALL_HTTP_STATUS, GREATER_OR_EQUAL_THAN, start * 100),
              tagFilter(TAG_CALL_HTTP_STATUS, LESS_OR_EQUAL_THAN, end * 100 - 1)
            ]
          })
        ]
      });
    }
  }
  return rangesExpression;
}

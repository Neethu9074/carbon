import {isTerm, isFieldSeparator} from 'in-stores/search/lexer';


export default function lexSecondStage(firstStageLexResult) {
  // skip first element, beacuse we are searching for an ':' with a prev element === term
  for (let i = 1, length = firstStageLexResult.length; i < length; i++) {
    if (isFieldSeparator(firstStageLexResult[i])) {
      const prevToken = firstStageLexResult[i - 1];
      if (isTerm(prevToken)) {
        prevToken.token = 'field';
      }
    }
  }

  return firstStageLexResult;
}

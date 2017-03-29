export default function lexSecondStage(firstStageLexResult) {
  // skip first element, beacuse we are searching for an ':' with a prev element === term
  for (let i = 1, length = firstStageLexResult.length; i < length; i++) {
    if (firstStageLexResult[i].token === 'fieldSeparator') {
      const prevToken = firstStageLexResult[i - 1];
      if (prevToken.token === 'term') {
        prevToken.token = 'field';
      }
    }
  }

  return firstStageLexResult;
}

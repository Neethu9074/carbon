/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { resetMetricsAndOrderOnTypeChange, typeMatrixParameter } from 'in-infrastructure/navigation/paths';
import getUnifiedTagValueSuggestions from 'in-infrastructure/subscriptions/getUnifiedTagValueSuggestions';
import { mapData } from 'in-services/util/result';
import useUrlState from 'in-hooks/useUrlState';

export default ({ name, key, timeConfig, value, propose, tagFilterExpression, availability }) => {
  const fetchKeySuggestions = propose === 'KEYS';

  const urlStateDefinition = {
    bind: [typeMatrixParameter],
    resets: [resetMetricsAndOrderOnTypeChange],
    replaceHistory: false
  };

  const [{ type: urlType }] = useUrlState(urlStateDefinition);
  const type = urlType === 'all' ? null : urlType;

  return getUnifiedTagValueSuggestions({
    tagName: name,
    filter: { tagFilterExpression, timeConfig },
    partialTagValue: value,
    secondLevelKeyTagName: key,
    valueCount: fetchKeySuggestions ? 1000 : 10,
    fetchKeySuggestions,
    type,
    availability
  }).map(dropTagPrefixIfNecessary(fetchKeySuggestions, name));
};

function dropTagPrefixIfNecessary(fetchKeySuggestions, tagName) {
  if (fetchKeySuggestions) {
    return result =>
      mapData(result, ({ suggestions, totalHits }) => ({
        suggestions: suggestions.map(suggestion => suggestion.replace(tagName + '.', '')).filter(s => s.length > 0),
        totalHits: totalHits - 1
      }));
  } else {
    return result => result;
  }
}

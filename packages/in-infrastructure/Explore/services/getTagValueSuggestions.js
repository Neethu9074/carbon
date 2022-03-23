/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import getTagValueSearchSuggestions from 'in-infrastructure/subscriptions/getTagValueSuggestions';
import { mapData } from 'in-services/util/result';

export default ({ name, key, timeConfig, value, propose }) => {
  const fetchKeySuggestions = propose === 'KEYS';
  return getTagValueSearchSuggestions({
    tagName: key !== undefined ? name + '.' + key : name,
    timeConfig: timeConfig,
    partialTagValue: value,
    valueCount: fetchKeySuggestions ? 1000 : 10,
    fetchKeySuggestions
  }).map(dropTagPrefixIfNecessary(fetchKeySuggestions, name));
};

function dropTagPrefixIfNecessary(fetchKeySuggestions, tagName) {
  if (fetchKeySuggestions) {
    return result =>
      mapData(result, ({ suggestions, totalHits }) => ({
        suggestions: suggestions
          .map(suggestion => {
            const idx = suggestion.indexOf(tagName);
            if (idx >= 0) {
              return suggestion.substring(idx + tagName.length + 1);
            } else {
              return '';
            }
          })
          .filter(s => s.length > 0),
        totalHits: totalHits - 1
      }));
  } else {
    return result => result;
  }
}

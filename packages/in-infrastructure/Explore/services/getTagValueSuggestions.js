/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import getTagValueSearchSuggestions from 'in-infrastructure/subscriptions/getTagValueSuggestions';
import { tagCatalogSmallQueryWindowEnabled } from 'in-services/featureFlags';
import { mapData } from 'in-services/util/result';

export default ({ name, key, timeConfig, value, propose }) => {
  const fetchKeySuggestions = propose === 'KEYS';

  // Creating a copy of TimeConfig and setting the window size to 1 minute.
  const modifiedTimeConfig = {
    ...timeConfig,
    windowSize: 60000
  };
  const config = tagCatalogSmallQueryWindowEnabled ? modifiedTimeConfig : timeConfig;

  return getTagValueSearchSuggestions({
    tagName: key !== undefined ? name + '.' + key : name,
    timeConfig: config,
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

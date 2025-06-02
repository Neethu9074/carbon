/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { resetMetricsAndOrderOnTypeChange, typeMatrixParameter } from 'in-infrastructure/navigation/paths';
import { and, useFilterContext } from 'in-custom-dashboards/CustomDashboard/FilterContext/FilterContext';
import getTagValueSearchSuggestions from 'in-infrastructure/subscriptions/getTagValueSuggestions';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { mapData } from 'in-services/util/result';
import useUrlState from 'in-hooks/useUrlState';

export default ({ name, key, timeConfig, value, propose, tagFilterExpression }) => {
  const fetchKeySuggestions = propose === 'KEYS';

  // Creating a copy of TimeConfig and setting the window size to 1 minute.
  const modifiedTimeConfig = {
    ...timeConfig,
    windowSize: 60000
  };

  const urlStateDefinition = {
    bind: [typeMatrixParameter],
    resets: [resetMetricsAndOrderOnTypeChange],
    replaceHistory: false
  };

  const [{ type: urlType }] = useUrlState(urlStateDefinition);
  const type = urlType === 'all' ? null : urlType;

  const filterContext = useFilterContext();
  const contextTagFilterExpression = toBackendQueryModel(filterContext);

  return getTagValueSearchSuggestions({
    tagName: key !== undefined ? name + '.' + key : name,
    filter: {
      tagFilterExpression: and(contextTagFilterExpression, tagFilterExpression),
      timeConfig: modifiedTimeConfig
    },
    partialTagValue: value,
    valueCount: fetchKeySuggestions ? 1000 : 10,
    fetchKeySuggestions,
    type
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

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import MultiSelectBarItem from 'in-analyze/components/filterBar/MultiSelectBarItem';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import { isBlank } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip';

export default function AnalyzeMultiSelectBarItem(props) {
  const { precondition, pluralLabel, preconditionFailedTooltip = 'Not available' } = props;
  if (precondition && !precondition()) {
    return (
      <Tooltip themeStyle="light" content={preconditionFailedTooltip} align="bottomMiddle">
        <BarItem showArrow notAvailable isOpen={false} active={false} onClick={() => {}}>
          {pluralLabel}
        </BarItem>
      </Tooltip>
    );
  }

  return <MultiSelectBarItem {...props} filterSuggestionsClientSide getSuggestions={getSuggestions} />;
}

function getSuggestions({ timeConfig, tagFilters, tag }) {
  return getTagSuggestions({
    filter: {
      timeConfig
    },
    tagFilters: getTagFilterListForBackendSubscription(tagFilters),
    tagName: tag
  }).map(mapData);
}

function mapData(result) {
  if (!result.data) {
    return result;
  }
  return {
    ...result,
    data: result.data.suggestions.filter(suggestion => !isBlank(suggestion) && suggestion !== 'null')
  };
}

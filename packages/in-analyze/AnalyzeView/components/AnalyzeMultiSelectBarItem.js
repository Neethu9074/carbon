import { withProps } from 'recompose';
import React from 'react';

import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import MultiSelectBarItem from 'in-analyze/components/filterBar/MultiSelectBarItem';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
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

  return <AnalyzeSelectBarItemWithData {...props} />;
}

const AnalyzeSelectBarItemWithData = withProps({
  filterSuggestionsClientSide: true,
  getSuggestions: ({ timeConfig, tagFilters, tag }) => {
    return getTagSuggestions({
      filter: {
        timeConfig
      },
      tagFilters: getTagFilterListForBackendSubscription(tagFilters),
      tagName: tag
    }).map(mapData);
  }
})(MultiSelectBarItem);

function mapData(result) {
  if (!result.data) {
    return result;
  }
  return { ...result, data: result.data.suggestions };
}

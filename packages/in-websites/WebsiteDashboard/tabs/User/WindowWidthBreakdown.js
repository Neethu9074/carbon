import React, { useState } from 'react';

import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import getWindowWidthBreakdown from 'in-websites/subscriptions/getWindowWidthBreakdown';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import { number } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

// Sizes and labels taken from the Chrome developer tools
const sizes = {
  '<= 320px': 320,
  '<= 375px': 375,
  '<= 425px': 425,
  '<= 768px': 768,
  '<= 1440px': 1440,
  '<= 1650px': 1650,
  '<= 1920px': 1920,
  '<= 2560px': 2560,
  '> 2560px': 2561
};

export default connectTo(({ timeConfig, tagFilters }) => ({
  result: getWindowWidthBreakdown({
    timeConfig,
    tagFilters,
    windowWidths: Object.keys(sizes).map(label => sizes[label])
  })
}))(function WindowWidthBreakdown({ result, tagFilters, websiteLabel }) {
  const [selectedMetric, onChangeMetric] = useState('pageLoads');

  return (
    <TopListCardPresenter
      result={result}
      title="Browser Window Width Breakdown"
      metrics={['pageLoads', 'users']}
      labels={['Page Loads', 'Users']}
      selectedMetric={selectedMetric}
      onChangeMetric={onChangeMetric}
      getItemsFromResult={r => r.data}
      renderLabel={Label}
      getMetricValueFromItem={(selectedMetric, item) => item[selectedMetric]}
      selectedMetricFormatter={number.compact}
      tagFilters={tagFilters}
      websiteLabel={websiteLabel}
    />
  );
});

function Label({ item, tagFilters, websiteLabel }) {
  return (
    <Tooltip content={getTechnicalLabel(item.minWindowWidth, item.maxWindowWidth)}>
      <Link href$={getLink(tagFilters, websiteLabel, item.minWindowWidth, item.maxWindowWidth)}>
        {getHumanReadableLabel(item.minWindowWidth, item.maxWindowWidth)}
      </Link>
    </Tooltip>
  );
}

function getHumanReadableLabel(min, max) {
  for (let label in sizes) {
    if (sizes[label] >= min && (max < 1 || sizes[label] <= max)) {
      return label;
    }
  }

  return getTechnicalLabel(min, max);
}

function getTechnicalLabel(min, max) {
  if (min > 0 && max > 0) {
    return `Between ${min}px and ${max}px (inclusive)`;
  } else if (min) {
    return `At least ${min}px (inclusive)`;
  } else {
    return `At most ${max}px (inclusive)`;
  }
}

function getLink(tagFilters, websiteLabel, min, max) {
  tagFilters = translateDemocratisationTagFiltersToAnalyzeTagFilters({ websiteLabel, tagFilters });
  if (min > 0) {
    tagFilters.push({
      name: 'beacon.window.width',
      numberValue: min - 1,
      operator: 'GREATER_THAN'
    });
  }
  if (max > 0) {
    tagFilters.push({
      name: 'beacon.window.width',
      numberValue: max + 1,
      operator: 'LESS_THAN'
    });
  }
  return getLinkToAnalyze({
    tagFilters,
    group: {
      groupbyTag: 'beacon.window.width'
    },
    beaconType: 'pageLoad'
  });
}

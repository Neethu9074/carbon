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
  '4k': 2560,
  'Laptop (L)': 1440,
  Laptop: 1024,
  Tablet: 768,
  'Mobile (L)': 425,
  'Mobile (M)': 375,
  'Mobile (S)': 320
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
      onChangeMetric={onChangeMetric}
      selectedMetric={selectedMetric}
      showMetricSelectorsForSingleMetrics
      getItemsFromResult={r => r.data}
      renderLabel={Label}
      renderMetric={({ item, selectedMetric }) => number.compact(item[selectedMetric])}
      tagFilters={tagFilters}
      websiteLabel={websiteLabel}
      getMetricValueFromItem={getMetricValueFromItem}
      selectedMetricFormatter={number.compact}
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

function getMetricValueFromItem(selectedMetric, item) {
  return item[selectedMetric];
}

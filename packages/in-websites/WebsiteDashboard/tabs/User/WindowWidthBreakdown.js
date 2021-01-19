/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import getWindowWidthBreakdown from 'in-websites/subscriptions/getWindowWidthBreakdown';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { TopListWithUrlState } from 'in-new-components/TopListWithUrlState';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import { number } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';
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

const windowWidths = Object.keys(sizes).map(label => sizes[label]);

export default function WindowWidthBreakdown({ result, timeConfig, tagFilters, websiteLabel, urlMatrixParamConfig }) {
  return (
    <TopListWithUrlState
      result={result}
      title="Browser Window Width Breakdown"
      metrics={['pageLoads', 'users']}
      labels={['Page Loads', 'Users']}
      formatters={[number.compact, number.compact]}
      showMetricSelectorsForSingleMetrics
      getItemsFromResult={r => r.data}
      getList={getList}
      render={TopListCardPresenter}
      renderLabel={Label}
      renderMetric={Metric}
      timeConfig={timeConfig}
      tagFilters={tagFilters}
      websiteLabel={websiteLabel}
      getMetricValueFromItem={getMetricValueFromItem}
      urlMatrixParamConfig={urlMatrixParamConfig}
    />
  );
}

function getList({ tagFilters, timeConfig }) {
  return getWindowWidthBreakdown({
    timeConfig,
    tagFilters,
    windowWidths: windowWidths
  });
}

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

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
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
const sizes4kKey = t('in-websites:websiteDashboard.tabs.user.sizes4k');
const sizesLaptopLKey = t('in-websites:websiteDashboard.tabs.user.sizesLaptopL');
const sizesLaptopKey = t('in-websites:websiteDashboard.tabs.user.sizesLaptop');
const sizesTabletKey = t('in-websites:websiteDashboard.tabs.user.sizesTablet');
const sizesMobileLKey = t('in-websites:websiteDashboard.tabs.user.sizesMobileL');
const sizesMobileMKey = t('in-websites:websiteDashboard.tabs.user.sizesMobileM');
const sizesMobileSKey = t('in-websites:websiteDashboard.tabs.user.sizesMobileS');

const sizes = {
  [sizes4kKey]: 2560,
  [sizesLaptopLKey]: 1440,
  [sizesLaptopKey]: 1024,
  [sizesTabletKey]: 768,
  [sizesMobileLKey]: 425,
  [sizesMobileMKey]: 375,
  [sizesMobileSKey]: 320
};

const windowWidths = Object.keys(sizes).map(label => sizes[label]);

export default function WindowWidthBreakdown({ result, timeConfig, tagFilters, websiteLabel, urlMatrixParamConfig }) {
  return (
    <TopListWithUrlState
      result={result}
      title={t('in-websites:websiteDashboard.tabs.user.sizesTitleBrowserWindowWidthBreakdown')}
      metrics={['pageLoads', 'users']}
      labels={[
        t('in-websites:websiteDashboard.tabs.user.sizes4kLabelPageLoads'),
        t('in-websites:websiteDashboard.tabs.user.sizes4kLabelUsers')
      ]}
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
    return t('in-websites:websiteDashboard.tabs.user.sizesTechnicalLabelBetween', { min: min, max: max });
  } else if (min) {
    return t('in-websites:websiteDashboard.tabs.user.sizesTechnicalLabelAtLeast', { min: min });
  } else {
    return t('in-websites:websiteDashboard.tabs.user.sizesTechnicalLabelAtMost', { max: max });
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

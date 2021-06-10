/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useLocation } from 'react-router';
import { get } from 'lodash';
import React from 'react';

import { isAnalyticsOneLocation } from 'in-websites/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion/transformHelper';
import AnalyzeOneToTwoViewParameterConversion from 'in-websites/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion';
import { createTableTimestampColumnDefinition } from 'in-components/AnalyzeView/commonTableColumnDefinitions';
import { createListTimestampColumnDefinition } from 'in-components/AnalyzeView/commonListColumnDefinitions';
import FacetedFilterRangeInput from 'in-components/AnalyzeView/FacetedFilters/FacetedFilterRangeInput';
import { custom as customType, metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import FacetedFilterGeneric from 'in-components/AnalyzeView/FacetedFilters/FacetedFilterGeneric';
import { getFormatter as getBackendFormatter } from 'in-services/formatters/backendFormatter';
import { addDataSourceToBackendQueryModel } from 'in-websites/analyze/AnalyzeView2_0/util';
import GroupedBeacons from 'in-websites/analyze/AnalyzeView2_0/components/GroupedBeacons';
import getWebsiteBeaconGroups from 'in-websites/subscriptions/getWebsiteBeaconGroups';
import { wrapToDiscardNegativeValues } from 'in-analyze/metricDefinitionHelpers';
import Beacons from 'in-websites/analyze/AnalyzeView2_0/components/Beacons';
import StateManagement from 'in-components/AnalyzeView/StateManagement';
import { clsFormatter } from 'in-websites/analyze/AnalyzeView/metrics';
import { getMetricCatalog } from 'in-websites/api/metricCatalog';
import { analyzePath } from 'in-websites/navigation/paths';
import { beaconType } from 'in-websites/navigation/matrix';
import { getTagCatalog } from 'in-websites/api/tagCatalog';
import { t } from 'in-i18n';

const facetedSearchItems = [
  {
    renderer: FacetedFilterGeneric,
    title: t('in-websites:facetedSearch.website'),
    tag: 'beacon.website.name'
  },
  {
    renderer: FacetedFilterGeneric,
    title: t('in-websites:facetedSearch.page'),
    tag: 'beacon.page.name'
  },
  {
    renderer: FacetedFilterGeneric,
    title: t('in-websites:facetedSearch.browser'),
    tag: 'beacon.browser.name'
  },
  {
    renderer: FacetedFilterGeneric,
    title: t('in-websites:facetedSearch.os'),
    tag: 'beacon.os.name'
  },
  {
    renderer: FacetedFilterGeneric,
    title: t('in-websites:facetedSearch.country'),
    tag: 'beacon.geo.country'
  },
  {
    renderer: FacetedFilterGeneric,
    title: t('in-websites:facetedSearch.subdivision'),
    tag: 'beacon.geo.subdivision'
  },
  {
    renderer: FacetedFilterRangeInput,
    title: t('in-websites:facetedSearch.windowWidth'),
    tag: 'beacon.window.width'
  }
];

const groupedView = {
  defaultOrderBy: 'beaconCount_SUM',
  defaultOrderDirection: 'DESC',
  customFieldRenderingInstructions: {
    timestamp: createListTimestampColumnDefinition({
      getTimestamp: ({ item }) => item.earliestTimestamp
    })
  }
};

const ungroupedView = {
  defaultOrderBy: 'timestamp',
  defaultOrderDirection: 'DESC',
  customFieldRenderingInstructions: {
    timestamp: createTableTimestampColumnDefinition({
      getTimestamp: ({ beacon }) => beacon.timestamp
    })
  },
  metricFieldExtractors: {
    getColumnId({ metricDefinition }) {
      return metricDefinition.tagName;
    },
    getColumnLabel({ metricDefinition, tagCatalog }) {
      const tagLabel = tagCatalog?.tagsByName[metricDefinition.tagName]?.label;
      return tagLabel ?? metricDefinition.label;
    },
    getColumnFormatter({ metricDefinition }) {
      // Tag definitions in the tag catalog do not specify a formatter. For now we can use metric formatter.
      if (metricDefinition.metricId === 'cumulativeLayoutShift') {
        return wrapToDiscardNegativeValues(clsFormatter).detailed;
      }
      let formatter = metricDefinition.formatter;
      if (formatter === 'PERCENTAGE') {
        // 'PERCENTAGE' formatter is currently used only for a calculated metric (beaconErrorRate),
        // which is based on a numeric tag.
        formatter = 'NUMBER';
      }
      return wrapToDiscardNegativeValues(getBackendFormatter(formatter)).compact;
    },
    getColumnValue({ metricDefinition, beacon }) {
      return metricDefinition.pathToValueInBeacon && get(beacon, metricDefinition.pathToValueInBeacon);
    },
    hasRawValue({ metricDefinition }) {
      return metricDefinition.pathToValueInBeacon != null;
    }
  }
};

const fixedFields = [
  { type: customType, customFieldId: 'timestamp' },
  { type: metricType, metricId: 'beaconCount', aggregationId: 'SUM' }
];

const defaultChartedMetrics = [{ metricId: 'beaconCount', aggregationId: 'SUM' }];

const dataSourceConfigurations = {
  pageLoad: {
    metricCatalogTransformer: createMetricCatalogTransformer('pageLoad'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultSelectableFields: [
      {
        type: 'metric',
        metricId: 'onLoadTime',
        aggregationId: 'MEAN'
      }
    ],
    defaultChartedMetrics,
    getCustomMetricUiFormatterName: metricId =>
      metricId === 'cumulativeLayoutShift' ? 'fourDecimalPlaces.detailed' : null
  },
  pageChange: {
    metricCatalogTransformer: createMetricCatalogTransformer('pageChange'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultSelectableFields: [
      {
        type: 'metric',
        metricId: 'uniqueUsersOrSessions',
        aggregationId: 'DISTINCT_COUNT'
      }
    ],
    defaultChartedMetrics
  },
  resourceLoad: {
    metricCatalogTransformer: createMetricCatalogTransformer('resourceLoad'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultSelectableFields: [
      {
        type: 'metric',
        metricId: 'beaconDuration',
        aggregationId: 'MEAN'
      }
    ],
    defaultChartedMetrics
  },
  httpRequest: {
    metricCatalogTransformer: createMetricCatalogTransformer('httpRequest'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultSelectableFields: [
      {
        type: 'metric',
        metricId: 'beaconDuration',
        aggregationId: 'MEAN'
      },
      {
        type: 'metric',
        metricId: 'beaconErrorRate',
        aggregationId: 'MEAN'
      }
    ],
    defaultChartedMetrics
  },
  error: {
    metricCatalogTransformer: createMetricCatalogTransformer('error'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultSelectableFields: [
      {
        type: 'metric',
        metricId: 'uniqueUsersOrSessions',
        aggregationId: 'DISTINCT_COUNT'
      }
    ],
    defaultChartedMetrics
  },
  custom: {
    metricCatalogTransformer: createMetricCatalogTransformer('custom'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultSelectableFields: [
      {
        type: 'metric',
        metricId: 'uniqueUsersOrSessions',
        aggregationId: 'DISTINCT_COUNT'
      }
    ],
    defaultChartedMetrics
  }
};

const dataSourceParameter = {
  path: analyzePath,
  name: beaconType
};

export default function WebsiteAnalyzeView() {
  const location = useLocation();
  if (isAnalyticsOneLocation(location)) {
    return <AnalyzeOneToTwoViewParameterConversion dataSourceConfigurations={dataSourceConfigurations} />;
  }

  return (
    <StateManagement
      path={analyzePath}
      defaultDataSource="pageLoad"
      dataSourceParameter={dataSourceParameter}
      getTagCatalog={getTagCatalog}
      getMetricCatalog={getMetricCatalog}
      dataSourceConfigurations={dataSourceConfigurations}
    >
      {opts =>
        opts.isGrouped ? (
          <GroupedBeacons
            {...opts}
            getFacetedSearchSuggestions={getFacetedSearchSuggestions}
            useLastValidStateWhenErroneous
          />
        ) : (
          <Beacons {...opts} getFacetedSearchSuggestions={getFacetedSearchSuggestions} useLastValidStateWhenErroneous />
        )
      }
    </StateManagement>
  );
}

function createMetricCatalogTransformer(dataSource) {
  return metricDefinition => (metricDefinition.beaconTypes.includes(dataSource) ? metricDefinition : null);
}

function getFacetedSearchSuggestions({
  timeConfig,
  backendQueryModel,
  backendQueryModelExcludingMissingGroupingTag,
  group,
  metricKey,
  dataSource
}) {
  return getWebsiteBeaconGroups({
    pagination: {
      retrievalSize: 200
    },
    timeConfig,
    tagFilterExpression: addDataSourceToBackendQueryModel({
      // Because the grouped view doesn't support a special 'Tag not present' group, faceted search
      // should filter out items which would belong to this group for consistency with the result list.
      backendQueryModel: backendQueryModelExcludingMissingGroupingTag ?? backendQueryModel,
      dataSource
    }),
    group,
    order: {
      by: metricKey,
      direction: 'DESC'
    },
    metrics: {
      [metricKey]: {
        metric: 'beaconCount',
        aggregation: 'SUM'
      }
    }
  });
}

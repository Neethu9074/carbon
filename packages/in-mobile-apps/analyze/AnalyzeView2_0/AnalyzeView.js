/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { isAnalyticsOneLocation } from 'in-mobile-apps/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion/transformHelper';
import AnalyzeOneToTwoViewParameterConversion from 'in-mobile-apps/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion';
import { createTableTimestampColumnDefinition } from 'in-components/AnalyzeView/commonTableColumnDefinitions';
import { createListTimestampColumnDefinition } from 'in-components/AnalyzeView/commonListColumnDefinitions';
import FacetedFilterMultiSelect from 'in-components/AnalyzeView/FacetedFilters/FacetedFilterMultiSelect';
import GroupedMobileBeacons from 'in-mobile-apps/analyze/AnalyzeView2_0/components/GroupedMobileBeacons';
import { custom as customType, metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { addDataSourceToBackendQueryModel } from 'in-mobile-apps/analyze/AnalyzeView2_0/util';
import getMobileAppBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppBeaconGroups';
import MobileBeacons from 'in-mobile-apps/analyze/AnalyzeView2_0/components/MobileBeacons';
import { toBackendQuery } from 'in-components/AnalyzeView/FacetedFilters/facets';
import { wrapToDiscardNegativeValues } from 'in-analyze/metricDefinitionHelpers';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import StateManagement from 'in-components/AnalyzeView/StateManagement';
import { getMetricTemplates } from 'in-mobile-apps/api/metricTemplates';
import { getFormatter } from 'in-services/formatters/backendFormatter';
import { getMetricCatalog } from 'in-mobile-apps/api/metricCatalog';
import { analyzePath } from 'in-mobile-apps/navigation/paths';
import { beaconType } from 'in-mobile-apps/navigation/matrix';
import { getTagCatalog } from 'in-mobile-apps/api/tagCatalog';
import { t } from 'in-i18n';

const renderer = FacetedFilterMultiSelect;

function getMetric({ metrics }) {
  return metrics?.facetedSearchMetric[0][1];
}

const facetedSearchItems = [
  {
    renderer,
    title: t('in-mobile-apps:facetedSearch.mobileApp'),
    tag: 'mobileBeacon.mobileApp.name',
    getMetric
  },
  {
    renderer,
    title: t('in-mobile-apps:facetedSearch.view'),
    tag: 'mobileBeacon.view.name',
    getMetric
  },
  {
    renderer,
    title: t('in-mobile-apps:facetedSearch.platform'),
    tag: 'mobileBeacon.platform',
    getMetric
  },
  {
    renderer,
    title: t('in-mobile-apps:facetedSearch.os'),
    tag: 'mobileBeacon.os.name',
    getMetric
  },
  {
    renderer,
    title: t('in-mobile-apps:facetedSearch.bundle'),
    tag: 'mobileBeacon.app.bundleIdentifier',
    getMetric
  },
  {
    renderer,
    title: t('in-mobile-apps:facetedSearch.version'),
    tag: 'mobileBeacon.app.version',
    getMetric
  },
  {
    renderer,
    title: t('in-mobile-apps:facetedSearch.country'),
    tag: 'mobileBeacon.geo.country',
    getMetric
  },
  {
    renderer,
    title: t('in-mobile-apps:facetedSearch.subdivision'),
    tag: 'mobileBeacon.geo.subdivision',
    getMetric
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
    getColumnValue({ metricDefinition, beacon }) {
      return metricDefinition.pathToValueInBeacon && get(beacon, metricDefinition.pathToValueInBeacon);
    },
    getColumnLabel({ metricDefinition, tagCatalog }) {
      const tagLabel = tagCatalog?.tagsByName[metricDefinition.tagName]?.label;
      return tagLabel ?? metricDefinition.label;
    },
    getColumnFormatter({ metricDefinition }) {
      let formatter = metricDefinition.formatter;
      // Tag definitions in the tag catalog do not specify a formatter. For now we can use metric formatter.
      if (formatter === 'PERCENTAGE') {
        // 'PERCENTAGE' formatter is currently used only for a calculated metric (beaconErrorRate),
        // which is based on a numeric tag.
        formatter = 'NUMBER';
      }
      return wrapToDiscardNegativeValues(getFormatter(formatter)).compact;
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
  sessionStart: {
    metricCatalogTransformer: createMetricCatalogTransformer('sessionStart'),
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
  viewChange: {
    metricCatalogTransformer: createMetricCatalogTransformer('viewChange'),
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
  custom: {
    metricCatalogTransformer: createMetricCatalogTransformer('custom'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultChartedMetrics
  },
  crash: {
    metricCatalogTransformer: createMetricCatalogTransformer('crash'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultChartedMetrics
  },
  perf: {
    metricCatalogTransformer: createMetricCatalogTransformer('perf'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultChartedMetrics
  }
};

const dataSourceParameter = {
  path: analyzePath,
  name: beaconType
};

export default function MobileAnalyzeView() {
  const location = useLocation();
  if (isAnalyticsOneLocation(location)) {
    return <AnalyzeOneToTwoViewParameterConversion dataSourceConfigurations={dataSourceConfigurations} />;
  }

  return (
    <StateManagement
      path={analyzePath}
      defaultDataSource="sessionStart"
      dataSourceParameter={dataSourceParameter}
      getTagCatalog={getTagCatalog}
      getMetricCatalog={getMetricCatalog}
      getMetricTemplates={getMetricTemplates}
      dataSourceConfigurations={dataSourceConfigurations}
    >
      {opts =>
        opts.isGrouped ? (
          <GroupedMobileBeacons
            {...opts}
            getFacetedSearchSuggestions={getFacetedSearchSuggestions}
            useLastValidStateWhenErroneous
          />
        ) : (
          <MobileBeacons
            {...opts}
            getFacetedSearchSuggestions={getFacetedSearchSuggestions}
            useLastValidStateWhenErroneous
          />
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
  facets,
  tag,
  formModel,
  excludeMissingGroupingTagFilterExpression,
  group,
  metricKey,
  dataSource
}) {
  const backendQuery = toBackendQuery({
    formModel,
    facets,
    facetedSearchConfiguration: facetedSearchItems,
    tagToExclude: tag,
    excludeMissingGroupingTagFilterExpression
  });
  return getMobileAppBeaconGroups({
    pagination: {
      retrievalSize: 200
    },
    timeConfig,
    tagFilterExpression: addDataSourceToBackendQueryModel({
      backendQueryModel: backendQuery,
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

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useLocation } from 'react-router';
import { get } from 'lodash';
import React from 'react';

import { isAnalyticsOneLocation } from 'in-mobile-apps/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion/transformHelper';
import AnalyzeOneToTwoViewParameterConversion from 'in-mobile-apps/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion';
import { createTableTimestampColumnDefinition } from 'in-new-components/AnalyzeView/commonTableColumnDefinitions';
import { createListTimestampColumnDefinition } from 'in-new-components/AnalyzeView/commonListColumnDefinitions';
import GroupedMobileBeacons from 'in-mobile-apps/analyze/AnalyzeView2_0/components/GroupedMobileBeacons';
import { custom as customType, metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';
import FacetedFilterGeneric from 'in-new-components/AnalyzeView/FacetedFilters/FacetedFilterGeneric';
import { addDataSourceToBackendQueryModel } from 'in-mobile-apps/analyze/AnalyzeView2_0/util';
import getMobileAppBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppBeaconGroups';
import MobileBeacons from 'in-mobile-apps/analyze/AnalyzeView2_0/components/MobileBeacons';
import { getSingleNumberMetricId } from 'in-new-components/AnalyzeView/metrics';
import StateManagement from 'in-new-components/AnalyzeView/StateManagement';
import { getMetricCatalog } from 'in-mobile-apps/api/metricCatalog';
import { analyzePath } from 'in-mobile-apps/navigation/paths';
import { beaconType } from 'in-mobile-apps/navigation/matrix';
import { getTagCatalog } from 'in-mobile-apps/api/tagCatalog';
import { t } from 'in-i18n';

const facetedSearchItems = [
  {
    renderer: FacetedFilterGeneric,
    title: t('in-mobile-apps:facetedSearch.mobileApp'),
    tag: 'mobileBeacon.mobileApp.name'
  },
  {
    renderer: FacetedFilterGeneric,
    title: t('in-mobile-apps:facetedSearch.view'),
    tag: 'mobileBeacon.view.name'
  },
  {
    renderer: FacetedFilterGeneric,
    title: t('in-mobile-apps:facetedSearch.platform'),
    tag: 'mobileBeacon.platform'
  },
  {
    renderer: FacetedFilterGeneric,
    title: t('in-mobile-apps:facetedSearch.os'),
    tag: 'mobileBeacon.os.name'
  },
  {
    renderer: FacetedFilterGeneric,
    title: t('in-mobile-apps:facetedSearch.bundle'),
    tag: 'mobileBeacon.app.bundleIdentifier'
  },
  {
    renderer: FacetedFilterGeneric,
    title: t('in-mobile-apps:facetedSearch.version'),
    tag: 'mobileBeacon.app.version'
  },
  {
    renderer: FacetedFilterGeneric,
    title: t('in-mobile-apps:facetedSearch.country'),
    tag: 'mobileBeacon.geo.country'
  },
  {
    renderer: FacetedFilterGeneric,
    title: t('in-mobile-apps:facetedSearch.subdivision'),
    tag: 'mobileBeacon.geo.subdivision'
  }
];

const groupedView = {
  defaultOrderBy: 'beaconCount_SUM',
  defaultOrderDirection: 'DESC',
  getOrderById: getOrderByGroupId,
  customFieldRenderingInstructions: {
    timestamp: createListTimestampColumnDefinition({
      getTimestamp: ({ item }) => item.earliestTimestamp
    })
  }
};

const ungroupedView = {
  defaultOrderBy: 'timestamp',
  defaultOrderDirection: 'DESC',
  getOrderById: getOrderById,
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
      // Tag definitions in the tag catalog do not specify a formatter. For now we can use metric formatter.
      if (metricDefinition.formatter === 'PERCENTAGE') {
        // 'PERCENTAGE' formatter is currently used only for a calculated metric (beaconErrorRate),
        // which is based on a numeric tag.
        return 'NUMBER';
      }
      return metricDefinition.formatter;
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
    metricCatalogFilter: createMetricCatalogFilter('sessionStart'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultSelectableFields: [
      {
        type: 'metric',
        metricId: 'uniqueUsers',
        aggregationId: 'DISTINCT_COUNT'
      }
    ],
    defaultChartedMetrics
  },
  viewChange: {
    metricCatalogFilter: createMetricCatalogFilter('viewChange'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultSelectableFields: [
      {
        type: 'metric',
        metricId: 'uniqueUsers',
        aggregationId: 'DISTINCT_COUNT'
      }
    ],
    defaultChartedMetrics
  },
  httpRequest: {
    metricCatalogFilter: createMetricCatalogFilter('httpRequest'),
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
    metricCatalogFilter: createMetricCatalogFilter('custom'),
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
      dataSourceConfigurations={dataSourceConfigurations}
    >
      {opts =>
        opts.isGrouped ? (
          <GroupedMobileBeacons
            {...opts}
            getFacetedSearchSuggestions={getFacetedSearchSuggestions}
            getLabel={getLabel}
            useLastValidStateWhenErroneous
          />
        ) : (
          <MobileBeacons
            {...opts}
            getFacetedSearchSuggestions={getFacetedSearchSuggestions}
            getFacetedGroupLabel={getLabel}
            useLastValidStateWhenErroneous
          />
        )
      }
    </StateManagement>
  );
}

function getLabel(item) {
  return JSON.parse(item.name);
}

function createMetricCatalogFilter(dataSource) {
  return ({ beaconTypes }) => beaconTypes.includes(dataSource);
}

function getFacetedSearchSuggestions({
  timeConfig,
  backendQueryModel,
  backendQueryModelExcludingMissingGroupingTag,
  group,
  metricKey,
  dataSource
}) {
  return getMobileAppBeaconGroups({
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

function getOrderById({ metricCatalog, field }) {
  if (field.type === customType) {
    return field.customFieldId;
  }
  if (field.type === metricType) {
    const metricDefinition = metricCatalog?.find(({ metricId }) => metricId === field.metricId);
    return metricDefinition?.tagName;
  }
  return null;
}

function getOrderByGroupId({ field }) {
  if (field.type === customType) {
    return field.customFieldId === 'timestamp' ? 'earliestTimestamp' : field.customFieldId;
  }
  if (field.type === metricType) {
    return getSingleNumberMetricId(field);
  }
  return null;
}

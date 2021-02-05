/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { createTableTimestampColumnDefinition } from 'in-new-components/AnalyzeView/commonTableColumnDefinitions';
import { createListTimestampColumnDefinition } from 'in-new-components/AnalyzeView/commonListColumnDefinitions';
import FacetedFilterRangeInput from 'in-new-components/AnalyzeView/FacetedFilters/FacetedFilterRangeInput';
import { custom as customType, metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';
import FacetedFilterGeneric from 'in-new-components/AnalyzeView/FacetedFilters/FacetedFilterGeneric';
import { addDataSourceToBackendQueryModel } from 'in-websites/analyze/AnalyzeView2_0/util';
import GroupedBeacons from 'in-websites/analyze/AnalyzeView2_0/components/GroupedBeacons';
import getWebsiteBeaconGroups from 'in-websites/subscriptions/getWebsiteBeaconGroups';
import { getSingleNumberMetricId } from 'in-new-components/AnalyzeView/metrics';
import StateManagement from 'in-new-components/AnalyzeView/StateManagement';
import Beacons from 'in-websites/analyze/AnalyzeView2_0/components/Beacons';
import { getMetricCatalog } from 'in-websites/api/metricCatalog';
import { analyzePath } from 'in-websites/navigation/paths';
import { beaconType } from 'in-websites/navigation/matrix';
import { getTagCatalog } from 'in-websites/api/tagCatalog';
import { t } from 'in-i18n';

const facetedSearchItems = [
  {
    renderer: FacetedFilterGeneric,
    title: t('in-websites:facetedSearch.website'),
    tag: 'beacon.website.name',
    openByDefault: true
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
    }
  }
};

const fixedFields = [
  { type: customType, customFieldId: 'timestamp' },
  { type: metricType, metric: 'beaconCount', aggregation: 'SUM' }
];

const dataSourceConfigurations = {
  pageLoad: {
    metricCatalogFilter: createMetricCatalogFilter('pageLoad'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultSelectableFields: [{ type: 'metric', metric: 'beaconDuration', aggregation: 'SUM' }]
  },
  pageChange: {
    metricCatalogFilter: createMetricCatalogFilter('pageChange'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultSelectableFields: [
      {
        type: 'metric',
        metric: 'uniqueUsersOrSessions',
        aggregation: 'DISTINCT_COUNT',
        label: t('in-websites:fieldLabels.uniqueUsersOrSessions')
      }
    ]
  },
  resourceLoad: {
    metricCatalogFilter: createMetricCatalogFilter('resourceLoad'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultFields: [
      {
        type: 'metric',
        metric: 'beaconDuration',
        aggregation: 'MEAN',
        label: t('in-websites:fieldLabels.retrievalTime')
      }
    ]
  },
  httpRequest: {
    metricCatalogFilter: createMetricCatalogFilter('httpRequest'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultFields: [
      {
        type: 'metric',
        metric: 'beaconDuration',
        aggregation: 'MEAN',
        label: t('in-websites:fieldLabels.retrievalTime')
      },
      {
        type: 'metric',
        metric: 'beaconErrorRate',
        aggregation: 'MEAN',
        label: t('in-websites:fieldLabels.errorCount')
      }
    ]
  },
  error: {
    metricCatalogFilter: createMetricCatalogFilter('error'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultFields: [
      {
        type: 'metric',
        metric: 'uniqueUsersOrSessions',
        aggregation: 'DISTINCT_COUNT',
        label: t('in-websites:fieldLabels.affectedUsersOrSessions')
      }
    ]
  },
  custom: {
    metricCatalogFilter: createMetricCatalogFilter('custom'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultFields: [
      {
        type: 'metric',
        metric: 'uniqueUsersOrSessions',
        aggregation: 'DISTINCT_COUNT',
        label: t('in-websites:fieldLabels.uniqueUsersOrSessions')
      }
    ]
  }
};

const dataSourceParameter = {
  path: analyzePath,
  name: beaconType
};

export default function WebsiteAnalyzeView() {
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

function createMetricCatalogFilter(dataSource) {
  return ({ beaconTypes }) => beaconTypes.includes(dataSource);
}

function getFacetedSearchSuggestions({ timeConfig, backendQueryModel, group, metricKey, dataSource }) {
  return getWebsiteBeaconGroups({
    pagination: {
      retrievalSize: 200
    },
    timeConfig,
    tagFilterExpression: addDataSourceToBackendQueryModel({ backendQueryModel, dataSource }),
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
    const metricDefinition = metricCatalog?.find(({ metricId }) => metricId === field.metric);
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

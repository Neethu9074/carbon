/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { createTableTimestampColumnDefinition } from 'in-new-components/AnalyzeView/commonTableColumnDefinitions';
import { createListTimestampColumnDefinition } from 'in-new-components/AnalyzeView/commonListColumnDefinitions';
import FacetedFilterRangeInput from 'in-new-components/AnalyzeView/FacetedFilters/FacetedFilterRangeInput';
import FacetedFilterGeneric from 'in-new-components/AnalyzeView/FacetedFilters/FacetedFilterGeneric';
import { addTagFilters } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import GroupedBeacons from 'in-websites/analyze/AnalyzeView2_0/components/GroupedBeacons';
import getWebsiteBeaconGroups from 'in-websites/subscriptions/getWebsiteBeaconGroups';
import StateManagement from 'in-new-components/AnalyzeView/StateManagement';
import Beacons from 'in-websites/analyze/AnalyzeView2_0/components/Beacons';
import { getMetricCatalog } from 'in-websites/api/metricCatalog';
import { analyzePath } from 'in-websites/navigation/paths';
import { beaconType } from 'in-websites/navigation/matrix';
import { getTagCatalog } from 'in-websites/api/tagCatalog';

const facetedSearchItems = [
  {
    renderer: FacetedFilterGeneric,
    title: 'Website',
    tag: 'beacon.website.name',
    openByDefault: true
  },
  {
    renderer: FacetedFilterGeneric,
    title: 'Page',
    tag: 'beacon.page.name'
  },
  {
    renderer: FacetedFilterGeneric,
    title: 'Browser',
    tag: 'beacon.browser.name'
  },
  {
    renderer: FacetedFilterGeneric,
    title: 'OS',
    tag: 'beacon.os.name'
  },
  {
    renderer: FacetedFilterGeneric,
    title: 'Country',
    tag: 'beacon.geo.country'
  },
  {
    renderer: FacetedFilterGeneric,
    title: 'Subdivision',
    tag: 'beacon.geo.subdivision'
  },
  {
    renderer: FacetedFilterRangeInput,
    title: 'Window Width',
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
  }
};

const defaultFields = [
  {
    type: 'custom',
    customFieldId: 'timestamp'
  },
  {
    type: 'metric',
    metric: 'beaconCount',
    aggregation: 'SUM'
  }
];

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
      groupedView={groupedView}
      ungroupedView={ungroupedView}
      defaultFields={defaultFields}
    >
      {opts =>
        opts.isGrouped ? (
          <GroupedBeacons
            {...opts}
            facetedSearchItems={facetedSearchItems}
            getFacetedSearchSuggestions={getFacetedSearchSuggestions}
            useLastValidStateWhenErroneous
          />
        ) : (
          <Beacons
            {...opts}
            facetedSearchItems={facetedSearchItems}
            getFacetedSearchSuggestions={getFacetedSearchSuggestions}
            useLastValidStateWhenErroneous
          />
        )
      }
    </StateManagement>
  );
}

function getFacetedSearchSuggestions({ timeConfig, backendQueryModel, group, metricKey, dataSource }) {
  return getWebsiteBeaconGroups({
    pagination: {
      retrievalSize: 200
    },
    timeConfig,
    tagFilterExpression: addTagFilters(backendQueryModel, [
      {
        type: 'TAG_FILTER',
        name: 'beacon.type',
        operator: 'EQUALS',
        value: dataSource
      }
    ]),
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

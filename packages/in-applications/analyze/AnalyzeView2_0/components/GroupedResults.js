/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useCallback } from 'react';

import { FacetedSearchPresenter } from 'in-applications/analyze/AnalyzeView2_0/components/FacetedSearchPresenter';
import QueryBuilderWorkspace from 'in-applications/analyze/AnalyzeView2_0/components/QueryBuilderWorkspace';
import FastQueryModeToggle from 'in-applications/analyze/AnalyzeView2_0/components/FastQueryModeToggle';
import { ChartsPresenter } from 'in-applications/analyze/AnalyzeView2_0/components/ChartsPresenter';
import Results from 'in-applications/analyze/AnalyzeView2_0/components/Results';
import getTraceGroups from 'in-applications/subscriptions/getTraceGroups';
import getCallGroups from 'in-applications/subscriptions/getCallGroups';
import { useAnalyzeTracker } from 'in-analyze/hooks/useAnalyzeTracker';
import GroupedView from 'in-components/AnalyzeView/GroupedView';
import { emptyObject } from 'in-services/fixedObjects';
import { collationLanguage } from 'in-i18n';

const getDataPerDataSource = {
  calls: getCallGroups,
  traces: getTraceGroups
};

export default function GroupedResults(props) {
  const {
    hiddenCalls,
    fastQueryModeEnabled,
    onChangeFastQueryModeEnabled,
    Sidebar = FacetedSearchPresenter,
    Chart = ChartsPresenter
  } = props;

  const getData = useCallback(
    params => getTableData({ ...params, hiddenCalls, fastQueryModeEnabled }),
    [hiddenCalls, fastQueryModeEnabled]
  );
  const { trackUa2ExpandCollapseGroupedListItem } = useAnalyzeTracker();
  const tracker = {
    onToggleContentRow: () => trackUa2ExpandCollapseGroupedListItem(emptyObject)
  };

  return (
    <QueryBuilderWorkspace
      {...props}
      CustomAction={() => (
        <FastQueryModeToggle
          fastQueryModeEnabled={fastQueryModeEnabled}
          onChangeFastQueryModeEnabled={onChangeFastQueryModeEnabled}
        />
      )}
    >
      <GroupedView
        {...props}
        Sidebar={Sidebar}
        Chart={Chart}
        itemlabelColumnId="name"
        getData={getData}
        getLabel={getLabel}
        UngroupedView={Results}
        customLatencyUiFormatterName={'LATENCY_WITH_DECIMALS'}
        tracker={tracker}
      />
    </QueryBuilderWorkspace>
  );
}

function getLabel(item) {
  return item.name;
}

function getTableData({
  timeConfig,
  backendQueryModel,
  groupBy,
  cursor,
  orderByGroups,
  metrics,
  dataSource,
  hiddenCalls,
  fastQueryModeEnabled
}) {
  const { includeSynthetic = false, includeInternal = false } = hiddenCalls;
  const getData = getDataPerDataSource[dataSource];
  return getData({
    pagination: {
      cursor,
      retrievalSize: 20
    },
    group: groupBy,
    filter: {
      timeConfig
    },
    tagFilterExpression: backendQueryModel,
    order: { ...orderByGroups, collation: collationLanguage },
    metrics,
    includeSynthetic,
    includeInternal,
    queryPrecision: fastQueryModeEnabled ? 'APPROXIMATE' : 'FULL'
  });
}

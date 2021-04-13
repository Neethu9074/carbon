/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import emptyTagFilterExpression from 'in-new-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/components/QueryBuilderWorkspace';
import TagSelector from 'in-logging/analyze/AnalyzeView/components/TagSelector';
import { loadMoreClicked } from 'in-logging/analyze/AnalyzeView/tracker';
import GroupedView from 'in-new-components/AnalyzeView/GroupedView';
import Logs from 'in-logging/analyze/AnalyzeView/components/Logs';
import getLogGroups from 'in-logging/subscriptions/getLogGroups';
import SvgIcon from 'in-components/SvgIcon';

const columnDefinitions = [
  {
    id: 'icon',
    width: '2rem',
    getContent({ iconMap, groupBy }) {
      return <SvgIcon type={iconMap.get(groupBy?.groupbyTag)} />;
    }
  }
];

const tracker = {
  loadMoreClicked: () => {
    loadMoreClicked({ view: 'Grouped logs view' });
  }
};

export default function GroupedLogs(props) {
  const { filteringTagCatalog } = props;

  const iconMap = useMemo(() => createIconMap(filteringTagCatalog), [filteringTagCatalog]);

  return (
    <QueryBuilderWorkspace {...props}>
      <GroupedView
        {...props}
        itemlabelColumnId="label"
        columnDefinitions={columnDefinitions}
        getData={getTableData}
        iconMap={iconMap}
        UngroupedView={Logs}
        CustomHeaderActions={TagSelector}
        withoutChartGroupMarkers
        withoutSorting
        getItemLabel={({ label }) => label}
        tracker={tracker}
      />
    </QueryBuilderWorkspace>
  );
}

function createIconMap(tagCatalog) {
  const icons = new Map();
  const tagTree = tagCatalog?.tagTree;
  if (!tagTree) {
    return icons;
  }
  for (const child of tagTree[0].children) {
    addToMap(child, icons);
  }
  return icons;
}

function addToMap({ tagName, icon, children }, map) {
  map.set(tagName, icon);
  if (children) {
    for (const child of children) {
      addToMap(child, map);
    }
  }
}

function getTableData({ timeConfig, cursor, backendQueryModel, groupBy }) {
  return getLogGroups({
    timeConfig,
    groupBy: groupBy.groupbyTag,
    logicalOperator: 'AND',
    logTagFilterExpression: backendQueryModel,
    infraTagFilterExpression: emptyTagFilterExpression,
    pagination: {
      cursor,
      retrievalSize: 20
    }
  });
}

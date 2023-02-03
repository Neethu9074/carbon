/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { KeyValue, Stack } from '@instana/components';

import { FacetedSearchPresenter } from 'in-logging/analyze/AnalyzeView/components/FacetedSearchPresenter';
import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/components/QueryBuilderWorkspace';
import { number, percentage, withSiPrefixOneDecimalPlace } from 'in-services/formatters/number';
import { ChartsPresenter } from 'in-logging/analyze/AnalyzeView/components/ChartsPresenter';
import { logLevelColors } from 'in-logging/analyze/AnalyzeView/components/constants';
import { Logs } from 'in-logging/analyze/AnalyzeView/components/Logs';
import getLogGroups from 'in-logging/subscriptions/getLogGroups';
import GroupedView from 'in-components/AnalyzeView/GroupedView';
import AggregationSymbol from 'in-components/AggregationSymbol';
import { GROUP_COLORS } from 'in-components/AnalyzeView/utils';
import { LOG_LEVEL } from 'in-logging/queryBuilder';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

const columnDefinitions = [
  {
    id: 'numberOfLogsPercentage',
    width: '7rem',
    widthInAbsoluteUnit: true,
    getContent({ item }) {
      return (
        <KeyValue
          label={t('in-logging:numberOfLogsPercentage')}
          value={percentage.detailed(item.percentage)}
          accentuated
        />
      );
    }
  },
  {
    id: 'numberOfLogs',
    width: '8rem',
    widthInAbsoluteUnit: true,
    getContent({ item }) {
      const { numberOfLogs } = item;
      const formattedNumber = number.forcedCompact.compact(numberOfLogs);

      const Value = (
        <Stack align="center" gap="xxsmall" direction="horizontal">
          <AggregationSymbol aggregation="SUM" />
          <Tooltip content={formattedNumber} align="mousePosition">
            <span>{withSiPrefixOneDecimalPlace(numberOfLogs)}</span>
          </Tooltip>
        </Stack>
      );

      return <KeyValue label={t('in-logging:numberOfLogs')} value={Value} accentuated />;
    }
  }
];

export default function GroupedLogs(props) {
  const { Chart = ChartsPresenter, Sidebar = FacetedSearchPresenter, filteringTagCatalog, groupBy } = props;

  const iconMap = useMemo(() => createIconMap(filteringTagCatalog), [filteringTagCatalog]);
  const getColor = (item, index) => getLogGroupColor(item, index, groupBy);

  return (
    <QueryBuilderWorkspace {...props} getColor={getColor}>
      <GroupedView
        {...props}
        Chart={Chart}
        Sidebar={Sidebar}
        columnDefinitions={columnDefinitions}
        itemlabelColumnId="label"
        getColor={getColor}
        getData={getTableData}
        iconMap={iconMap}
        UngroupedView={Logs}
        withoutSorting
      />
    </QueryBuilderWorkspace>
  );
}
function getLogGroupColor(item, index, groupBy) {
  if (groupBy?.groupbyTag === LOG_LEVEL) {
    const logLevel = item.label.toLowerCase();
    return logLevelColors[logLevel];
  }
  return GROUP_COLORS[index];
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
    group: groupBy,
    tagFilterExpression: backendQueryModel,
    pagination: {
      cursor,
      retrievalSize: 20
    }
  });
}

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import {
  timeSpent,
  timeframeUsed,
  facettedSearchGroupClicked,
  facettedSearchItemClicked
} from 'in-logging/analyze/AnalyzeView/tracker';
import emptyTagFilterExpression from 'in-new-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import FacetedFilterGeneric from 'in-new-components/AnalyzeView/FacetedFilters/FacetedFilterGeneric';
import { logIdMatrixParameter, selectedTags } from 'in-logging/navigation/matrix';
import GroupedLogs from 'in-logging/analyze/AnalyzeView/components/GroupedLogs';
import useTimeSpentInsideComponent from 'in-hooks/useTimeSpentInsideComponent';
import StateManagement from 'in-new-components/AnalyzeView/StateManagement';
import Logs from 'in-logging/analyze/AnalyzeView/components/Logs';
import getLogGroups from 'in-logging/subscriptions/getLogGroups';
import { getTagCatalog } from 'in-logging/api/catalog';
import { logsPath } from 'in-logging/navigation/paths';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';

const urlStateDefinition = {
  bind: [selectedTags]
};
const defaultChartedMetrics = [{ metricId: 'logs_distribution', aggregationId: 'SUM' }];

const facetedSearchItems = [
  {
    renderer: FacetedFilterRenderer,
    title: 'Log levels',
    tag: 'log.level'
  },
  {
    renderer: FacetedFilterRenderer,
    title: 'Stream',
    tag: 'log.streamName'
  }
];

export default function LoggingAnalyzeView() {
  const timeConfig = useTimeConfig();
  useEffect(() => {
    timeframeUsed({ timeConfig });
  }, [timeConfig.to, timeConfig.windowSize, timeConfig.autoRefresh, timeConfig.focusedMoment]);

  useTimeSpentInsideComponent(millisSpentOnAnalyzeView => timeSpent({ millisSpentOnAnalyzeView }));

  const [{ tags }, onChange] = useUrlState(urlStateDefinition);

  const furtherProps = {
    selectedTags: tags,
    onSelectedTagsChange: _tags => onChange({ tags: _tags })
  };

  return (
    <StateManagement
      path={logsPath}
      defaultDataSource="logs"
      dataSourceParameter={logIdMatrixParameter}
      getTagCatalog={getTagCatalog}
      dataSourceConfigurations={{
        logs: {
          groupedView: {
            defaultOrderBy: 'count',
            defaultOrderDirection: 'DESC',
            customFieldRenderingInstructions: {}
          },
          ungroupedView: {
            defaultOrderBy: 'timestamp',
            defaultOrderDirection: 'DESC',
            customFieldRenderingInstructions: {}
          },
          defaultChartedMetrics,
          facetedSearchItems,
          defaultSelectableFields: []
        }
      }}
    >
      {opts =>
        opts.isGrouped ? (
          <GroupedLogs
            {...opts}
            {...furtherProps}
            getFacetedSearchSuggestions={getFacetedSearchSuggestions}
            getLabel={getLabel}
          />
        ) : (
          <Logs
            {...opts}
            {...furtherProps}
            getFacetedSearchSuggestions={getFacetedSearchSuggestions}
            getFacetedGroupLabel={getLabel}
          />
        )
      }
    </StateManagement>
  );
}

function getLabel(item) {
  return item.label;
}

function getFacetedSearchSuggestions({ timeConfig, backendQueryModel, group, cursor }) {
  return getLogGroups({
    timeConfig,
    groupBy: group.groupbyTag,
    logicalOperator: 'AND',
    logTagFilterExpression: backendQueryModel,
    infraTagFilterExpression: emptyTagFilterExpression,
    pagination: {
      cursor,
      retrievalSize: 20
    }
  });
}

function FacetedFilterRenderer(props) {
  return (
    <FacetedFilterGeneric
      {...props}
      tracker={{
        suggestionClicked: facettedSearchItemClicked,
        groupClicked: facettedSearchGroupClicked
      }}
    />
  );
}

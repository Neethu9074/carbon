/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import emptyTagFilterExpression from 'in-new-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import FacetedFilterGeneric from 'in-new-components/AnalyzeView/FacetedFilters/FacetedFilterGeneric';
import GroupedLogs from 'in-logging/analyze/AnalyzeView/components/GroupedLogs';
import StateManagement from 'in-new-components/AnalyzeView/StateManagement';
import { logIdMatrixParameter } from 'in-logging/navigation/matrix';
import Logs from 'in-logging/analyze/AnalyzeView/components/Logs';
import getLogGroups from 'in-logging/subscriptions/getLogGroups';
import { selectedTags } from 'in-logging/navigation/matrix';
import { getTagCatalog } from 'in-logging/api/catalog';
import { logsPath } from 'in-logging/navigation/paths';
import useUrlState from 'in-hooks/useUrlState';

const urlStateDefinition = {
  bind: [selectedTags]
};

const facetedSearchItems = [
  {
    renderer: FacetedFilterGeneric,
    title: 'Log levels',
    tag: 'log.level'
  },
  {
    renderer: FacetedFilterGeneric,
    title: 'Stream',
    tag: 'log.streamName'
  }
];

export default function LoggingAnalyzeView() {
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

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import {
  facettedSearchGroupClicked,
  facettedSearchItemClicked,
  timeframeUsed,
  timeSpent
} from 'in-logging/analyze/AnalyzeView/tracker';
import FacetedFilterMultiSelect from 'in-components/AnalyzeView/FacetedFilters/FacetedFilterMultiSelect';
import TagExpressionValidation from 'in-logging/analyze/AnalyzeView/components/TagExpressionValidation';
import { logIdMatrixParameter, selectedTags } from 'in-logging/navigation/matrix';
import { toBackendQuery } from 'in-components/AnalyzeView/FacetedFilters/facets';
import GroupedLogs from 'in-logging/analyze/AnalyzeView/components/GroupedLogs';
import useTimeSpentInsideComponent from 'in-hooks/useTimeSpentInsideComponent';
import StateManagement from 'in-components/AnalyzeView/StateManagement';
import { LOG_LEVEL, LOG_STREAM_NAME } from 'in-logging/queryBuilder';
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

function getMetric({ numberOfLogs }) {
  return numberOfLogs;
}

function getLabel({ label }) {
  return label;
}

const facetedSearchItems = [
  {
    renderer: FacetedFilterRenderer,
    title: 'Log levels',
    tag: LOG_LEVEL,
    getSuggestionName: getLabel,
    getMetric
  },
  {
    renderer: FacetedFilterRenderer,
    title: 'Stream',
    tag: LOG_STREAM_NAME,
    getSuggestionName: getLabel,
    getMetric
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
      {opts => (
        <TagExpressionValidation {...opts}>
          {validationProps =>
            opts.isGrouped ? (
              <GroupedLogs
                {...opts}
                {...furtherProps}
                {...validationProps}
                getFacetedSearchSuggestions={getFacetedSearchSuggestions}
                getLabel={getLabel}
              />
            ) : (
              <Logs
                {...opts}
                {...furtherProps}
                {...validationProps}
                getFacetedSearchSuggestions={getFacetedSearchSuggestions}
              />
            )
          }
        </TagExpressionValidation>
      )}
    </StateManagement>
  );
}

function getFacetedSearchSuggestions({
  timeConfig,
  formModel,
  tag,
  excludeMissingGroupingTagFilterExpression,
  facets,
  facetedSearchItems,
  group,
  cursor
}) {
  const backendQuery = toBackendQuery({
    formModel,
    facets,
    facetedSearchConfiguration: facetedSearchItems,
    tagToExclude: tag,
    excludeMissingGroupingTagFilterExpression
  });

  return getLogGroups({
    timeConfig,
    group,
    tagFilterExpression: backendQuery,
    pagination: {
      cursor,
      retrievalSize: 20
    }
  });
}

function FacetedFilterRenderer(props) {
  return (
    <FacetedFilterMultiSelect
      {...props}
      openByDefault={false}
      tracker={{
        suggestionClicked: facettedSearchItemClicked,
        groupClicked: facettedSearchGroupClicked
      }}
    />
  );
}

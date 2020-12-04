import theme from 'in-themes';
import React from 'react';

import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { extendWindowSizeOnLiveMode } from 'in-applications/metrics';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { getFormatter } from 'in-stores/metric/formatters';
import { operators } from 'in-analyze/applicationFilter';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './Widget.mless';

export default function ListWidget({ config, title, actions, dragHandle }) {
  const timeConfig = useTimeConfig();
  const tagCatalog = useTagCatalog(getTagCatalog);
  let result = useResultData(config, timeConfig) ?? pendingResult;
  const isErroneous =
    config.metricConfiguration.metric === 'erroneousCalls' || config.metricConfiguration.metric === 'errors';
  return (
    <TopListCardPresenter
      title={title}
      result={result}
      getItemsFromResult={result => result.data}
      getMetricValueFromItem={(selectedMetric, item) => item.values?.[0]?.[1]}
      selectedMetricFormatter={metricValue => getFormatter(config.formatter)(metricValue)}
      selectedMetricColor={isErroneous ? theme.lib.colors.failure : null}
      renderLabel={({ item }) => {
        let filters = config.metricConfiguration.tagFilters;
        if (config.metricConfiguration.grouping) {
          if (item.label !== 'other_group') {
            filters = filters.concat([
              {
                name: config.metricConfiguration.grouping[0].by.groupbyTag,
                value: item.label,
                operator: operators.EQUALS,
                entity: config.metricConfiguration.grouping[0].by.groupbyTagEntity
              }
            ]);
          } else {
            filters = filters.concat(
              result.data
                .filter(item => item.label !== 'other_group')
                .map(item => {
                  return {
                    name: config.metricConfiguration.grouping[0].by.groupbyTag,
                    value: item.label,
                    operator: operators.NOT_EQUAL,
                    entity: config.metricConfiguration.grouping[0].by.groupbyTagEntity
                  };
                })
            );
          }
        }

        return (
          config.metricConfiguration.grouping && (
            <Link
              href$={
                tagCatalog &&
                getLinkToAnalyze({
                  dataSource: 'calls',
                  groupByTag: [],
                  filters,
                  tagCatalog
                })
              }
            >
              {item.label === 'other_group' ? (
                <Tooltip content="Aggregation of other groups" align="rightMiddle">
                  <div className={locals.italic}>Other</div>
                </Tooltip>
              ) : (
                item.label
              )}
            </Link>
          )
        );
      }}
      renderMetric={({ formattedMetricValue }) => formattedMetricValue}
      header={
        <>
          {dragHandle}
          {actions}
        </>
      }
    />
  );
}

function useResultData(config, timeConfig) {
  const timeConfigExtendedForLiveMode = extendWindowSizeOnLiveMode(timeConfig);

  const metrics = {
    list: {
      ...config.metricConfiguration,
      timeShift: {
        offset: 0
      },
      timeConfig: timeConfigExtendedForLiveMode,
      resultType: 'SINGLE_NUMBER'
    }
  };

  return useObservable(() => getUnifiedMetrics({ metrics }), [timeConfig, config]);
}

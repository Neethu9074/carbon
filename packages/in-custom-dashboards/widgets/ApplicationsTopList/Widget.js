import theme from 'in-themes';
import { get } from 'lodash';
import React from 'react';

import { SeverityIndicatorCellContentWrapper } from 'in-components/tables/sharedComponents';
import { getApplicationListSubscribeEvent } from 'in-applications/lists/ApplicationsList';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { number, meanLatencyFixed, percentage } from 'in-services/formatters/number';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import TopListWidget from 'in-custom-dashboards/widgets/TopListWidget';
import { applicationsList } from 'in-applications/navigation/paths';
import { boundaryScopes } from 'in-applications/constants';
import { getView } from 'in-stores/navigation/navigation';
import KeyValue from 'in-new-components/lists/KeyValue';
import WithIcon from 'in-new-components/WithIcon';
import Tooltip from 'in-components/Tooltip';

export default function ApplicationsTopList(props) {
  return (
    <TopListWidget
      {...props}
      icon="lib_application_invert"
      getData={({ timeConfig, query }) => getApplicationListSubscribeEvent({ timeConfig, query })}
      columnDefinitions={columnDefinitions}
      fullListView$={getView(applicationsList)}
      fullListViewLinkTitle="All Applications"
    />
  );
}

const columnDefinitions = [
  {
    id: 'applicationLabel',
    label: 'Name',
    getContent(item) {
      return (
        <SeverityIndicatorCellContentWrapper severity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}>
          <KeyValue
            label={`${get(item, ['metrics', 'services', 0, 1], 0)} Services`}
            value={item.application.label}
            inverted
            accentuated
          />
        </SeverityIndicatorCellContentWrapper>
      );
    }
  },
  {
    id: 'boundaryScope',
    label: 'Scope',
    sortable: false,
    getContent(item) {
      const href$ = getApplicationDashboard(item.application.id);
      const iconColor = href$ && theme.lib.colors.blue800;
      if (item.application.boundaryScope) {
        return (
          <Tooltip content={boundaryScopes.info[item.application.boundaryScope].dashboard}>
            <WithIcon icon={boundaryScopes.info[item.application.boundaryScope].icon} iconColor={iconColor} />
          </Tooltip>
        );
      }
      return null;
    }
  },
  {
    id: 'callsAgg',
    label: 'Calls',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={item.metrics.calls}
          metric={item.metrics.callsAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'latencyAgg',
    label: 'Latency',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          metrics={item.metrics.latency}
          metric={item.metrics.latencyAgg}
          tooltipFormatter={meanLatencyFixed.compact}
        />
      );
    }
  },
  {
    id: 'errorsAgg',
    label: 'Erroneous Call Rate',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          metrics={item.metrics.errors}
          metric={item.metrics.errorsAgg}
          tooltipFormatter={percentage.detailed}
        />
      );
    }
  }
];

import theme from 'in-themes';
import { get } from 'lodash';
import React from 'react';

import { getApplicationsWithDefaults } from 'in-subscription/application/getApplications';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { number, meanLatencyFixed, percentage } from 'in-services/formatters/number';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import TopListWidget from 'in-custom-dashboards/widgets/TopListWidget';
import { pin, unpin, types } from 'in-cockpit/pinnedItems/pinnedItems';
import HealthDot from 'in-new-components/health/HealthDot/HealthDot';
import { applicationsList } from 'in-applications/navigation/paths';
import { boundaryScopes } from 'in-applications/constants';
import { getView } from 'in-stores/navigation/navigation';
import KeyValue from 'in-new-components/lists/KeyValue';
import WithIcon from 'in-new-components/WithIcon';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

export default function ApplicationsTopList(props) {
  return (
    <TopListWidget
      {...props}
      icon="lib_application_invert"
      getItems={getApplicationsWithDefaults}
      pinnedItemTypes={[types.APPLCATIONS]}
      getId={item => item.application.id}
      pinItem={id => pin(types.APPLCATIONS, id)}
      unpinItem={id => unpin(types.APPLCATIONS, id)}
      columnDefinitions={columnDefinitions}
      fullListView$={getView(applicationsList)}
      fullListViewLinkTitle="All Applications"
    />
  );
}

const columnDefinitions = [
  {
    id: 'health',
    label: 'Health',
    width: 5,
    getContent(item) {
      return <HealthDot severity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)} iconSize={10} />;
    }
  },
  {
    id: 'applicationLabel',
    label: 'Name',
    getContent(item) {
      return (
        <WithIcon icon="lib_application">
          <KeyValue
            label={`${get(item, ['metrics', 'services', 0, 1], 0)} Services`}
            value={item.application.label}
            inverted
            accentuated
          />
        </WithIcon>
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
            <SvgIcon type={boundaryScopes.info[item.application.boundaryScope].icon} color={iconColor} />
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
          metrics={get(item, ['metrics', 'calls'])}
          metric={get(item, ['metrics', 'callsAgg'])}
          label="Calls"
          showAggregationIcon
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
          metrics={get(item, ['metrics', 'latency'])}
          metric={get(item, ['metrics', 'latencyAgg'])}
          label="Latency"
          showAggregationIcon
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
          metrics={get(item, ['metrics', 'errors'])}
          metric={get(item, ['metrics', 'errorsAgg'])}
          label="Erroneous Call Rate"
          showAggregationIcon
          tooltipFormatter={percentage.detailed}
        />
      );
    }
  }
];

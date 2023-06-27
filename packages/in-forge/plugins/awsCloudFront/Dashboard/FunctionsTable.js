/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.awsCloudFront.titleFunctionNames'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'function_associations.function_names')
    };
  },
  function FunctionsTable({ data, snapshot, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const functionNames = data.get('raw_payload');
    if (functionNames.size === 0) {
      return null;
    }

    const rows = functionNames.toArray().map(functionName => {
      return {
        key: functionName,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.awsCloudFront.titleAssociatedFunctions', { len: rows.length })}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
      />
    );
  }
);

function getDetails(row) {
  const functionName = row.key;
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.awsCloudFront.titleFunction')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: [
              'function_metrics.' + functionName + '.invocations',
              'function_metrics.' + functionName + '.compute_utilization',
              'function_metrics.' + functionName + '.throttles'
            ],
            labels: [
              t('in-forge:plugins.awsCloudFront.labelFunctionInvocations'),
              t('in-forge:plugins.awsCloudFront.labelFunctionComputeUtilization'),
              t('in-forge:plugins.awsCloudFront.labelFunctionThrottles')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsCloudFront.titleFunctionErrors')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: [
              'function_metrics.' + functionName + '.validation_errors',
              'function_metrics.' + functionName + '.execution_errors'
            ],
            labels: [
              t('in-forge:plugins.awsCloudFront.labelFunctionValidationErrors'),
              t('in-forge:plugins.awsCloudFront.labelFunctionExecutionErrors')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}

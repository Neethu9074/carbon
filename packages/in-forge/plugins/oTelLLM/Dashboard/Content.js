/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DataTable as CarbonDataTable } from '@instana/components';
import { Table, Thead, Tbody, Tr, Th, Td } from '@instana/legacy';

import TotalUsageBigNumber from 'in-forge/plugins/oTelLLM/Dashboard/TotalUsageBigNumber';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import TopListByModel from 'in-forge/plugins/oTelLLM/Dashboard/TopListByModel';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, millis, scale } from 'in-services/formatters/number';
import { days, hours, minutes, seconds } from 'in-services/time';
import { carbonTableEnabled } from 'in-services/featureFlags';
import Columize from 'in-sdk/components/dashboard/Columize';
import EntityLink from 'in-components/EntityLink';
import { t } from 'in-i18n';

export default function OTelLLMDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const metricIds = snapshot.get('metricIds');
  const tokens = metricIds.filter(metric => metric.includes('llm.usage.total_tokens')).toArray();
  const inputTokens = metricIds.filter(metric => metric.includes('llm.usage.input_tokens')).toArray();
  const outputTokens = metricIds.filter(metric => metric.includes('llm.usage.output_tokens')).toArray();
  const costs = metricIds.filter(metric => metric.includes('llm.usage.cost')).toArray();
  const inputCosts = metricIds.filter(metric => metric.includes('llm.usage.input_cost')).toArray();
  const outputCosts = metricIds.filter(metric => metric.includes('llm.usage.output_cost')).toArray();
  const count = metricIds.filter(metric => metric.includes('llm.request.count')).toArray();
  const durations = metricIds.filter(metric => metric.includes('llm.response.duration')).toArray();
  const getDashboardLink = useGetDashboardLink();

  const instanceId = snapshot.get('data').get('resource.service.instance.id');

  let minRollup = seconds.toMillis(10);
  if (timeConfig.windowSize >= days.toMillis(91)) {
    minRollup = days.toMillis(7);
  } else if (timeConfig.windowSize >= days.toMillis(7)) {
    minRollup = days.toMillis(1);
  } else if (timeConfig.windowSize >= hours.toMillis(24)) {
    minRollup = hours.toMillis(1);
  } else if (timeConfig.windowSize >= hours.toMillis(12)) {
    minRollup = minutes.toMillis(10);
  } else if (timeConfig.windowSize >= hours.toMillis(6)) {
    minRollup = minutes.toMillis(5);
  } else if (timeConfig.windowSize >= hours.toMillis(1)) {
    minRollup = minutes.toMillis(1);
  } else if (timeConfig.windowSize >= minutes.toMillis(30)) {
    minRollup = seconds.toMillis(30);
  }

  const carbonHeaders = [
    {
      key: 'llmonitor_agent',
      header: t('in-forge:plugins.oTelLLM.dashboard.llmonitor_agent')
    },
    {
      key: 'details',
      header: t('in-forge:plugins.oTelLLM.dashboard.details')
    }
  ];

  const carbonRows = [
    {
      key: '1',
      ['llmonitor_agent']: 'LLM',
      ['details']: (
        <EntityLink
          label={'Calls'}
          href={getDashboardLink(snapshot.get('id'), {
            pathname: '#/analyze;dataSource=calls',
            to: timeConfig.to,
            focusedMoment: timeConfig.to
          })}
        />
      )
    }
  ];

  return (
    <div>
      <Columize>
        <TotalUsageBigNumber
          title={t('in-forge:plugins.oTelLLM.dashboard.totalToken')}
          metricName="metrics.gauges.llm.usage.total_tokens"
          tagFilter={instanceId}
          formatter="number.compact"
        />
        <TotalUsageBigNumber
          title={t('in-forge:plugins.oTelLLM.dashboard.totalInputToken')}
          metricName="metrics.gauges.llm.usage.input_tokens"
          tagFilter={instanceId}
          formatter="number.compact"
        />
        <TotalUsageBigNumber
          title={t('in-forge:plugins.oTelLLM.dashboard.totalOutputToken')}
          metricName="metrics.gauges.llm.usage.output_tokens"
          tagFilter={instanceId}
          formatter="number.compact"
        />
      </Columize>

      <Columize>
        <TopListByModel
          title={t('in-forge:plugins.oTelLLM.dashboard.totalTokenByModel')}
          metricName="metrics.gauges.llm.usage.total_tokens"
          tagFilter={instanceId}
          formatter="number.compact"
        />
        <TopListByModel
          title={t('in-forge:plugins.oTelLLM.dashboard.totalInputTokenByModel')}
          metricName="metrics.gauges.llm.usage.input_tokens"
          tagFilter={instanceId}
          formatter="number.compact"
        />
        <TopListByModel
          title={t('in-forge:plugins.oTelLLM.dashboard.totalOutputTokenByModel')}
          metricName="metrics.gauges.llm.usage.output_tokens"
          tagFilter={instanceId}
          formatter="number.compact"
        />
      </Columize>

      <Columize>
        <TotalUsageBigNumber
          title={t('in-forge:plugins.oTelLLM.dashboard.totalCost')}
          metricName="metrics.gauges.llm.usage.cost"
          tagFilter={instanceId}
          formatter="scale.compact"
        />
        <TotalUsageBigNumber
          title={t('in-forge:plugins.oTelLLM.dashboard.totalInputCost')}
          metricName="metrics.gauges.llm.usage.input_cost"
          tagFilter={instanceId}
          formatter="scale.compact"
        />
        <TotalUsageBigNumber
          title={t('in-forge:plugins.oTelLLM.dashboard.totalOutputCost')}
          metricName="metrics.gauges.llm.usage.output_cost"
          tagFilter={instanceId}
          formatter="scale.compact"
        />
      </Columize>

      <Columize>
        <TopListByModel
          title={t('in-forge:plugins.oTelLLM.dashboard.totalCostByModel')}
          metricName="metrics.gauges.llm.usage.cost"
          tagFilter={instanceId}
          formatter="scale.compact"
        />
        <TopListByModel
          title={t('in-forge:plugins.oTelLLM.dashboard.totalInputCostByModel')}
          metricName="metrics.gauges.llm.usage.input_cost"
          tagFilter={instanceId}
          formatter="scale.compact"
        />
        <TopListByModel
          title={t('in-forge:plugins.oTelLLM.dashboard.totalOutputCostByModel')}
          metricName="metrics.gauges.llm.usage.output_cost"
          tagFilter={instanceId}
          formatter="scale.compact"
        />
      </Columize>

      <Columize>
        <TotalUsageBigNumber
          title={t('in-forge:plugins.oTelLLM.dashboard.totalCount')}
          metricName="metrics.sums.llm.request.count"
          tagFilter={instanceId}
          formatter="number.compact"
        />
      </Columize>

      <Columize>
        <TopListByModel
          title={t('in-forge:plugins.oTelLLM.dashboard.totalCountByModel')}
          metricName="metrics.sums.llm.request.count"
          tagFilter={instanceId}
          formatter="number.compact"
        />
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelLLM.dashboard.token')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: tokens ? tokens : [],
              labels: tokens?.map(metric => {
                if (metric.split('.').length > 3) {
                  return metric.split('.')[3];
                }
                return t('in-forge:plugins.oTelLLM.dashboard.token');
              }),
              type: 'line',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oTelLLM.dashboard.inputToken')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: inputTokens ? inputTokens : [],
              labels: inputTokens?.map(metric => {
                if (metric.split('.').length > 3) {
                  return metric.split('.')[3];
                }
                return t('in-forge:plugins.oTelLLM.dashboard.inputToken');
              }),
              type: 'line',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oTelLLM.dashboard.outputToken')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: outputTokens ? outputTokens : [],
              labels: outputTokens?.map(metric => {
                if (metric.split('.').length > 3) {
                  return metric.split('.')[3];
                }
                return t('in-forge:plugins.oTelLLM.dashboard.outputToken');
              }),
              type: 'line',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelLLM.dashboard.cost')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: scale.detailed,
              metrics: costs ? costs : [],
              labels: costs?.map(metric => {
                if (metric.split('.').length > 3) {
                  return metric.split('.')[3];
                }
                return t('in-forge:plugins.oTelLLM.dashboard.cost');
              }),
              type: 'line',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oTelLLM.dashboard.inputCost')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: scale.detailed,
              metrics: inputCosts ? inputCosts : [],
              labels: inputCosts?.map(metric => {
                if (metric.split('.').length > 3) {
                  return metric.split('.')[3];
                }
                return t('in-forge:plugins.oTelLLM.dashboard.inputCost');
              }),
              type: 'line',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oTelLLM.dashboard.outputCost')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: scale.detailed,
              metrics: outputCosts ? outputCosts : [],
              labels: outputCosts?.map(metric => {
                if (metric.split('.').length > 3) {
                  return metric.split('.')[3];
                }
                return t('in-forge:plugins.oTelLLM.dashboard.outputCost');
              }),
              type: 'line',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelLLM.dashboard.count')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: count ? count : [],
              labels: count?.map(metric => {
                if (metric.split('.').length > 3) {
                  return metric.split('.')[3];
                }
                return t('in-forge:plugins.oTelLLM.dashboard.count');
              }),
              type: 'line',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelLLM.dashboard.duration')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: millis.detailed,
              metrics: durations ? durations : [],
              labels: durations?.map(metric => {
                if (metric.split('.').length > 3) {
                  return metric.split('.')[3];
                }
                return t('in-forge:plugins.oTelLLM.dashboard.duration');
              }),
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelLLM.dashboard.analytics')}>
          {/* carbon table render*/}
          {carbonTableEnabled && (
            <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} isExpanded={false} />
          )}
          {!carbonTableEnabled && (
            <Table>
              <Thead>
                <Tr size="regular">
                  <Th>{t('in-forge:plugins.oTelLLM.dashboard.llmonitor_agent')}</Th>
                  <Th>{t('in-forge:plugins.oTelLLM.dashboard.details')}</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr size="regular">
                  <Td>{'LLM'}</Td>
                  <Td>
                    <EntityLink
                      label={'Calls'}
                      href={getDashboardLink(snapshot.get('id'), {
                        pathname: '#/analyze;dataSource=calls',
                        to: timeConfig.to,
                        focusedMoment: timeConfig.to
                      })}
                    />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          )}
        </DashboardSection>
      </Columize>
    </div>
  );
}

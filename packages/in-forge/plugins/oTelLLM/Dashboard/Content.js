/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DataTable as CarbonDataTable } from '@instana/components';

import TotalUsageBigNumber from 'in-forge/plugins/oTelLLM/Dashboard/TotalUsageBigNumber';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import TopListByModel from 'in-forge/plugins/oTelLLM/Dashboard/TopListByModel';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, millis, scale } from 'in-services/formatters/number';
import { days, hours, minutes, seconds } from 'in-services/time';
import Columize from 'in-sdk/components/dashboard/Columize';
import EntityLink from 'in-components/EntityLink';
import { t } from 'in-i18n';

export default function OTelLLMDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const metricIds = snapshot.get('metricIds');
  const tokens = metricIds
    .filter(metric => metric.includes('llm.usage.total_tokens'))
    .sort()
    .toArray();
  const inputTokens = metricIds
    .filter(metric => metric.includes('llm.usage.input_tokens'))
    .sort()
    .toArray();
  const outputTokens = metricIds
    .filter(metric => metric.includes('llm.usage.output_tokens'))
    .sort()
    .toArray();
  const costs = metricIds
    .filter(metric => metric.includes('llm.usage.cost'))
    .sort()
    .toArray();
  const inputCosts = metricIds
    .filter(metric => metric.includes('llm.usage.input_cost'))
    .sort()
    .toArray();
  const outputCosts = metricIds
    .filter(metric => metric.includes('llm.usage.output_cost'))
    .sort()
    .toArray();
  const count = metricIds
    .filter(metric => metric.includes('llm.request.count'))
    .sort()
    .toArray();
  const durations = metricIds
    .filter(metric => metric.includes('llm.response.duration'))
    .sort()
    .toArray();

  const serviceTokens = metricIds
    .filter(metric => metric.includes('llm.service.usage.total_tokens'))
    .sort()
    .toArray();
  const serviceInputTokens = metricIds
    .filter(metric => metric.includes('llm.service.usage.input_tokens'))
    .sort()
    .toArray();
  const serviceOutputTokens = metricIds
    .filter(metric => metric.includes('llm.service.usage.output_tokens'))
    .sort()
    .toArray();
  const serviceCosts = metricIds
    .filter(metric => metric.includes('llm.service.usage.cost'))
    .sort()
    .toArray();
  const serviceInputCosts = metricIds
    .filter(metric => metric.includes('llm.service.usage.input_cost'))
    .sort()
    .toArray();
  const serviceOutputCosts = metricIds
    .filter(metric => metric.includes('llm.service.usage.output_cost'))
    .sort()
    .toArray();
  const serviceCount = metricIds
    .filter(metric => metric.includes('llm.service.request.count'))
    .sort()
    .toArray();
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
          tag="metric.tag.model_id"
          tagFilter={instanceId}
          formatter="number.compact"
        />
        <TopListByModel
          title={t('in-forge:plugins.oTelLLM.dashboard.totalInputTokenByModel')}
          metricName="metrics.gauges.llm.usage.input_tokens"
          tag="metric.tag.model_id"
          tagFilter={instanceId}
          formatter="number.compact"
        />
        <TopListByModel
          title={t('in-forge:plugins.oTelLLM.dashboard.totalOutputTokenByModel')}
          metricName="metrics.gauges.llm.usage.output_tokens"
          tag="metric.tag.model_id"
          tagFilter={instanceId}
          formatter="number.compact"
        />
      </Columize>

      <Columize>
        <TopListByModel
          title={t('in-forge:plugins.oTelLLM.dashboard.totalTokenByService')}
          metricName="metrics.gauges.llm.service.usage.total_tokens"
          tag="metric.tag.service_name"
          tagFilter={instanceId}
          formatter="number.compact"
        />
        <TopListByModel
          title={t('in-forge:plugins.oTelLLM.dashboard.totalInputTokenByService')}
          metricName="metrics.gauges.llm.service.usage.input_tokens"
          tag="metric.tag.service_name"
          tagFilter={instanceId}
          formatter="number.compact"
        />
        <TopListByModel
          title={t('in-forge:plugins.oTelLLM.dashboard.totalOutputTokenByService')}
          metricName="metrics.gauges.llm.service.usage.output_tokens"
          tag="metric.tag.service_name"
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
          tag="metric.tag.model_id"
          tagFilter={instanceId}
          formatter="scale.compact"
        />
        <TopListByModel
          title={t('in-forge:plugins.oTelLLM.dashboard.totalInputCostByModel')}
          metricName="metrics.gauges.llm.usage.input_cost"
          tag="metric.tag.model_id"
          tagFilter={instanceId}
          formatter="scale.compact"
        />
        <TopListByModel
          title={t('in-forge:plugins.oTelLLM.dashboard.totalOutputCostByModel')}
          metricName="metrics.gauges.llm.usage.output_cost"
          tag="metric.tag.model_id"
          tagFilter={instanceId}
          formatter="scale.compact"
        />
      </Columize>

      <Columize>
        <TopListByModel
          title={t('in-forge:plugins.oTelLLM.dashboard.totalCostByService')}
          metricName="metrics.gauges.llm.service.usage.cost"
          tag="metric.tag.service_name"
          tagFilter={instanceId}
          formatter="scale.compact"
        />
        <TopListByModel
          title={t('in-forge:plugins.oTelLLM.dashboard.totalInputCostByService')}
          metricName="metrics.gauges.llm.service.usage.input_cost"
          tag="metric.tag.service_name"
          tagFilter={instanceId}
          formatter="scale.compact"
        />
        <TopListByModel
          title={t('in-forge:plugins.oTelLLM.dashboard.totalOutputCostByService')}
          metricName="metrics.gauges.llm.service.usage.output_cost"
          tag="metric.tag.service_name"
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
          tag="metric.tag.model_id"
          tagFilter={instanceId}
          formatter="number.compact"
        />
        <TopListByModel
          title={t('in-forge:plugins.oTelLLM.dashboard.totalCountByService')}
          metricName="metrics.sums.llm.service.request.count"
          tag="metric.tag.service_name"
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
        <DashboardSection title={t('in-forge:plugins.oTelLLM.dashboard.serviceToken')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: serviceTokens ? serviceTokens : [],
              labels: serviceTokens?.map(metric => {
                if (metric.split('.').length > 4) {
                  return metric.split('.')[4];
                }
                return t('in-forge:plugins.oTelLLM.dashboard.serviceToken');
              }),
              type: 'line',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oTelLLM.dashboard.serviceInputToken')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: serviceInputTokens ? serviceInputTokens : [],
              labels: serviceInputTokens?.map(metric => {
                if (metric.split('.').length > 4) {
                  return metric.split('.')[4];
                }
                return t('in-forge:plugins.oTelLLM.dashboard.serviceInputToken');
              }),
              type: 'line',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oTelLLM.dashboard.serviceOutputToken')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: serviceOutputTokens ? serviceOutputTokens : [],
              labels: serviceOutputTokens?.map(metric => {
                if (metric.split('.').length > 4) {
                  return metric.split('.')[4];
                }
                return t('in-forge:plugins.oTelLLM.dashboard.serviceOutputToken');
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
        <DashboardSection title={t('in-forge:plugins.oTelLLM.dashboard.serviceCost')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: scale.detailed,
              metrics: serviceCosts ? serviceCosts : [],
              labels: serviceCosts?.map(metric => {
                if (metric.split('.').length > 4) {
                  return metric.split('.')[4];
                }
                return t('in-forge:plugins.oTelLLM.dashboard.serviceCost');
              }),
              type: 'line',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oTelLLM.dashboard.serviceInputCost')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: scale.detailed,
              metrics: serviceInputCosts ? serviceInputCosts : [],
              labels: serviceInputCosts?.map(metric => {
                if (metric.split('.').length > 4) {
                  return metric.split('.')[4];
                }
                return t('in-forge:plugins.oTelLLM.dashboard.serviceInputCost');
              }),
              type: 'line',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oTelLLM.dashboard.serviceOutputCost')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: scale.detailed,
              metrics: serviceOutputCosts ? serviceOutputCosts : [],
              labels: serviceOutputCosts?.map(metric => {
                if (metric.split('.').length > 4) {
                  return metric.split('.')[4];
                }
                return t('in-forge:plugins.oTelLLM.dashboard.serviceOutputCost');
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
        <DashboardSection title={t('in-forge:plugins.oTelLLM.dashboard.serviceCount')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: serviceCount ? serviceCount : [],
              labels: serviceCount?.map(metric => {
                if (metric.split('.').length > 4) {
                  return metric.split('.')[4];
                }
                return t('in-forge:plugins.oTelLLM.dashboard.serviceCount');
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
          <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} isExpanded={false} />
        </DashboardSection>
      </Columize>
    </div>
  );
}

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import TotalUsageBigNumber from 'in-forge/plugins/oTelVLLM/Dashboard/TotalUsageBigNumber';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import TopListByModel from 'in-forge/plugins/oTelVLLM/Dashboard/TopListByModel';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { days, hours, minutes, seconds } from 'in-services/time';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const filterMetrics = (metricIds, keyword) =>
  metricIds
    .filter(metric => metric.includes(keyword))
    .sort()
    .toArray();

const generateLabels = (metricIds, defaultLabel, index) =>
  metricIds?.map(metric => {
    let parts = metric.split('.');
    if (parts.length > index) {
      return parts.slice(index, parts.length - 1).join('.');
    }
    return defaultLabel;
  });

export default function OTelVLLMDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const metricIds = snapshot.get('metricIds');

  const runningRequests = filterMetrics(metricIds, 'vllm.request.running.count');
  const waitingRequests = filterMetrics(metricIds, 'vllm.request.waiting.count');
  const gpuCacheUsage = filterMetrics(metricIds, 'vllm.gpu.cache.usage.perc');
  const gpuCacheHitRate = filterMetrics(metricIds, 'vllm.gpu.cache.hit.rate');
  const latency = filterMetrics(metricIds, 'vllm.request.latency');
  const ttft = filterMetrics(metricIds, 'vllm.request.ttft');
  const promptTokens = filterMetrics(metricIds, 'vllm.tokens.prompt.count');
  const generationTokens = filterMetrics(metricIds, 'vllm.tokens.generation.count');
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

  return (
    <div>
      <Columize>
        <TotalUsageBigNumber
          title={t('in-forge:plugins.oTelVLLM.dashboard.totalTokens')}
          metricName="metrics.gauges.vllm.tokens.total.count"
          tagFilter={instanceId}
          formatter="number.compact"
        />
        <TotalUsageBigNumber
          title={t('in-forge:plugins.oTelVLLM.dashboard.totalPromptTokens')}
          metricName="metrics.gauges.vllm.tokens.prompt.count"
          tagFilter={instanceId}
          formatter="number.compact"
        />
        <TotalUsageBigNumber
          title={t('in-forge:plugins.oTelVLLM.dashboard.totalGenerationTokens')}
          metricName="metrics.gauges.vllm.tokens.generation.count"
          tagFilter={instanceId}
          formatter="number.compact"
        />
      </Columize>

      <Columize>
        <TopListByModel
          title={t('in-forge:plugins.oTelVLLM.dashboard.totalTokensByInstance')}
          metricName="metrics.gauges.vllm.tokens.total.count"
          tag="metric.tag.service_name"
          tagFilter={instanceId}
          formatter="number.compact"
        />
        <TopListByModel
          title={t('in-forge:plugins.oTelVLLM.dashboard.totalPromptTokensByInstance')}
          metricName="metrics.gauges.vllm.tokens.prompt.count"
          tag="metric.tag.service_name"
          tagFilter={instanceId}
          formatter="number.compact"
        />
        <TopListByModel
          title={t('in-forge:plugins.oTelVLLM.dashboard.totalGenerationTokensByInstance')}
          metricName="metrics.gauges.vllm.tokens.generation.count"
          tag="metric.tag.service_name"
          tagFilter={instanceId}
          formatter="number.compact"
        />
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelVLLM.dashboard.promptTokens')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: promptTokens || [],
              labels: generateLabels(promptTokens, t('in-forge:plugins.oTelVLLM.dashboard.promptTokens'), 4),
              type: 'line',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oTelVLLM.dashboard.generationTokens')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: generationTokens || [],
              labels: generateLabels(generationTokens, t('in-forge:plugins.oTelVLLM.dashboard.generationTokens'), 4),
              type: 'line',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelVLLM.dashboard.runningRequests')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: runningRequests || [],
              labels: generateLabels(runningRequests, t('in-forge:plugins.oTelVLLM.dashboard.runningRequests'), 4),
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oTelVLLM.dashboard.waitingRequests')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: waitingRequests || [],
              labels: generateLabels(waitingRequests, t('in-forge:plugins.oTelVLLM.dashboard.waitingRequests'), 4),
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelVLLM.dashboard.gpuUsage')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: gpuCacheUsage || [],
              labels: generateLabels(gpuCacheUsage, t('in-forge:plugins.oTelVLLM.dashboard.gpuUsage'), 5),
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oTelVLLM.dashboard.gpuCacheHitRate')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: gpuCacheHitRate || [],
              labels: generateLabels(gpuCacheHitRate, t('in-forge:plugins.oTelVLLM.dashboard.gpuCacheHitRate'), 5),
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelVLLM.dashboard.latency')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: latency || [],
              labels: generateLabels(latency, t('in-forge:plugins.oTelVLLM.dashboard.latency'), 3),
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelVLLM.dashboard.ttft')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: ttft || [],
              labels: generateLabels(ttft, t('in-forge:plugins.oTelVLLM.dashboard.ttft'), 3),
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <CustomMetricsV2
        snapshot={snapshot}
        timeConfig={timeConfig}
        titlePrefix={t('in-forge:plugins.oTelVLLM.oTelLLM')}
        specs={SPECS}
      />
    </div>
  );
}
export const SPECS = [AVAILABLE_SPECS.GAUGE, AVAILABLE_SPECS.HISTOGRAM, AVAILABLE_SPECS.SUM, AVAILABLE_SPECS.SUMMARY];

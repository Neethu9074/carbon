/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Table, Thead, Tbody, Tr, Th, Td } from '@instana/legacy';

import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import TotalUsageBigNumber from 'in-forge/plugins/oTelLLM/Dashboard/TotalUsageBigNumber';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehaviorLLM';
import TopListByModel from 'in-forge/plugins/oTelLLM/Dashboard/TopListByModel';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, millis } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import EntityLink from 'in-components/EntityLink';
import { t } from 'in-i18n';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';

export default function OTelLLMDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const metricIds = snapshot.get('metricIds');
  const tokens = metricIds.filter(metric => metric.includes('llm.usage.total_tokens')).toArray();
  const costs = metricIds.filter(metric => metric.includes('llm.usage.cost')).toArray();
  const count = metricIds.filter(metric => metric.includes('llm.request.count')).toArray();
  const durations = metricIds.filter(metric => metric.includes('llm.response.duration')).toArray();

  const instanceId = snapshot.get('data').get('resource.service.instance.id');

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
          title={t('in-forge:plugins.oTelLLM.dashboard.totalCost')}
          metricName="metrics.gauges.llm.usage.cost"
          tagFilter={instanceId}
          formatter="number.detailed"
        />
        <TotalUsageBigNumber
          title={t('in-forge:plugins.oTelLLM.dashboard.totalCount')}
          metricName="metrics.sums.llm.request.count"
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
          title={t('in-forge:plugins.oTelLLM.dashboard.totalCostByModel')}
          metricName="metrics.gauges.llm.usage.cost"
          tagFilter={instanceId}
          formatter="number.detailed"
        />
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
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: tokens ? tokens : [],
              labels: tokens?.map(matric => {
                if (matric.split('.').length > 3) {
                  return matric.split('.')[3];
                }
                return t('in-forge:plugins.oTelLLM.dashboard.token');
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
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: costs ? costs : [],
              labels: costs?.map(matric => {
                if (matric.split('.').length > 3) {
                  return matric.split('.')[3];
                }
                return t('in-forge:plugins.oTelLLM.dashboard.cost');
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
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: count ? count : [],
              labels: count?.map(matric => {
                if (matric.split('.').length > 3) {
                  return matric.split('.')[3];
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
            y1={{
              min: 0,
              formatter: millis.detailed,
              metrics: durations ? durations : [],
              labels: durations?.map(matric => {
                if (matric.split('.').length > 3) {
                  return matric.split('.')[3];
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
                    href$={getDashboardLink(snapshot.get('id'), {
                      pathname: '#/analyze;dataSource=calls',
                      to: timeConfig.to,
                      focusedMoment: timeConfig.to
                    })}
                  />
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </DashboardSection>
      </Columize>
      <CustomMetricsV2
        snapshot={snapshot}
        timeConfig={timeConfig}
        titlePrefix={t('in-forge:plugins.oTelLLM.oTelLLM')}
        specs={SPECS}
      />
    </div>
  );
}

export const SPECS = [AVAILABLE_SPECS.GAUGE, AVAILABLE_SPECS.HISTOGRAM, AVAILABLE_SPECS.SUM, AVAILABLE_SPECS.SUMMARY];

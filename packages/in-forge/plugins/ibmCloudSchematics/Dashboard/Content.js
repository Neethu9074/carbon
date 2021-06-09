/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function ibmCloudSchematicsDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmCloudSchematics.vulnerabilities')}>
          <MetricValue snapshotId={snapshotId} metric="vulnerabilities" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.ibmCloudSchematics.workspaces')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: [
              'workspaces_count',
              'workspaces_active',
              'workspaces_inactive',
              'workspaces_draft',
              'workspaces_deleted'
            ],
            labels: [
              t('in-forge:plugins.ibmCloudSchematics.count'),
              t('in-forge:plugins.ibmCloudSchematics.active'),
              t('in-forge:plugins.ibmCloudSchematics.inactive'),
              t('in-forge:plugins.ibmCloudSchematics.draft'),
              t('in-forge:plugins.ibmCloudSchematics.deleted')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmCloudSchematics.actionsApplyCount')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['actions_apply_count', 'actions_apply_success', 'actions_apply_failure'],
            labels: [
              t('in-forge:plugins.ibmCloudSchematics.count'),
              t('in-forge:plugins.ibmCloudSchematics.success'),
              t('in-forge:plugins.ibmCloudSchematics.failure')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmCloudSchematics.actionsPlanCount')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['actions_plan_count', 'actions_plan_success', 'actions_plan_failure'],
            labels: [
              t('in-forge:plugins.ibmCloudSchematics.count'),
              t('in-forge:plugins.ibmCloudSchematics.success'),
              t('in-forge:plugins.ibmCloudSchematics.failure')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmCloudSchematics.actionsDestroyCount')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['actions_destroy_count', 'actions_destroy__success', 'actions_destroy__failure'],
            labels: [
              t('in-forge:plugins.ibmCloudSchematics.count'),
              t('in-forge:plugins.ibmCloudSchematics.success'),
              t('in-forge:plugins.ibmCloudSchematics.failure')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}

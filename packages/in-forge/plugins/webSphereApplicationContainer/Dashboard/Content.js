/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces, millis } from 'in-services/formatters/number';
import DatasourcesTable from './DatasourcesTable';
import WebModulesTable from './WebModulesTable';
import EJBModulesTable from './EJBModulesTable';
import J2CModulesTable from './J2CModulesTable';
import ObjectPoolsTable from './ObjectPoolsTable';
import { t } from 'in-i18n';

export default function WebSphereDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.webSphereAppContainer.titleWebContainerThreadPool')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: [
              'threadPools.webContainer.activeThreads',
              'threadPools.webContainer.poolSize',
              'threadPools.webContainer.concurrentlyHungThreads',
              'threadPools.webContainer.declaredThreadHung'
            ],
            labels: [
              t('in-forge:plugins.webSphereAppContainer.labelActiveThreads'),
              t('in-forge:plugins.webSphereAppContainer.labelPoolSize'),
              t('in-forge:plugins.webSphereAppContainer.labelConcurrentlyHungThreads'),
              t('in-forge:plugins.webSphereAppContainer.labelDeclaredThreadHung')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <WebModulesTable snapshot={snapshot} timeConfig={timeConfig} />
      <DatasourcesTable snapshot={snapshot} timeConfig={timeConfig} />
      <EJBModulesTable snapshot={snapshot} timeConfig={timeConfig} />
      <ObjectPoolsTable snapshot={snapshot} timeConfig={timeConfig} />
      <J2CModulesTable snapshot={snapshot} timeConfig={timeConfig} />
      <DashboardSection title={t('in-forge:plugins.webSphereAppContainer.titleTransactionsModule')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: [
              'transactions.activeCount',
              'transactions.committedCount',
              'transactions.rolledbackCount',
              'transactions.globalTimeoutCount'
            ],
            labels: [
              t('in-forge:plugins.webSphereAppContainer.titleTransactionActiveCount'),
              t('in-forge:plugins.webSphereAppContainer.titleTransactionCommittedCount'),
              t('in-forge:plugins.webSphereAppContainer.titleTransactionRolledbackCount'),
              t('in-forge:plugins.webSphereAppContainer.titleTransactionGlobalTimeoutCount')
            ],
            type: 'line'
          }}
          y2={{
            formatter: millis.compact,
            metrics: ['transactions.globalTranTime'],
            labels: [t('in-forge:plugins.webSphereAppContainer.titleTransactionGlobalTranTime')],
            type: 'line'
          }}		  
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { zeroDecimalPlaces, millis, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import CertificatesTable from './CertificatesTable';
import DatasourcesTable from './DatasourcesTable';
import ObjectPoolsTable from './ObjectPoolsTable';
import ThreadPoolsTable from './ThreadPoolsTable';
import WebModulesTable from './WebModulesTable';
import EJBModulesTable from './EJBModulesTable';
import J2CModulesTable from './J2CModulesTable';
import { t } from 'in-i18n';

export default function WebSphereDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <ThreadPoolsTable snapshot={snapshot} timeConfig={timeConfig} />
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
      <DashboardSection title={t('in-forge:plugins.webSphereAppContainer.titleSIB')}>
        <Columize>
          <DashboardSection title={t('in-forge:plugins.webSphereAppContainer.titleSIBMsgFromMsgEng')}>
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesZeroDecimalPlaces,
                metrics: [
                  'sib.msgEngReadBytes',
                  'sib.msgEngWriteBytes'
                ],
                labels: [
                  t('in-forge:plugins.webSphereAppContainer.titleSIBMsgRead'),
                  t('in-forge:plugins.webSphereAppContainer.titleSIBMsgWrite')
                ],
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-forge:plugins.webSphereAppContainer.titleSIBMsgFromCli')}>
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesZeroDecimalPlaces,
                metrics: [
                  'sib.cliMsgReadBytes',
                  'sib.cliMsgWriteBytes'
                ],
                labels: [
                  t('in-forge:plugins.webSphereAppContainer.titleSIBMsgRead'),
                  t('in-forge:plugins.webSphereAppContainer.titleSIBMsgWrite')
                ],
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
        <DashboardSection title={t('in-forge:plugins.webSphereAppContainer.titleSIBQueueProduced')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: snapshot.getIn(['data', 'sib.queueNames'], emptyList)
                              .toArray()
                              .map((queue) => 'sib.queues.' + queue + '.msgProduced'),
              labels: snapshot.getIn(['data', 'sib.queueNames'], emptyList).toArray(),
              type: 'line'
            }}
          />
          </DashboardSection>
          <DashboardSection title={t('in-forge:plugins.webSphereAppContainer.titleSIBQueueConsumed')}>
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                formatter: zeroDecimalPlaces,
                metrics: snapshot.getIn(['data', 'sib.queueNames'], emptyList)
                                .toArray()
                                .map((queue) => 'sib.queues.' + queue + '.msgConsumed'),
                labels: snapshot.getIn(['data', 'sib.queueNames'], emptyList).toArray(),
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>
      </DashboardSection>
      <CertificatesTable snapshot={snapshot}/>
    </div>
  );
}

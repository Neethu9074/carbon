/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { number, percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { t } from 'in-i18n';

export default function AliCloudOssBucketDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.aliCloudOssBucket.availability')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              type: 'line',
              metrics: ['Availability', 'RequestValidRate'],
              labels: [
                t('in-forge:plugins.aliCloudOssBucket.availability'),
                t('in-forge:plugins.aliCloudOssBucket.requestValidRate')
              ],
              formatter: percentagePlainTwoDecimalPlaces
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.aliCloudOssBucket.requestCount')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              type: 'line',
              metrics: ['ValidRequestCount', 'TotalRequestCount'],
              labels: [
                t('in-forge:plugins.aliCloudOssBucket.validRequestCount'),
                t('in-forge:plugins.aliCloudOssBucket.totalRequestCount')
              ],
              formatter: number.compact
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.aliCloudOssBucket.successRequest')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              type: 'line',
              metrics: ['SuccessCount', 'SuccessRate'],
              labels: [
                t('in-forge:plugins.aliCloudOssBucket.successCount'),
                t('in-forge:plugins.aliCloudOssBucket.successRate')
              ],
              formatter: number.compact
            }}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title={t('in-forge:plugins.aliCloudOssBucket.inOut')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['InternetRecv', 'IntranetRecv', 'CdnRecv', 'SyncRecv'],
            labels: [
              t('in-forge:plugins.aliCloudOssBucket.internetRecv'),
              t('in-forge:plugins.aliCloudOssBucket.intranetRecv'),
              t('in-forge:plugins.aliCloudOssBucket.cdnRecv'),
              t('in-forge:plugins.aliCloudOssBucket.syncRecv')
            ],
            type: 'line',
            formatter: number
          }}
          y2={{
            metrics: ['InternetSend', 'IntranetSend', 'CdnSend', 'SyncSend'],
            labels: [
              t('in-forge:plugins.aliCloudOssBucket.internetSend'),
              t('in-forge:plugins.aliCloudOssBucket.intranetSend'),
              t('in-forge:plugins.aliCloudOssBucket.cdnSend'),
              t('in-forge:plugins.aliCloudOssBucket.syncSend')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.aliCloudOssBucket.metering')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'MeteringGetRequest',
              'MeteringInternetRX',
              'MeteringIntranetRX',
              'MeteringCdnRX',
              'MeteringSyncRX'
            ],
            labels: [
              t('in-forge:plugins.aliCloudOssBucket.getObject'),
              t('in-forge:plugins.aliCloudOssBucket.internetRecv'),
              t('in-forge:plugins.aliCloudOssBucket.intranetRecv'),
              t('in-forge:plugins.aliCloudOssBucket.cdnRecv'),
              t('in-forge:plugins.aliCloudOssBucket.syncRecv')
            ],
            type: 'line',
            formatter: number
          }}
          y2={{
            metrics: [
              'MeteringPutRequest',
              'MeteringInternetTX',
              'MeteringIntranetTX',
              'MeteringCdnTX',
              'MeteringSyncTX'
            ],
            labels: [
              t('in-forge:plugins.aliCloudOssBucket.putObject'),
              t('in-forge:plugins.aliCloudOssBucket.internetSend'),
              t('in-forge:plugins.aliCloudOssBucket.intranetSend'),
              t('in-forge:plugins.aliCloudOssBucket.cdnSend'),
              t('in-forge:plugins.aliCloudOssBucket.syncSend')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aliCloudOssBucket.objectOperation')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'AppendObjectCount',
              'DeleteObjectCount',
              'DeleteObjectsCount',
              'GetObjectCount',
              'HeadObjectCount',
              'PostObjectCount',
              'PutObjectCount',
              'UploadPartCount',
              'UploadPartCopyCount'
            ],
            labels: [
              t('in-forge:plugins.aliCloudOssBucket.appendObject'),
              t('in-forge:plugins.aliCloudOssBucket.deleteObject'),
              t('in-forge:plugins.aliCloudOssBucket.deleteObjects'),
              t('in-forge:plugins.aliCloudOssBucket.getObject'),
              t('in-forge:plugins.aliCloudOssBucket.headObject'),
              t('in-forge:plugins.aliCloudOssBucket.postObject'),
              t('in-forge:plugins.aliCloudOssBucket.putObject'),
              t('in-forge:plugins.aliCloudOssBucket.uploadPart'),
              t('in-forge:plugins.aliCloudOssBucket.uploadPartCopy')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.aliCloudOssBucket.averageE2Latency')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: [
                'AppendObjectE2eLatency',
                'CopyObjectE2eLatency',
                'GetObjectE2eLatency',
                'HeadObjectE2eLatency',
                'PostObjectE2eLatency',
                'PutObjectE2eLatency',
                'UploadPartCopyE2eLatency'
              ],
              labels: [
                t('in-forge:plugins.aliCloudOssBucket.appendObject'),
                t('in-forge:plugins.aliCloudOssBucket.copyObject'),
                t('in-forge:plugins.aliCloudOssBucket.getObject'),
                t('in-forge:plugins.aliCloudOssBucket.headObject'),
                t('in-forge:plugins.aliCloudOssBucket.postObject'),
                t('in-forge:plugins.aliCloudOssBucket.putObject'),
                t('in-forge:plugins.aliCloudOssBucket.uploadPartCopy')
              ],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.aliCloudOssBucket.averageServerLatency')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: [
                'AppendObjectServerLatency',
                'CopyObjectServerLatency',
                'GetObjectServerLatency',
                'HeadObjectServerLatency',
                'PostObjectServerLatency',
                'PutObjectServerLatency',
                'UploadPartServerLatency',
                'UploadPartCopyServerLatency'
              ],
              labels: [
                t('in-forge:plugins.aliCloudOssBucket.appendObject'),
                t('in-forge:plugins.aliCloudOssBucket.copyObject'),
                t('in-forge:plugins.aliCloudOssBucket.getObject'),
                t('in-forge:plugins.aliCloudOssBucket.headObject'),
                t('in-forge:plugins.aliCloudOssBucket.postObject'),
                t('in-forge:plugins.aliCloudOssBucket.putObject'),
                t('in-forge:plugins.aliCloudOssBucket.uploadPart'),
                t('in-forge:plugins.aliCloudOssBucket.uploadPartCopy')
              ],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.aliCloudOssBucket.maxE2Latency')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: [
                'MaxAppendObjectE2eLatency',
                'MaxCopyObjectE2eLatency',
                'MaxGetObjectE2eLatency',
                'MaxHeadObjectE2eLatency',
                'MaxPostObjectE2eLatency',
                'MaxPutObjectE2eLatency',
                'MaxUploadPartE2eLatency',
                'MaxUploadPartCopyE2eLatency'
              ],
              labels: [
                t('in-forge:plugins.aliCloudOssBucket.appendObject'),
                t('in-forge:plugins.aliCloudOssBucket.copyObject'),
                t('in-forge:plugins.aliCloudOssBucket.getObject'),
                t('in-forge:plugins.aliCloudOssBucket.headObject'),
                t('in-forge:plugins.aliCloudOssBucket.postObject'),
                t('in-forge:plugins.aliCloudOssBucket.putObject'),
                t('in-forge:plugins.aliCloudOssBucket.uploadPart'),
                t('in-forge:plugins.aliCloudOssBucket.uploadPartCopy')
              ],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.aliCloudOssBucket.maxServerLatency')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: [
                'MaxAppendObjectServerLatency',
                'MaxCopyObjectServerLatency',
                'MaxGetObjectServerLatency',
                'MaxHeadObjectServerLatency',
                'MaxPostObjectServerLatency',
                'MaxPutObjectServerLatency',
                'MaxUploadPartCopyServerLatency',
                'MaxUploadPartServerLatency'
              ],
              labels: [
                t('in-forge:plugins.aliCloudOssBucket.appendObject'),
                t('in-forge:plugins.aliCloudOssBucket.copyObject'),
                t('in-forge:plugins.aliCloudOssBucket.getObject'),
                t('in-forge:plugins.aliCloudOssBucket.headObject'),
                t('in-forge:plugins.aliCloudOssBucket.postObject'),
                t('in-forge:plugins.aliCloudOssBucket.putObject'),
                t('in-forge:plugins.aliCloudOssBucket.uploadPartCopy'),
                t('in-forge:plugins.aliCloudOssBucket.uploadPart')
              ],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.aliCloudOssBucket.errorCount')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: [
                'AuthorizationErrorCount',
                'ClientOtherErrorCount',
                'ClientTimeoutErrorCount',
                'NetworkErrorCount',
                'ResourceNotFoundErrorCount',
                'ServerErrorCount'
              ],
              labels: [
                t('in-forge:plugins.aliCloudOssBucket.authorization'),
                t('in-forge:plugins.aliCloudOssBucket.clientOther'),
                t('in-forge:plugins.aliCloudOssBucket.clientTimeout'),
                t('in-forge:plugins.aliCloudOssBucket.network'),
                t('in-forge:plugins.aliCloudOssBucket.resourceNotFound'),
                t('in-forge:plugins.aliCloudOssBucket.server')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.aliCloudOssBucket.errorRate')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: [
                'AuthorizationErrorRate',
                'ClientOtherErrorRate',
                'ClientTimeoutErrorRate',
                'NetworkErrorRate',
                'ResourceNotFoundErrorRate',
                'ServerErrorRate'
              ],
              labels: [
                t('in-forge:plugins.aliCloudOssBucket.authorization'),
                t('in-forge:plugins.aliCloudOssBucket.clientOther'),
                t('in-forge:plugins.aliCloudOssBucket.clientTimeout'),
                t('in-forge:plugins.aliCloudOssBucket.network'),
                t('in-forge:plugins.aliCloudOssBucket.resourceNotFound'),
                t('in-forge:plugins.aliCloudOssBucket.server')
              ],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}

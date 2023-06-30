/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

//@ts-expect-error needs TS migration
import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
//@ts-expect-error needs TS migration
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { compareIgnoreCase } from 'in-services/util/string';
import { number } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';

interface Metric {
  dropwizard: Map<'id' | string, unknown>;
  host: Map<'label' | string, string>;
}
const OTLPAcceptor = () => {
  const { headerString } = {
    headerString: t('in-internal:components.landing.otlpAcceptor')
  };
  const timeConfig = useTimeConfig();
  const metrics = useObservable<Metric[], unknown[]>(
    getDropwizardWithContext('entity.jvm.app.name:"otlp-acceptor"'),
    []
  );

  if (!metrics || metrics?.length === 0) {
    return <LoadingIndicator />;
  }

  const rows = metrics.slice().sort((a, b) => compareIgnoreCase(a.host.get('label')!, b.host.get('label')!));

  const labels = rows.map(r => r.host.get('label')!.replace('.instana.io', '').replace('ip-', ''));

  const snapshotIds = rows.map(r => r.dropwizard.get('id') as string);

  const chartMetrics = [
    {
      metricId:
        'metrics.meters.com.instana.opentelemetry.producer.logs.ExportLogsServiceRequestConverter.logs.no-steadyId-found',
      title: t('in-internal:monitoringUnit.otlpAcceptor.noSteadyIdFound'),
      formatter: number.perSecond.compact
    },
    {
      metricId:
        'metrics.meters.com.instana.opentelemetry.producer.logs.ExportLogsServiceRequestConverter.logs.steadyId-found',
      title: t('in-internal:monitoringUnit.otlpAcceptor.steadyIdFound'),
      formatter: number.perSecond.compact
    },
    {
      metricId:
        'metrics.meters.com.instana.opentelemetry.producer.logs.ExportLogsServiceRequestConverter.logs.logRecord-read-successful',
      title: t('in-internal:monitoringUnit.otlpAcceptor.successfulLogRecordRead'),
      formatter: number.perSecond.compact
    },
    {
      metricId:
        'metrics.meters.com.instana.opentelemetry.producer.logs.ExportLogsServiceRequestConverter.logs.logRecord-read-failure',
      title: t('in-internal:monitoringUnit.otlpAcceptor.logRecordReadFailure'),
      formatter: number.perSecond.compact
    }
  ];

  return (
    <div>
      <h1>{headerString}</h1>
      {chartMetrics.map(({ metricId, title, formatter }) => (
        <DashboardSection title={title || metricId}>
          <Chart
            snapshotIds={snapshotIds}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: formatter || number.perSecond.compact,
              metrics: rows.map(() => metricId),
              labels: labels,
              type: 'line'
            }}
          />
        </DashboardSection>
      ))}
    </div>
  );
};

export default OTLPAcceptor;

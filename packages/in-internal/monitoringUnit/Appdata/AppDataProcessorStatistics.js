/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, percentage, millis } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-internal:monitoringUnit.appdata.appDataProcStatistic.customer'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.container.get('label');
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.appdata.appDataProcStatistic.hostCPULoad'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return `load.1min`;
      },
      getContent: number.detailed,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.appdata.appDataProcStatistic.incomingSpanMsg'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.meters.KPI.incoming.span_messages.calls`;
      },
      getContent: number.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.appdata.appDataProcStatistic.droppSpanMsg'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.gauges.KPI.incoming.span_messages.error_rate`;
      },
      getContent: percentage.detailed,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.appdata.appDataProcStatistic.timeDiffAcceptor'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.gauges.com.instana.spanprocessing.stream.source.RawSpanMessageDeserializer.time-difference-to-acceptor`;
      },
      getContent: millis.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.appdata.appDataProcStatistic.processSpansEnrichment'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.meters.KPI.processing.spans.calls`;
      },
      getContent: number.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.appdata.appDataProcStatistic.completeTraces'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.meters.com.instana.spanprocessing.stream.buffer.ReducedSpanBuffer.complete-traces`;
      },
      getContent: number.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.appdata.appDataProcStatistic.incompleteTraces'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.meters.com.instana.spanprocessing.stream.buffer.ReducedSpanBuffer.incomplete-traces`;
      },
      getContent: number.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.appdata.appDataProcStatistic.processedSpansCallExtraction'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.meters.com.instana.spanprocessing.stream.calls.TraceWithRawCallExtractor.total-spans`;
      },
      getContent: number.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.appdata.appDataProcStatistic.downstreamSpans'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.meters.KPI.outgoing.raw_spans.calls`;
      },
      getContent: number.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.appdata.appDataProcStatistic.downstreamCalls'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.meters.KPI.outgoing.calls.calls`;
      },
      getContent: number.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.appdata.appDataProcStatistic.downstreamLogs'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.meters.KPI.outgoing.logs.calls`;
      },
      getContent: number.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  }
];

export default connectTo({
  timeConfig: timeConfig$,
  rows: getDropwizardWithContext('entity.label:appdata-processor*')
})(function AppDataProcessorStatistics({ rows }) {
  if (rows.length === 0) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      <DashboardSection title={`appdata-processors (${rows.length})`}>
        <Table cols={cols} rows={rows} maxItemsPerPage={200} />
      </DashboardSection>
    </div>
  );
});

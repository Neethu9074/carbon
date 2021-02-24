/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: t('in-internal:monitoringUnit.appdata.callExtraction.customer'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.container.get('label');
      }
    }
  },
  {
    title: 'appdata-processor',
    type: 'snapshotLink',
    typeArgs: {
      pathname: physicalDashboardPath,
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.appdata.callExtraction.totalSpansTraceRawCallExtract'),
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
    title: t('in-internal:monitoringUnit.appdata.callExtraction.intermediateSpansTraceRawCallExtract'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.meters.com.instana.spanprocessing.stream.calls.TraceWithRawCallExtractor.intermediate-spans`;
      },
      getContent: number.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.appdata.callExtraction.entrySpanMissingParentTraceCallEntrySpansMissingParent'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.meters.com.instana.spanprocessing.stream.calls.TraceWithRawCallExtractor.entry-spans-missing-parent`;
      },
      getContent: number.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.appdata.callExtraction.downstreamSpans'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.meters.kafka.writes.by_topic.raw_spans`;
      },
      getContent: number.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.appdata.callExtraction.downstreamCalls'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName(row) {
        const tenantId =
          'saas_' +
          row.container
            .get('label')
            .split('-')
            .slice(0, 2)
            .join('_');
        return `metrics.meters.kafka.writes.by_topic.${tenantId}_calls`;
      },
      getContent: number.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.appdata.callExtraction.downstreamLogs'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.meters.kafka.writes.by_topic.logs`;
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
})(function CallExtraction({ rows }) {
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

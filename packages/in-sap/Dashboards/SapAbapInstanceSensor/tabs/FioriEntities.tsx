/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { useObservable } from '@instana/hooks';

// @ts-expect-error needs TS migration
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface FioriServiceProps {
  snapshotId: string;
}
interface FioriRow {
  key: string;
  fioriDetail: Map<string, object>;
}
export default function FioriEntities({ snapshotId }: FioriServiceProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'fioriServiceCounter'), [snapshotId]);
  if (!data) {
    return null;
  }
  const fioriDetails = (data as SnapshotData).get('raw_payload', []);
  if (fioriDetails.size === 0) {
    return null;
  }
  const rows: FioriRow[] = fioriDetails
    .filter((item: Map<string, object>) => item.has('entity'))
    .toArray()
    .map((fioriDetail: Map<string, object>, idx: number) => {
      return {
        key: String(idx),
        fioriDetail
      };
    });
  const metrics = ['metrics'];
  const labels = ['entity'];
  let items = rows.map(item => {
    return {
      label: item.fioriDetail.get('entity'),
      metrics: Number(item.fioriDetail.get('count'))
    };
  });
  items.sort((a, b) => b.metrics - a.metrics);
  return (
    <TopListCardPresenter
      selectedMetricFormatter={number.compact}
      showMetricSelectorsForSingleMetrics
      header={t('in-sap:dashboards.count')}
      title={'Top Entities'}
      result={{
        progress: {
          loading: false
        },
        errors: [],
        data: {
          items: items,
          page: 1,
          pageSize: 5,
          totalHits: 3
        }
      }}
      metrics={metrics}
      labels={labels}
      selectedMetric="metrics"
      Label={Label}
      Metric={Metric}
      getMetricValueFromItem={getMetricValueFromItem}
      renderHistoricDataIndicator
      config={{ metricConfiguration: { grouping: [{ maxResults: 5 }] } }}
    />
  );
}
function Label({ item }: { item: any }) {
  return <Fragment>{item.label}</Fragment>;
}
function Metric({ formattedMetricValue }: { formattedMetricValue: any }) {
  return formattedMetricValue;
}
function getMetricValueFromItem(metricId: string, item: any) {
  return get(item, metricId);
}

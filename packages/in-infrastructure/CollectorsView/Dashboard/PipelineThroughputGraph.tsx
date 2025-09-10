/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  Column,
  Row
} from '@instana/carbon';
import { Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { getInfraGranularity, getTimeWindowBasedMetricAggregation } from 'in-stores/metric';
import { withSiMultiplyPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './CollectorDashboard.mless';

interface PipelineThroughputGraphProps {
  snapshotId: string;
  pipeline: string;
  acceptedMetricName: string;
  refusedMetricName: string;
  sentMetricName: string;
  failedMetricName: string;
}

export default function PipelineThroughputGraph({
  snapshotId,
  pipeline,
  acceptedMetricName,
  refusedMetricName,
  sentMetricName,
  failedMetricName
}: PipelineThroughputGraphProps) {
  const timeConfig = useTimeConfig();
  const defaultRollup = getInfraGranularity(timeConfig);

  function useMetricValue(metric: string, formatter = (value: any) => value) {
    const rawValue = useObservable(
      getTimeWindowBasedMetricAggregation({
        snapshotId,
        metric,
        timeWindowAggregation: 'mean',
        timeConfig: timeConfig,
        rollup: defaultRollup
      }),
      [snapshotId, timeConfig, metric]
    );

    return rawValue !== undefined ? formatter(rawValue) : rawValue;
  }

  const acceptedValue = useMetricValue(acceptedMetricName, withSiMultiplyPrefixThreeDecimalPlaces);
  const refusedValue = useMetricValue(refusedMetricName, withSiMultiplyPrefixThreeDecimalPlaces);
  const sentValue = useMetricValue(sentMetricName, withSiMultiplyPrefixThreeDecimalPlaces);
  const failedValue = useMetricValue(failedMetricName, withSiMultiplyPrefixThreeDecimalPlaces);

  return (
    <Column>
      <Row>
        <Typography variant="heading-200">
          {`${pipeline} ${t('in-infrastructure:collectorView.widgets.totals')}`}
        </Typography>
        <StructuredListWrapper className={locals.pipelineThroughputTable}>
          <StructuredListHead>
            <StructuredListRow>
              <StructuredListCell>
                <Typography variant="heading-100">{t('in-infrastructure:collectorView.widgets.accepted')} </Typography>
              </StructuredListCell>
              <StructuredListCell>{t('in-infrastructure:collectorView.receiver')}</StructuredListCell>
              <StructuredListCell>{acceptedValue ?? '-'}</StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell>
                <Typography variant="heading-100">{t('in-infrastructure:collectorView.widgets.refused')} </Typography>
              </StructuredListCell>
              <StructuredListCell>{t('in-infrastructure:collectorView.receiver')}</StructuredListCell>
              <StructuredListCell>{refusedValue ?? '-'}</StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell>
                <Typography variant="heading-100">{t('in-infrastructure:collectorView.widgets.sent')} </Typography>
              </StructuredListCell>
              <StructuredListCell>{t('in-infrastructure:collectorView.exporter')}</StructuredListCell>
              <StructuredListCell>{sentValue ?? '-'}</StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell>
                <Typography variant="heading-100">{t('in-infrastructure:collectorView.widgets.failed')} </Typography>
              </StructuredListCell>
              <StructuredListCell>{t('in-infrastructure:collectorView.exporter')}</StructuredListCell>
              <StructuredListCell>{failedValue ?? '-'}</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
        </StructuredListWrapper>
      </Row>
    </Column>
  );
}

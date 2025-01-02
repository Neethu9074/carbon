/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Config } from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { SubtraceUnifiedMetricConfiguration } from 'in-types';
import { latency } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface Props {
  config: Config<SubtraceUnifiedMetricConfiguration>;
}
export default function DurationBigCard({ config }: Props): JSX.Element {
  return <BigNumberKpiCard title={t('in-applications:labelDuration')} formatter={latency.detailed} config={config} />;
}

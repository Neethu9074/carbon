/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import KpiCard, { KpiCardProps } from 'in-components/KpiCard/KpiCard';
import { ThresholdFn } from 'in-components/Threshold/threshold';

import locals from './KpiCard.mless';

interface ThresholdKpiCardProps extends KpiCardProps {
  thresholdFn?: ThresholdFn;
}

export default function ThresholdKpiCard(props: ThresholdKpiCardProps) {
  const { thresholdFn, value } = props;

  const threshold = thresholdFn?.(value) ?? 'normal';
  const thresholdClass = threshold === 'critical' ? locals.critical : threshold === 'warning' ? locals.warning : '';

  return <KpiCard {...props} majorClass={thresholdClass} minorClass={thresholdClass} />;
}

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import KpiCard from 'in-components/KpiCard/KpiCard';

interface NoValueKpiCardProps {
  title: string;
  color?: string;
  useMaxAvailableHeight?: boolean;
}

export default function NoValueKpiCard({ title, color, useMaxAvailableHeight }: NoValueKpiCardProps) {
  return (
    <KpiCard
      title={title}
      isInModal={false}
      value={valueMissingPlaceholder}
      color={color}
      useMaxAvailableHeight={useMaxAvailableHeight}
    />
  );
}

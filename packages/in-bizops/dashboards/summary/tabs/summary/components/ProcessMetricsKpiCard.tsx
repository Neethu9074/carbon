/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import KpiCard from 'in-components/KpiCard/KpiCard';

interface ProcessKpiProps {
  title: string;
}

// This KPI Card will display process related data from the passed metric
export default function ProcessMetricKpiCard({ title }: ProcessKpiProps) {
  return (
    <KpiCard
      title={title}
      value={100} // TODO: replace with backend value
    />
  );
}

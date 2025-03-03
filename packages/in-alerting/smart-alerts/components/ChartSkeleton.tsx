/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { LoadingSkeleton } from '@instana/components';

import locals from 'in-alerting/smart-alerts/components/ChartSkeleton.mless';

export function ChartSkeleton() {
  return (
    <div className={locals.skeletonWrapper}>
      <LoadingSkeleton className={locals.legendSkeleton} />
      <LoadingSkeleton className={locals.chartSkeleton} />
    </div>
  );
}

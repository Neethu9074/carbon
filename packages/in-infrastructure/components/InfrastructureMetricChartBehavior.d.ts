/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TimeConfig } from '@instana/types';

interface Axis {
  formatter: (v: number) => string;
  metrics: string[];
  labels: string[];
  type: string;
}

interface InfrastructureMetricChartProps {
  snapshotId: string;
  timeConfig: TimeConfig;
  y1: Axis;
  y2?: Axis;
  minRollup?: number;
}

declare function InfrastructureMetricChartBehavior(props: InfrastructureMetricChartProps): JSX.Element;

export default InfrastructureMetricChartBehavior;

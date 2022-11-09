/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { TimeConfig } from '@instana/types';

interface Margins {
  left: number;
  right: number;
}

interface Axis {
  formatter: (v: number) => string;
  metrics: string[];
  labels: string[];
  type: string;
}

interface InfrastructureMetricChartProps {
  snapshotId: string;
  timeConfig: TimeConfig;
  margins: Margins;
  y1: Axis;
  y2?: Axis;
}

declare function InfrastructureMetricChartBehavior(props: InfrastructureMetricChartProps): JSX.Element;

export default InfrastructureMetricChartBehavior;

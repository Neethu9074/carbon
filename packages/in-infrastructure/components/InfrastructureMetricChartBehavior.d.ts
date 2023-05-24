/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TimeConfig } from '@instana/types';

import { AdditionChartContentProps, ContextMenuButton } from 'in-components/Chart/types';

interface Axis {
  formatter: (v: number) => string;
  metrics: string[];
  labels: string[];
  type: string;
  min?: number;
}

interface InfrastructureMetricChartProps {
  snapshotId: string;
  timeConfig: TimeConfig;
  y1: Axis;
  y2?: Axis;
  customHeight?: number;
  minRollup?: number;
  renderLegend?: boolean;
  primaryContextMenuAction?: string;
  additionalContextMenuButtons?: ContextMenuButton[];
  renderPostChartContent?: (props: AdditionChartContentProps) => React.ReactNode;
  originalTimeConfig?: TimeConfig;
}

declare function InfrastructureMetricChartBehavior(props: InfrastructureMetricChartProps): JSX.Element;

export default InfrastructureMetricChartBehavior;

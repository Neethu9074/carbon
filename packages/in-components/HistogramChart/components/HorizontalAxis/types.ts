/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Bucket } from 'in-components/HistogramChart/components/HistogramChartPresenter/types';

export interface HorizontalAxisProps {
  buckets: Bucket[];
  bucketWidth: number;
  min: number;
}
export interface TickProps {
  bucket: Bucket;
  bucketPosition: number;
  bucketWidth: number;
  min: number;
  isTickVisible?: boolean;
}

export interface GetNodeRefProps {
  node: HTMLDivElement | null;
  index: number;
}

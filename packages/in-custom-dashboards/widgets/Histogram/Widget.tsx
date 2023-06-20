/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode } from 'react';

import HistogramWidgetCard from 'in-custom-dashboards/widgets/Histogram/components/HistogramWidgetCard';
import { HistogramConfig } from './form';

export interface HistogramWidgetProps {
  title: string;
  config: HistogramConfig;
  actions: ReactNode;
  isPreview?: boolean;
  dragHandle: ReactNode;
}

export default function HistogramWidget({ title, config, actions, isPreview, dragHandle }: HistogramWidgetProps) {
  return (
    <HistogramWidgetCard
      actions={actions}
      config={config}
      dragHandle={dragHandle}
      title={title}
      useMaxAvailableHeight={!isPreview}
    />
  );
}

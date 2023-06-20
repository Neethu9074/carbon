/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode } from 'react';

import { Card } from '@instana/components';

import useResultData from 'in-custom-dashboards/widgets/Histogram/hooks/useResultData';
import HistogramChart from 'in-components/HistogramChart/HistogramChart';
import { HistogramConfig } from '../form';

import locals from './HistogramWidgetCard.mless';

export interface HistogramWidgetCardProps {
  title: string;
  useMaxAvailableHeight?: boolean;
  config: HistogramConfig;
  actions?: ReactNode;
  dragHandle?: ReactNode;
}

export default function HistogramWidgetCard({
  title,
  config,
  actions,
  dragHandle,
  useMaxAvailableHeight
}: HistogramWidgetCardProps) {
  const result = useResultData({ config });

  return (
    <Card
      title={title}
      useMaxAvailableHeight={useMaxAvailableHeight}
      rightHeaderContent={
        <>
          {dragHandle}
          {actions}
        </>
      }
    >
      <div className={locals.container}>
        <HistogramChart result={result} config={config} />
      </div>
    </Card>
  );
}

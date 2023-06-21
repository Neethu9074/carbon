/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

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

  const hasNoData = result?.data?.length === 0;
  const hasNoErrors = result?.errors.length === 0;

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
      <div
        className={classNames({
          [locals.container]: !hasNoData || !hasNoErrors
        })}
      >
        <HistogramChart result={result} config={config} />
      </div>
    </Card>
  );
}

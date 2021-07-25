/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import BigNumberKpiCard, { Config } from 'in-components/KpiCard/BigNumberKpiCard';
import { getFormatter } from 'in-stores/metric/formatters';

export interface BigNumberProps {
  title: string;
  useMaxAvailableHeight?: boolean;
  config: Config;
  actions?: ReactNode;
  dragHandle?: ReactNode;
  isPreview?: boolean;
}

export default function BigNumber({ config, title, actions, dragHandle, isPreview }: BigNumberProps) {
  return (
    <BigNumberKpiCard
      config={config}
      title={title}
      actions={actions}
      dragHandle={dragHandle}
      useMaxAvailableHeight={!isPreview}
      formatter={getFormatter(config.formatter)}
    />
  );
}

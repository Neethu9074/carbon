/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

// @ts-expect-error
import { getIconByType } from 'in-analyze/AnalyzeView/dataSources';
import { MetricDescription, MetricSource } from 'in-types';

import locals from './MetricSelectionButton.mless';

export type MetricLabelAndDescriptionData = Pick<MetricDescription, 'label' | 'description'>;

export interface MetricSelectionButtonProps {
  dataSource: string;
  metricsSource: MetricSource;
  metric?: MetricLabelAndDescriptionData;
  template?: MetricLabelAndDescriptionData;
}

const getProductAreaFromMetricSource = (metricSource: MetricSource) => {
  switch (metricSource) {
    case 'APPLICATION':
    case 'WEBSITE':
      return metricSource.toLowerCase();
    case 'MOBILE_APP':
      return 'mobileApp';
    default:
      return 'application';
  }
};

export function MetricSelectionButton({ metric, template, dataSource, metricsSource }: MetricSelectionButtonProps) {
  return (
    <span className={locals.metricSelectionButton}>
      <SvgIcon type={getIconByType(dataSource, getProductAreaFromMetricSource(metricsSource))} color={'currentColor'} />
      {(template?.label || metric?.label) && <span className={locals.label}>{template?.label || metric?.label}</span>}
      {template && template.description && <span className={locals.templateDescription}>{template?.description}</span>}
    </span>
  );
}

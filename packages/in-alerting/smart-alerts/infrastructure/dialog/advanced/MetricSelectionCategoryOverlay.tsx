/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { MetricCatalog, MetricMetadata } from '@instana/types';

// @ts-expect-error needs to be converted to typescript
import MetricSelectorOverlay from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/MetricSelectorOverlay';
import { regexMetricSelectionEnabled } from 'in-services/featureFlags';

import locals from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/MetricSelectionCategoryOverlay.mless';

export interface Props {
  metricMetadata: MetricMetadata;
  metricCatalog: MetricCatalog;
  loading: boolean;
  onMetricChange: (node: Node) => void;
  query: string;
  onQueryChange: (q: string) => void;
  close?: () => void;
  disabled: boolean;
}

export default function MetricSelectionCategoryOverlay({
  metricCatalog,
  loading,
  onMetricChange,
  query,
  onQueryChange,
  close,
  disabled
}: Props) {
  const listOverlay = (
    <MetricSelectorOverlay
      metricCatalog={metricCatalog}
      loading={loading}
      onChange={onMetricChange}
      query={query}
      onQueryChange={onQueryChange}
      close={close}
      disabled={disabled}
    />
  );
  if (!regexMetricSelectionEnabled) {
    return listOverlay;
  }

  return <div className={locals.overlay}>{listOverlay}</div>;
}

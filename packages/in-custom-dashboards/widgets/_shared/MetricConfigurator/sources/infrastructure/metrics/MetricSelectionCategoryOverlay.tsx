/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { MetricCatalog, MetricMetadata, TagFilterExpression } from '@instana/types';

import RegexMetricSelectorOverlay from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/RegexMetricSelectorOverlay';
import MetricSelectorOverlay from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/MetricSelectorOverlay';
import InlineTabNavigation from 'in-components/InlineTabNavigation/InlineTabNavigation';
import { regexMetricSelectionEnabled } from 'in-services/featureFlags';
import { MetricOptions } from 'in-components/SelectorOverlay/Node';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/MetricSelectionCategoryOverlay.mless';

export interface Props {
  metricMetadata: MetricMetadata;
  metricCatalog: MetricCatalog;
  loading: boolean;
  onMetricChange: (options: MetricOptions) => void;
  query: string;
  onQueryChange: (q: string) => void;
  isRegex: boolean;
  setIsRegex: (b: boolean) => void;
  regex: string;
  onRegexChange: (r: string) => void;
  backendQueryModel: TagFilterExpression;
  type: string;
  onTypeChange: (t: string) => void;
  onSelectType: (t?: string) => void;
  close?: VoidFunction;
  disabled: boolean;
}

const tabList = [
  {
    icon: 'lib_views_list',
    text: t('in-custom-dashboards:widgets.srcInfrastructure.metricSelectionCategoryOverlay.list'),
    key: 'list'
  },
  {
    icon: 'lib_views_code',
    text: t('in-custom-dashboards:widgets.srcInfrastructure.metricSelectionCategoryOverlay.regex'),
    key: 'regex'
  }
];
const listTabIndex = 0;
const regexTabIndex = 1;

export default function MetricSelectionCategoryOverlay({
  metricCatalog,
  loading,
  onMetricChange,
  query,
  onQueryChange,
  isRegex,
  setIsRegex,
  regex,
  onRegexChange,
  backendQueryModel,
  type,
  onTypeChange,
  onSelectType,
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
      onSelectType={onSelectType}
      close={close}
      disabled={disabled}
      backButton
    />
  );
  if (!regexMetricSelectionEnabled) {
    return listOverlay;
  }
  const regexOverlay = (
    <RegexMetricSelectorOverlay
      regex={regex}
      onRegexChange={onRegexChange}
      backendQueryModel={backendQueryModel}
      type={type}
      onTypeChange={onTypeChange}
      close={close}
    />
  );
  const activeTabIndex = isRegex ? regexTabIndex : listTabIndex;
  return (
    <div className={locals.overlay}>
      <InlineTabNavigation
        tabList={tabList}
        activeTabIndex={activeTabIndex}
        onTabSelect={tab => setIsRegex(tab === regexTabIndex)}
      />
      {isRegex ? regexOverlay : listOverlay}
    </div>
  );
}

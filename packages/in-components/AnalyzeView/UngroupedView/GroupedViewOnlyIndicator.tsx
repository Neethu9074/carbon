/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { SvgIcon } from '@instana/components';
import { t } from '@instana/i18n-react';

import Tooltip from 'in-components/Tooltip/Tooltip';
import { MetricDescription } from 'in-types';

import locals from 'in-components/AnalyzeView/UngroupedView//UngroupedView.mless';

interface GroupedViewOnlyIndicatorProps {
  metricId: string;
  metricCatalog: MetricDescription[];
  hasRawValue?: ((params: { metricDefinition: MetricDescription }) => boolean) | boolean;
}

export default function GroupedViewOnlyIndicator(props: GroupedViewOnlyIndicatorProps) {
  const { metricId, metricCatalog, hasRawValue } = props;
  const metricDefinition = metricCatalog.find(metric => metric.metricId === metricId);

  const conditionHasRawValue =
    metricDefinition && typeof hasRawValue === 'function' ? hasRawValue({ metricDefinition }) : hasRawValue;

  if (conditionHasRawValue) return null;

  return (
    <Tooltip content={t('in-components:analyze.groupedOnly')} align="bottomRight">
      <SvgIcon type="lib_help_error_help_outline" size="s" className={locals.helpIcon} />
    </Tooltip>
  );
}

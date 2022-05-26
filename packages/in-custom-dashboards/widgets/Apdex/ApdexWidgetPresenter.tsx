/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import ApdexWidget from 'in-custom-dashboards/widgets/Apdex/components/ApdexWidget';
import { ApdexWidgetConfiguration } from 'in-custom-dashboards/widgets/Apdex/form';
import { WidgetProps } from 'in-custom-dashboards/widgets/types';
import { apdexWidgetEnabled } from 'in-services/featureFlags';
import { days, minutes } from 'in-services/time/time';
import { success } from 'in-services/util/result';

export default function ApdexWidgetPresenter({
  actions,
  dragHandle,
  title,
  isPreview,
  config
}: WidgetProps<ApdexWidgetConfiguration>) {
  if (!apdexWidgetEnabled) return;

  const { entityType } = config;

  // TODO: This block must be replaced later as the backend API connection
  // is out of scope for the current task.
  const entityLabel = 'Dummy Label';
  const granularity = minutes.toMillis(1);
  const timeConfig = { windowSize: days.toMillis(7), to: 1624949300207, autoRefresh: false };
  const { errors, progress } = success(null);
  /////////////////////////////////////////////////

  return (
    <ApdexWidget
      title={title}
      actions={actions}
      dragHandle={dragHandle}
      entityLabel={entityLabel}
      entityType={entityType}
      errors={errors}
      metrics={[]}
      progress={progress}
      granularity={granularity}
      timeConfig={timeConfig}
      nonInteractive={isPreview}
    />
  );
}

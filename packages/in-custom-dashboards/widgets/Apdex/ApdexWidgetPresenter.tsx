/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import useMonitoredEntity from 'in-custom-dashboards/widgets/Slo/hooks/useMonitoredEntity';
import ApdexWidget from 'in-custom-dashboards/widgets/Apdex/components/ApdexWidget';
import { ApdexWidgetConfiguration } from 'in-custom-dashboards/widgets/Apdex/form';
import { WidgetProps } from 'in-custom-dashboards/widgets/types';
import { apdexWidgetEnabled } from 'in-services/featureFlags';
import { all as allProgress } from 'in-hooks/utils/progress';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { minutes } from 'in-services/time/time';
import { t } from 'in-i18n';

export default function ApdexWidgetPresenter({
  actions,
  dragHandle,
  title,
  isPreview,
  config
}: WidgetProps<ApdexWidgetConfiguration>) {
  const timeConfig = useTimeConfig();

  const { entityType, entityId } = config;
  const [entity, , , entityProgress] = useMonitoredEntity({ entityType, entityId });
  const entityLabel =
    entity?.label ?? t('in-custom-dashboards:widgets.apdex.widget.unknownEntityLabel', { context: entityType });

  const progress = allProgress(entityProgress);

  if (!apdexWidgetEnabled) return;

  // TODO: This block must be replaced later as the backend API connection
  // is out of scope for the current task.
  const granularity = minutes.toMillis(1);
  /////////////////////////////////////////////////

  return (
    <ApdexWidget
      title={title}
      actions={actions}
      dragHandle={dragHandle}
      entityLabel={entityLabel}
      entityType={entityType}
      errors={[]}
      metrics={[]}
      progress={progress}
      granularity={granularity}
      timeConfig={timeConfig}
      nonInteractive={isPreview}
    />
  );
}

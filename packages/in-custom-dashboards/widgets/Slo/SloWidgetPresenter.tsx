/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { LoadingSkeleton, Message } from '@instana/components';

import SloTimeWindowProvider from 'in-service-levels/components/SloDashboard/components/SloTimeWindowProvider';
// @ts-expect-error file needs migration
import { viewPath } from 'in-custom-dashboards/navigation/url';
import { createSloUrlParameter } from 'in-service-levels/navigation/urlParameters';
import { SloWidgetConfiguration } from 'in-custom-dashboards/widgets/Slo/types';
import SloWidget from 'in-custom-dashboards/widgets/Slo/components/SloWidget';
import useSloConfiguration from 'in-service-levels/hooks/useSloConfiguration';
import { WidgetProps } from 'in-custom-dashboards/widgets/types';
import { sloFullEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

import locals from './SloWidgetPresenter.mless';

export default function SloWidgetPresenterWrapper({
  actions,
  config,
  dragHandle,
  isInModal,
  isPreview,
  title,
  widgetId
}: WidgetProps<SloWidgetConfiguration>) {
  if (!sloFullEnabled) return null;

  return (
    <SloWidgetPresenter
      actions={actions}
      config={config}
      dragHandle={dragHandle}
      isInModal={isInModal}
      isPreview={isPreview}
      title={title}
      widgetId={widgetId}
    />
  );
}
function SloWidgetPresenter({
  actions,
  config,
  dragHandle,
  isInModal,
  isPreview,
  title,
  widgetId
}: Omit<WidgetProps<SloWidgetConfiguration>, 'timeConfig'>) {
  const [sloConfig, status] = useSloConfiguration(config.sloId);

  if (status === 'pending') return <LoadingSkeleton className={locals.loadingSkeleton} />;

  if (status === 'rejected' || sloConfig === undefined)
    return <Message type="error" title={t('in-custom-dashboards:widgets.slo.general.sloNotFound')} />;

  return (
    <SloTimeWindowProvider
      sloConfigId={config.sloId}
      sloTimeWindow={sloConfig.timeWindow}
      timeWindowTypeParameterDefinition={createSloUrlParameter('timeWindowType', viewPath, widgetId)}
    >
      <SloWidget
        actions={actions}
        config={config}
        dragHandle={dragHandle}
        isPreview={isPreview}
        title={title}
        sloConfig={sloConfig}
        isInModal={isInModal}
      />
    </SloTimeWindowProvider>
  );
}

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
import { t } from 'in-i18n';

import locals from './SloWidgetPresenter.mless';

export interface SloWidgetPresenterProps {
  actions: React.ReactNode;
  config: SloWidgetConfiguration;
  dragHandle: React.ReactNode;
  isInModal?: boolean;
  isPreview?: boolean;
  title: string;
  widgetId: string;
}

export default function SloWidgetPresenter({
  actions,
  config,
  dragHandle,
  isInModal,
  isPreview,
  title,
  widgetId
}: SloWidgetPresenterProps) {
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

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SloWidget } from 'in-custom-dashboards/widgets/Slo/components/SloWidget';
import { SloWidgetConfiguration } from 'in-custom-dashboards/widgets/Slo/types';

export interface SloWidgetPresenterProps {
  actions: React.ReactNode;
  config: SloWidgetConfiguration;
  dragHandle: React.ReactNode;
  isPreview?: boolean;
  isInModal?: boolean;
  title: string;
}

export default function SloWidgetPresenter({
  actions,
  config,
  dragHandle,
  isPreview,
  isInModal,
  title
}: SloWidgetPresenterProps) {
  return (
    <SloWidget
      actions={actions}
      config={config}
      dragHandle={dragHandle}
      isPreview={isPreview}
      isInModal={isInModal}
      title={title}
    />
  );
}

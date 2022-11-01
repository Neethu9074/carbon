/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm } from 'formalistic';
import { ReactNode } from 'react';
import React from 'react';

import SimpleActionConfigDialogStep1 from 'in-events/components/AutomationActions/action_associations_dialog/steps/SimpleActionConfigDialogStep1';
import SimpleActionConfigDialogStep2 from 'in-events/components/AutomationActions/action_associations_dialog/steps/SimpleActionConfigDialogStep2';
import { blueprintConfig } from 'in-events/components/AutomationActions/action_associations_dialog/steps/simpleModeBluePrints';
import { EventProps } from 'in-events/components/AutomationActions/action_associations_dialog/SharedTypes';
import { Action } from 'in-types';
import { t } from 'in-i18n';

interface SelectActionsParentProps {
  actions?: Action[];
  slideInConfig: { component?: ReactNode; title?: string };
  setCustomSlideInHeaderConfig: React.Dispatch<
    React.SetStateAction<{
      title: null;
      onClose: null;
    }>
  >;
  form: MapForm;
  setSliderState: (component: ReactNode) => void;
  setForm: React.Dispatch<React.SetStateAction<MapForm>>;
  numberOfActionChannelListRows: number;
  eventDetails: EventProps;
}

export const stepConfigs = [
  {
    title: t('in-events:step1ActionAssociationsTitle')
  },
  {
    title: t('in-events:step2ActionAssociationsTitle'),
    validateIntermediately: [['actionIds']]
  }
];
export const stepRenderers = [
  (parentProps: SelectActionsParentProps) => (
    <SimpleActionConfigDialogStep1 blueprintConfig={blueprintConfig} {...parentProps} />
  ),
  (parentProps: SelectActionsParentProps) => <SimpleActionConfigDialogStep2 {...parentProps} />
];

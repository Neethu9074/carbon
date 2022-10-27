/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { ReactNode } from 'react';
import { MapForm } from 'formalistic';

import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SelectActions from 'in-events/components/AutomationActions/action_associations_dialog/selectActions';
import { Action } from 'in-types';
import { t } from 'in-i18n';

import locals from './SimpleActionConfigDialogStep2.mless';

interface SelectActionsProps {
  actions?: Action[];
  setSliderState: (component: ReactNode) => void;
  setCustomSlideInHeaderConfig: React.Dispatch<
    React.SetStateAction<{
      title: null;
      onClose: null;
    }>
  >;
  form: MapForm;
  setForm: React.Dispatch<React.SetStateAction<MapForm>>;
  numberOfActionChannelListRows: number;
}

export default function SimpleActionConfigDialogStep2(props: SelectActionsProps) {
  return (
    <SimpleModeStepContentWrapper headline={t('in-events:actionSelectionConfigDialogStep2Headline')}>
      <div className={locals.actionContainer}>
        <SelectActions {...props} />
      </div>
    </SimpleModeStepContentWrapper>
  );
}

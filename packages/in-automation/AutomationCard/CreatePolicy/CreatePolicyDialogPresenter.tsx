/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography } from '@instana/components';

import SimpleCreatePolicyDialog from 'in-automation/AutomationCard/CreatePolicy/SimpleCreatePolicyDialog';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { SetActiveKey } from 'in-automation/AutomationCard/AutomationCard';
import { close } from 'in-components/DialogPresenter/store';
import { ScoredAction } from 'in-automation/api';
import { Event } from 'in-types';
import { t } from 'in-i18n';

import locals from './CreatePolicyDialogPresenter.mless';

export interface CreatePolicyDialogPresenterProps {
  selectedAction: ScoredAction;
  event: Event;
  setActiveKey: SetActiveKey;
}

export default function CreatePolicyDialogPresenter({
  selectedAction,
  event,
  setActiveKey
}: CreatePolicyDialogPresenterProps) {
  return (
    <DialogWithSlideInView
      title={
        <div className={locals.heading}>
          <Typography variant="heading-400">{t('in-automation:viewActionCreatePolicy')}</Typography>
        </div>
      }
      onClose={close}
      slideInViewVisible={false}
      titleIconType="lib_openclose_add_circle_outline"
      doNotCloseOnOutsideClick
    >
      <div className={locals.simpleDialog}>
        <SimpleCreatePolicyDialog selectedAction={selectedAction} event={event} setActiveKey={setActiveKey} />
      </div>
    </DialogWithSlideInView>
  );
}

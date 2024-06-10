/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Typography, SvgIcon } from '@instana/components';

import SimpleAIDialog from 'in-automation/AutomationCard/GenerateAIDialog/SimpleAIDialog';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { SetActiveKey } from 'in-automation/AutomationCard/AutomationCard';
import { close } from 'in-components/DialogPresenter/store';
import { ScoredAction } from 'in-automation/api';
import { Event, Result } from 'in-types';
import { t } from 'in-i18n';

import locals from './SelectAIActionsDialogPresenter.mless';

export interface SelectProps {
  aiRecommendedScoredActions: Result<ScoredAction[]>;
  event: Event;
  setActiveKey: SetActiveKey;
}

const SelectAIActionsDialogPresenter = ({ aiRecommendedScoredActions, event, setActiveKey }: SelectProps) => {
  const [selectedAIAction, setSelectedAIAction] = useState<null | ScoredAction>(null);

  return (
    <DialogWithSlideInView
      title={
        <div className={locals.heading}>
          <Typography variant="heading-400">{t('in-automation:generateWithAI')}</Typography>
          <SvgIcon type="lib_ai_slug" />
        </div>
      }
      onClose={close}
      slideInViewVisible={false}
      doNotCloseOnOutsideClick
    >
      <div className={locals.simpleDialog}>
        <SimpleAIDialog
          aiRecommendedScoredActions={aiRecommendedScoredActions}
          event={event}
          setActiveKey={setActiveKey}
          selectedAIAction={selectedAIAction}
          setSelectedAIAction={setSelectedAIAction}
        />
      </div>
    </DialogWithSlideInView>
  );
};

export default SelectAIActionsDialogPresenter;

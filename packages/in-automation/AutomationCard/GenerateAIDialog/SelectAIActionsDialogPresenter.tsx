/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Typography } from '@instana/components';

import SimpleAIDialog from 'in-automation/AutomationCard/GenerateAIDialog/SimpleAIDialog';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { SetActiveKey } from 'in-automation/AutomationCard/AutomationCard';
import AISlugIcon from 'in-automation/components/AISlugIcon';
import { close } from 'in-components/DialogPresenter/store';
import { ScoredAction } from 'in-automation/api';
import { Event, Result } from 'in-types';
import { t } from 'in-i18n';

import locals from './SelectAIActionsDialogPresenter.mless';

export interface selectProps {
  aiRecommendedScoredActions: Result<ScoredAction[]>;
  event: Event;
  setActiveKey: SetActiveKey;
}

const SelectAIActionsDialogPresenter = ({ aiRecommendedScoredActions, event, setActiveKey }: selectProps) => {
  const [selectedAIAction, setSelectedAIAction] = useState<null | ScoredAction>(null);

  return (
    <DialogWithSlideInView
      title={
        <div className={locals.heading}>
          <Typography variant="heading-400">{t('in-automation:generateWithAI')}</Typography>
          <AISlugIcon />
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

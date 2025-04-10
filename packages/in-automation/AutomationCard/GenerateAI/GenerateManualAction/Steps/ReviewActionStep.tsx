/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { ButtonGroup, Spacer, Stack } from '@instana/components';
import { Event, Result } from '@instana/types';

import { GenerateAIActionForm } from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/useGenerateAIActionForm';
import SelectActionStep from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/Steps/SelectActionStep';
import PromptStep from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/Steps/PromptStep';
import { getTriggerTypeFromEvent } from 'in-automation/AutomationCard/shared';
import { actionAiGenerationEnabled } from 'in-services/featureFlags';
import { ScoredAction } from 'in-automation/types';
import { t } from 'in-i18n';

type ButtonKey = 'builtinActions' | 'generate';

export default function ReviewActionStep({
  form,
  setForm,
  actions,
  event
}: {
  form: GenerateAIActionForm;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIActionForm>>;
  event: Event;
  actions: Result<ScoredAction[]>;
}) {
  const showOotbActions = getTriggerTypeFromEvent(event) === 'builtinEvent' && (actions.data?.length ?? 0) > 0;
  const [activeKey, setActiveKey] = useState<ButtonKey>('generate');
  const buttonPropsList = [
    {
      text: t('in-automation:GenerateAIActionDialog.liveGeneration'),
      key: 'generate',
      onClick: () => setActiveKey('generate')
    },
    {
      text: t('in-automation:GenerateAIActionDialog.builtinActions', { count: actions.data?.length }),
      key: 'builtinActions',
      onClick: () => setActiveKey('builtinActions')
    }
  ];
  if (!actionAiGenerationEnabled && !showOotbActions!) return null;
  if (actionAiGenerationEnabled) {
    // this flag is true for all saas regions and false for self hosted
    return (
      <Stack>
        {showOotbActions && (
          <>
            <Spacer size="normal" />
            <ButtonGroup buttonPropsList={buttonPropsList} activeKey={activeKey} segmented />
          </>
        )}
        {activeKey === 'builtinActions' && <SelectActionStep actions={actions} setForm={setForm} />}
        {activeKey === 'generate' && <PromptStep form={form} setForm={setForm} event={event} />}
      </Stack>
    );
  } else {
    //for self hosted envs , if it has OOTB actions, we should show.
    return <Stack>{showOotbActions && <SelectActionStep actions={actions} setForm={setForm} />}</Stack>;
  }
}

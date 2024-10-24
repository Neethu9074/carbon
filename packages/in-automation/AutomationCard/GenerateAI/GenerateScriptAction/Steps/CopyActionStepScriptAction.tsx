/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography, Spacer } from '@instana/components';
import { Result } from '@instana/types';

import { GenerateAIScriptActionForm } from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/useGenerateAIScriptActionForm';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import CopyActionStepForm from 'in-automation/AutomationCard/GenerateAI/CopyActionStepForm';
import { t } from 'in-i18n';

export default function CopyActionStep({
  form,
  setForm,
  result
}: {
  form: GenerateAIScriptActionForm;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIScriptActionForm>>;
  result: Result<any> | null;
}) {
  const actionForm = form.get('action');

  return (
    <div>
      <ErroneousResultPresenter errors={result?.errors} />
      <Spacer vertical="normal" />
      <Typography variant="body-regular">{t('in-automation:GenerateAIActionDialog.Step2Headline')}</Typography>
      <CopyActionStepForm
        form={actionForm}
        setForm={actionForm => setForm(form => form.updateIn(['action'], actionForm))}
      />
    </div>
  );
}

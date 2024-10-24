/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography, Spacer } from '@instana/components';

import { GenerateAIActionForm } from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/useGenerateAIActionForm';
import CopyActionStepForm, { ActionForm } from 'in-automation/AutomationCard/GenerateAI/CopyActionStepForm';
import { t } from 'in-i18n';

export default function CopyActionStep({
  form,
  setForm,
  actionNameExists,
  clearActionNameExists
}: {
  form: GenerateAIActionForm;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIActionForm>>;
  actionNameExists: null | boolean;
  clearActionNameExists: () => void;
}) {
  const actionForm: ActionForm = form.get('action');

  return (
    <div>
      <Spacer vertical="normal" />
      <Typography variant="body-regular">{t('in-automation:GenerateAIActionDialog.Step2Headline')}</Typography>
      <CopyActionStepForm
        form={actionForm}
        setForm={actionForm => setForm(form => form.updateIn(['action'], actionForm))}
        actionNameExists={actionNameExists}
        clearActionNameExists={clearActionNameExists}
      />
    </div>
  );
}

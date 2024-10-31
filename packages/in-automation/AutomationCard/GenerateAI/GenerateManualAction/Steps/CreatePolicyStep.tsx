/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Spacer, Typography } from '@instana/components';
import { Result } from '@instana/types';

import { GenerateAIActionForm } from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/useGenerateAIActionForm';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import PolicyFormBody from 'in-automation/AutomationCard/PolicyFormBody';
import { NewAction, TriggerSpecification } from 'in-automation/types';
import { t } from 'in-i18n';

export default function CreatePolicyStep({
  form,
  setForm,
  action,
  trigger,
  result
}: {
  form: GenerateAIActionForm;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIActionForm>>;
  action: NewAction;
  trigger: Result<TriggerSpecification>;
  result: Result<any> | null;
}) {
  const policyForm = form.get('policy');

  return (
    <>
      <ErroneousResultPresenter errors={result?.errors} />
      <Spacer vertical="normal" />
      <Typography variant="body-regular">{t('in-automation:GenerateAIActionDialog.Step3Headline')}</Typography>
      <PolicyFormBody
        setForm={policyForm => setForm(form => form.updateIn(['policy'], policyForm))}
        form={policyForm}
        trigger={trigger}
        action={action}
      />
    </>
  );
}

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Spacer, Typography } from '@instana/components';
import { Action, Result, Event } from '@instana/types';

import { PolicyForm } from 'in-automation/AutomationCard/CreatePolicyDialog/usePolicyForm';
import PolicyFormBody from 'in-automation/AutomationCard/PolicyFormBody';
import { TriggerSpecification } from 'in-automation/types';
import { t } from 'in-i18n';

export default function CreatePolicyStep({
  form,
  setForm,
  action,
  trigger,
  event
}: {
  form: PolicyForm;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm>>;
  trigger: Result<TriggerSpecification>;
  action: Action;
  event: Event;
}) {
  return (
    <>
      <Spacer vertical="normal" />
      <Typography variant="body-regular">{t('in-automation:CreatePolicyDialog.Step2Headline')}</Typography>
      <PolicyFormBody setForm={setForm} form={form} trigger={trigger} action={action} event={event} />
    </>
  );
}

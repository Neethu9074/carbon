/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography, Spacer } from '@instana/components';

import { AIActionForm } from 'in-automation/AutomationCard/GenerateAIDialog/SimpleAIDialog';
import { PolicyFormBody } from 'in-automation/AutomationCard/CreatePolicy/CreatePolicyStep';
import Notification from 'in-components/form/Notification';
import Section from 'in-settings/components/Section';
import { Event } from 'in-types';
import { t } from 'in-i18n';

import locals from './SelectAIActionsDialogPresenter.mless';

export function CreatePolicyStep({
  form,
  updateForm,
  actionError,
  event
}: {
  form: AIActionForm;
  updateForm: React.Dispatch<React.SetStateAction<AIActionForm>>;
  actionError?: string;
  event: Event;
}) {
  const name = form.get('policyName');
  const description = form.get('policyDescription');
  const actionName = form.get('name').value;
  const eventTriggerName = event.problem?.problemText ?? '';
  const policyTags = form.get('policyTags');

  return (
    <div>
      <div className={locals.actionModalPadding}>
        <Spacer vertical="normal" />
        <Typography variant="body-regular">{t('in-automation:simpleAIDialog.Step3Headline')}</Typography>
        <Spacer vertical="normal" />
        {actionError && actionError !== '' && (
          <>
            <Section>
              <Notification failure>{actionError}</Notification>
            </Section>
          </>
        )}

        <PolicyFormBody
          updateForm={updateForm}
          name={name}
          description={description}
          actionName={actionName}
          eventTriggerName={eventTriggerName}
          policyTags={policyTags}
        />
      </div>
    </div>
  );
}

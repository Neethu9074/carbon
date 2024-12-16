/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Card, Spacer } from '@instana/components';
import { t } from '@instana/i18n-react';

import FormFooter, { CancelButton, DeleteButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { SubtraceConfigForm } from 'in-applications/Forms/SubtraceConfiguration/SubtraceConfigForm';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { SubtraceTabData } from 'in-applications/Dashboards/subtrace/tabs';
import { SubtraceFormFields, SubtraceConfig } from 'in-applications/types';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { useSubtraceForm } from 'in-applications/hooks/useSubtraceForm';
import { Subtrace } from 'in-applications/lists/SubtracesList';
import { updateSubtrace } from 'in-applications/api/subtraces';
import useFormSubmission from 'in-hooks/useFormSubmission';
import { Nullish } from 'in-types';

import locals from 'in-applications/Dashboards/subtrace/tabs/SubtraceConfiguration.mless';

interface SubtraceConfigurationWrapperProps {
  data: SubtraceTabData | Nullish;
}

interface SubtraceConfigurationProps {
  subtraceTabData: SubtraceTabData;
}

export function SubtraceConfiguration({ data: subtrace }: SubtraceConfigurationWrapperProps) {
  if (!subtrace?.id) {
    return null;
  }
  return <SubtraceConfigurationContent subtraceTabData={subtrace} />;
}

function SubtraceConfigurationContent({ subtraceTabData }: SubtraceConfigurationProps) {
  const subtrace = subtraceTabData as Subtrace;
  const [formSubmitStatus, doSubmit] = useFormSubmission(updateSubtrace);
  const { form, isFormValid, updateForm, resetForm } = useSubtraceForm(subtrace);

  const disabled = !form.hierarchyTouched || formSubmitStatus === 'pending';

  const onHandleSubmit = () => {
    const payload = normalizeFormData(form, subtrace.id);
    const subtraceName = form.get('name').value;
    doSubmit({
      payload,
      onSuccess: () => onSaveSuccess(subtraceName),
      onError: () => onSaveFailure(subtraceName)
    });
  };

  return (
    <Card title={t('in-applications:subtraces.configuration.title')}>
      <SubtraceConfigForm form={form} updateForm={updateForm} />
      <Spacer vertical="normal" />
      <FormFooter withoutCarbonLayer className={locals.formFooter}>
        <DeleteButton
          onClick={() => {
            // TODO: implement delete with redirection to ???
          }}
          form={form}
          isDeleting={false}
          icon="lib_actions_delete"
        />
        <div>
          <CancelButton onClick={() => resetForm()} disabled={disabled} />
          <SaveButton
            form={form}
            isSaving={formSubmitStatus === 'pending'}
            disabled={!isFormValid || disabled}
            onClick={onHandleSubmit}
          />
        </div>
      </FormFooter>
    </Card>
  );
}

function onSaveSuccess(subtraceName: string) {
  addMessage(
    {
      type: 'info',
      timeout: 4000,
      title: t('in-applications:subtraces.configuration.success.title'),
      content: t('in-applications:subtraces.configuration.success.message', { subtraceName, action: 'updated' })
    },
    'save-subtrace-success'
  );
}

function onSaveFailure(subtraceName: string) {
  addMessage(
    {
      type: 'danger',
      timeout: 4000,
      title: t('in-applications:subtraces.configuration.failure.title'),
      content: t('in-applications:subtraces.configuration.failure.message', { subtraceName, action: 'update' })
    },
    'save-subtrace-failure'
  );
}

function normalizeFormData(form: MapForm<SubtraceFormFields>, subtraceId: string): SubtraceConfig {
  const subtrace = form.toJS();
  const normalizedSubtrace: SubtraceConfig = {
    ...subtrace,
    id: subtraceId,
    tagFilterExpression: toBackendQueryModel(subtrace.tagFilterExpression)
  };

  return normalizedSubtrace;
}

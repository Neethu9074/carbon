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
import { deleteSubtrace, updateSubtrace } from 'in-applications/api/subtraces';
import { SubtraceTabData } from 'in-applications/Dashboards/subtrace/tabs';
import { SubtraceFormFields, SubtraceConfig } from 'in-applications/types';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useSubtraceForm } from 'in-applications/hooks/useSubtraceForm';
import { subtracesList } from 'in-applications/navigation/paths';
import { Subtrace } from 'in-applications/lists/SubtracesList';
import useFormSubmission from 'in-hooks/useFormSubmission';
import { role } from 'in-stores/user';
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

  const { goToPath } = useNavigation();
  const [updateStatus, doUpdate] = useFormSubmission(updateSubtrace);
  const [deleteStatus, doDelete] = useFormSubmission(deleteSubtrace);
  const { form, isFormValid, updateForm, resetForm } = useSubtraceForm(subtrace);

  const disabled = !form.hierarchyTouched || updateStatus === 'pending' || deleteStatus === 'pending';

  const onHandleSubmit = () => {
    const payload = normalizeFormData(form, subtrace.id);
    const subtraceName = form.get('name').value;
    doUpdate({
      payload,
      onSuccess: () =>
        addSuccessMessage(
          t('in-applications:subtraces.configuration.success.updated.title'),
          t('in-applications:subtraces.configuration.success.updated.message', { subtraceName })
        ),
      onError: () =>
        addErrorMessage(
          t('in-applications:subtraces.configuration.failure.updated.title'),
          t('in-applications:subtraces.configuration.failure.updated.message', { subtraceName })
        )
    });
  };

  const onHandleDelete = () => {
    const payload = subtrace.id;
    const subtraceName = subtrace.name;
    doDelete({
      payload,
      onSuccess: () => {
        goToPath(subtracesList);
        addSuccessMessage(
          t('in-applications:subtraces.configuration.success.deleted.title'),
          t('in-applications:subtraces.configuration.success.deleted.message', { subtraceName })
        );
      },
      onError: () =>
        addErrorMessage(
          t('in-applications:subtraces.configuration.failure.deleted.title'),
          t('in-applications:subtraces.configuration.failure.deleted.message', { subtraceName })
        )
    });
  };

  return (
    <Card title={t('in-applications:subtraces.configuration.title')}>
      <SubtraceConfigForm form={form} updateForm={updateForm} />
      <Spacer vertical="normal" />
      <FormFooter withoutCarbonLayer className={locals.formFooter}>
        <DeleteButton
          onClick={() => onHandleDelete()}
          form={form}
          disabled={!role?.canConfigureSubtraces}
          isDeleting={deleteStatus === 'pending'}
          icon="lib_actions_delete"
        />
        <div>
          <CancelButton onClick={() => resetForm()} disabled={disabled} />
          <SaveButton
            form={form}
            isSaving={updateStatus === 'pending'}
            disabled={!isFormValid || disabled}
            onClick={() => onHandleSubmit()}
          />
        </div>
      </FormFooter>
    </Card>
  );
}

function addSuccessMessage(title: string, content: string) {
  addMessage(
    {
      type: 'info',
      timeout: 4000,
      title,
      content
    },
    'subtrace-success'
  );
}

function addErrorMessage(title: string, content: string) {
  addMessage(
    {
      type: 'danger',
      timeout: 4000,
      title,
      content
    },
    'subtrace-failure'
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

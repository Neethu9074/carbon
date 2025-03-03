/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { CarbonModal as Modal } from '@instana/components';
import { t } from '@instana/i18n-react';

import { SubtraceConfigForm } from 'in-applications/Forms/SubtraceConfiguration/SubtraceConfigForm';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { subtraceDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import { NewSubtraceConfig, SubtraceFormFields } from 'in-applications/types';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useSubtraceForm } from 'in-applications/hooks/useSubtraceForm';
import { subtraceDashboard } from 'in-applications/navigation/paths';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { createSubtrace } from 'in-applications/api/subtraces';
import { close } from 'in-components/DialogPresenter/store';
import useFormSubmission from 'in-hooks/useFormSubmission';

import locals from './CreateSubtraceDialog.mless';

export default function CreateSubtraceDialog() {
  const { location, navigate } = useNavigation();
  const [formSubmitStatus, doSubmit] = useFormSubmission(createSubtrace);
  const { form, isFormValid, updateForm } = useSubtraceForm();

  const disabled = !form.hierarchyTouched || !isFormValid || formSubmitStatus === 'pending';

  const onHandleSubmit = () => {
    const payload = normalizeFormData(form);
    const subtraceName = form.get('name').value;
    doSubmit({
      payload,
      onSuccess: ({ data }) => {
        addSuccessMessage(
          t('in-applications:subtraces.configuration.success.created.title'),
          t('in-applications:subtraces.configuration.success.created.message', { subtraceName })
        );
        close();

        const subtraceId = data?.id;
        const { path, name } = subtraceDashboardUrlParameters.subtraceId;
        const dashboardLocation = cloneLocation(location);
        dashboardLocation.pathname = subtraceDashboard;
        setOrDeleteMatrixKey(dashboardLocation, path, name, subtraceId);

        navigate(dashboardLocation);
      },
      onError: () =>
        addErrorMessage(
          t('in-applications:subtraces.configuration.failure.created.title'),
          t('in-applications:subtraces.configuration.failure.created.message', { subtraceName })
        )
    });
  };

  return (
    <Modal
      modalHeading={t('in-applications:subtraces.newSubtrace')}
      onRequestClose={close}
      primaryButtonText={t('forms.actions.save')}
      primaryButtonDisabled={disabled}
      onRequestSubmit={onHandleSubmit}
      secondaryButtonText={t('forms.actions.cancel')}
      className={locals.modal}
      selectorsFloatingMenus={['.cds--search', '.cds--search-input']}
      preventCloseOnClickOutside
      open
    >
      <SubtraceConfigForm form={form} updateForm={updateForm} />
    </Modal>
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

function normalizeFormData(form: MapForm<SubtraceFormFields>): NewSubtraceConfig {
  const subtrace = form.toJS();
  const normalizedSubtrace = { ...subtrace, tagFilterExpression: toBackendQueryModel(subtrace.tagFilterExpression) };

  return normalizedSubtrace as NewSubtraceConfig;
}

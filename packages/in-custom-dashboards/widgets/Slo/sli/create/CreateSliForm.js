/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';

import { Message, Stack } from '@instana/components';

import { trackSLICloned, trackSLIEditAbort, trackSliNewCreated } from 'in-custom-dashboards/widgets/Slo/tracker';
import { Spacer } from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import Form from 'in-components/form/binding/Form';
import { t } from 'in-i18n';

export default function CreateSliForm({
  form,
  updateForm,
  editMode,
  setFooter,
  close,
  children,
  filterExpressionValid,
  onSubmit
}) {
  const [formSubmitState, setFormSubmitState] = useState({
    success: false,
    saving: false,
    error: false
  });
  const { saving } = formSubmitState;
  useSetFooter({ form, filterExpressionValid, setFooter, close, saving, editMode });

  const handleSubmit = submittedForm => {
    setFormSubmitState({
      saving: true,
      success: false,
      error: false
    });

    const submittedFormData = submittedForm.toJS();
    onSubmit(submittedFormData).once(
      onSaveSuccess(submittedFormData, editMode, setFormSubmitState, close),
      onSaveFailure(submittedFormData, setFormSubmitState)
    );
  };

  return (
    <Form form={form} setForm={updateForm} onSubmit={handleSubmit} formId="createSliForm">
      <Stack gap="large">
        {children}
        {editMode && <Message>{t('in-custom-dashboards:widgets.slo.createSliForm.sliConfigMsg')}</Message>}
        <ErroneousResultPresenter errors={formSubmitState.errors} />
        <Spacer />
      </Stack>
    </Form>
  );
}

function useSetFooter({ form, filterExpressionValid, setFooter, close, saving, editMode }) {
  useEffect(() => {
    setFooter(
      <FormFooter withRoundedBottomBorder>
        <CancelButton
          onClick={() => {
            const sliEntityForm = form.get('sliEntity');
            const sliType = sliEntityForm?.get('sliType')?.value;
            trackSLIEditAbort({ sliId: editMode, sliType });
            close();
          }}
        />
        <SaveButton
          form={form}
          isSaving={saving}
          disabled={!filterExpressionValid || !form.hierarchyTouched}
          formId="createSliForm"
        >
          {editMode
            ? t('in-custom-dashboards:widgets.slo.createSliForm.clone')
            : t('in-custom-dashboards:widgets.slo.createSliForm.create')}
        </SaveButton>
      </FormFooter>
    );
    return () => {
      setFooter(null);
    };
  }, [close, form, filterExpressionValid, saving, setFooter, editMode]);
}

function onSaveSuccess(submittedFormData, editMode, setFormSubmitState, close) {
  return () => {
    addMessage(
      {
        type: 'info',
        timeout: 4000,
        title: t('in-custom-dashboards:widgets.slo.createSliForm.sliCreateSuccess'),
        content: t('in-custom-dashboards:widgets.slo.createSliForm.sliCreated', {
          sliName: submittedFormData.sliName
        })
      },
      'custom-dashboard-sli'
    );
    if (editMode) {
      trackSLICloned({ sliType: submittedFormData.sliEntity?.sliType });
    } else {
      trackSliNewCreated({ sliType: submittedFormData.sliEntity?.sliType });
    }
    setFormSubmitState(prevState => ({
      ...prevState,
      saving: false,
      error: false
    }));
    close();
  };
}

function onSaveFailure(submittedFormData, setFormSubmitState) {
  return () => {
    addMessage(
      {
        type: 'danger',
        timeout: 4000,
        title: t('in-custom-dashboards:widgets.slo.createSliForm.failCreateSli'),
        content: t('in-custom-dashboards:widgets.slo.createSliForm.problemCreateSli', {
          sliName: submittedFormData.sliName
        })
      },
      'custom-dashboard-error'
    );
    setFormSubmitState(prevState => ({
      ...prevState,
      saving: false,
      error: true
    }));
  };
}

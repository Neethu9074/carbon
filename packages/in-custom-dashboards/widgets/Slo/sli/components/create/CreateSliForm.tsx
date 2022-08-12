/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';
import { Item, MapForm } from 'formalistic';

import { Message, Stack, Spacer } from '@instana/components';
import { Observable } from '@instana/observables';

import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { SliFormData } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import Form from 'in-components/form/binding/Form';
import { SliEntitySliType } from 'in-types';
import { t } from 'in-i18n';

interface FormSubmitState {
  success: boolean;
  saving: boolean;
  error: boolean;
}

interface CreateSliFormProps<SLI_TYPE extends SliEntitySliType> {
  form: MapForm;
  updateForm: (updatedForm: MapForm) => void;
  setFooter: (footer: React.ReactNode) => void;
  close: () => void;
  children: React.ReactNode;
  onSubmit: (submittedData: SliFormData<SLI_TYPE>) => Observable<unknown>;
  filterExpressionValid?: boolean;
  editMode?: boolean;
}

export default function CreateSliForm<SLI_TYPE extends SliEntitySliType>({
  form,
  updateForm,
  editMode = false,
  setFooter,
  close,
  children,
  filterExpressionValid,
  onSubmit
}: CreateSliFormProps<SLI_TYPE>) {
  const [formSubmitState, setFormSubmitState] = useState<FormSubmitState>({
    success: false,
    saving: false,
    error: false
  });
  const { saving } = formSubmitState;
  useSetFooter({ form, filterExpressionValid, setFooter, close, saving, editMode });

  const handleSubmit = (submittedForm: MapForm) => {
    setFormSubmitState({
      saving: true,
      success: false,
      error: false
    });

    const submittedFormData = submittedForm.toJS() as SliFormData<SLI_TYPE>;
    onSubmit(submittedFormData).once(
      onSaveSuccess(submittedFormData, editMode, setFormSubmitState, close),
      onSaveFailure(submittedFormData, setFormSubmitState)
    );
  };

  return (
    <Form
      form={form}
      setForm={updateForm as (f: Item) => void}
      onSubmit={handleSubmit as (f: Item) => void}
      formId="createSliForm"
    >
      <Stack gap="large">
        {children}
        {editMode && <Message>{t('in-custom-dashboards:widgets.slo.createSliForm.sliConfigMsg')}</Message>}
        <Spacer />
      </Stack>
    </Form>
  );
}

type UseSetFooterProps = Pick<
  CreateSliFormProps<SliEntitySliType>,
  'form' | 'filterExpressionValid' | 'setFooter' | 'close' | 'editMode'
> & { saving: boolean };

function useSetFooter({ form, filterExpressionValid, setFooter, close, saving, editMode }: UseSetFooterProps): void {
  useEffect(() => {
    setFooter(
      <FormFooter withRoundedBottomBorder>
        <CancelButton onClick={close} />
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

function onSaveSuccess(
  submittedFormData: SliFormData<SliEntitySliType>,
  _editMode: boolean, // Keeping this parameter around for the eventual reimplementation of mixpanel tracking
  setFormSubmitState: React.Dispatch<React.SetStateAction<FormSubmitState>>,
  close: () => void
): () => void {
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
    setFormSubmitState(prevState => ({
      ...prevState,
      saving: false,
      error: false
    }));
    close();
  };
}

function onSaveFailure(
  submittedFormData: SliFormData<SliEntitySliType>,
  setFormSubmitState: React.Dispatch<React.SetStateAction<FormSubmitState>>
): () => void {
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

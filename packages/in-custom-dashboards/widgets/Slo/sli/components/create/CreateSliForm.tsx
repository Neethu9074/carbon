/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Item, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { Message, Stack, Spacer } from '@instana/components';
import { Observable } from '@instana/observables';

import { useSloWidgetTrackers } from 'in-custom-dashboards/widgets/Slo/components/SloWidgetTrackerProvider';
import { SLI_MANAGEMENT_CREATE_FINISH, SLI_MANAGEMENT_EDIT_FINISH } from 'in-services/tracking/eventNames';
import useSetFormFooterEffect from 'in-custom-dashboards/widgets/Slo/sli/hooks/useSetFormFooterEffect';
import { SliFormData } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { SliType } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import Form from 'in-components/form/binding/Form';
import { t } from 'in-i18n';

export interface FormSubmitState {
  success: boolean;
  saving: boolean;
  error: boolean;
}

interface CreateSliFormProps<SLI_TYPE extends SliType> {
  entityType: SLI_TYPE;
  form: MapForm;
  updateForm: (updatedForm: MapForm) => void;
  setFooter: (footer: React.ReactNode) => void;
  close: () => void;
  children: React.ReactNode;
  onSubmit: (submittedData: SliFormData<SLI_TYPE>) => Observable<unknown>;
  filterExpressionValid?: boolean;
  editMode?: boolean;
}

export default function CreateSliForm<SLI_TYPE extends SliType>({
  entityType,
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

  useSetFormFooterEffect({
    form,
    formId: 'createSliForm',
    isDisabled: !filterExpressionValid || !form.hierarchyTouched,
    isSaving: saving,
    cloneOnly: editMode,
    onCancel: close,
    setFooter
  });

  const track = useSloWidgetTrackers();

  const handleSubmit = (submittedForm: MapForm) => {
    setFormSubmitState({
      saving: true,
      success: false,
      error: false
    });

    const submittedFormData = submittedForm.toJS() as SliFormData<SLI_TYPE>;
    onSubmit(submittedFormData).once(
      () => onSaveSuccess(submittedFormData, editMode, entityType, setFormSubmitState, track, close),
      () => onSaveFailure(submittedFormData, setFormSubmitState)
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

function onSaveSuccess(
  submittedFormData: SliFormData<SliType>,
  editMode: boolean,
  entityType: SliType,
  setFormSubmitState: React.Dispatch<React.SetStateAction<FormSubmitState>>,
  track: ReturnType<typeof useSloWidgetTrackers>,
  close: () => void
): void {
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
  trackSaveSuccess(track, entityType, editMode);
  close();
}

function onSaveFailure(
  submittedFormData: SliFormData<SliType>,
  setFormSubmitState: React.Dispatch<React.SetStateAction<FormSubmitState>>
): void {
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
}

function trackSaveSuccess(
  track: ReturnType<typeof useSloWidgetTrackers>,
  entityType: SliType,
  editMode: boolean
): void {
  const event = editMode ? SLI_MANAGEMENT_EDIT_FINISH : SLI_MANAGEMENT_CREATE_FINISH;
  track(event, { entityType });
}

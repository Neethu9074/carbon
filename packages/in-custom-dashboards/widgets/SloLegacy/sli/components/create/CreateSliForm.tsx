/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Item, MapForm } from 'formalistic';
import React from 'react';

import { Result, SliConfigurationWithLastUpdated } from '@instana/types';
import { Message, Stack, Spacer } from '@instana/components';

import {
  toApplicationSliConfiguration,
  toWebsiteSliConfiguration
} from 'in-custom-dashboards/widgets/SloLegacy/sli/sliForm';
// eslint-disable-next-line import/no-deprecated
import { getField } from 'in-custom-dashboards/widgets/SloLegacy/form';
import useSetFormFooterEffect from 'in-custom-dashboards/widgets/SloLegacy/sli/hooks/useSetFormFooterEffect';
import { SLI_MANAGEMENT_CREATE_FINISH, SLI_MANAGEMENT_EDIT_FINISH } from 'in-services/tracking/eventNames';
import { SliConfigBySliType } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import { createSliConfiguration } from 'in-custom-dashboards/widgets/SloLegacy/sli/api';
import { sliSliNameKey } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliForm';
import { SliType } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import { useSloTrackers } from 'in-service-levels/hooks/SloTrackerProvider';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import useFormSubmission from 'in-hooks/useFormSubmission';
import Form from 'in-components/form/binding/Form';
import { t } from 'in-i18n';

interface CreateSliFormProps<SLI_TYPE extends SliType> {
  entityType: SLI_TYPE;
  form: MapForm<any>;
  updateForm: (updatedForm: MapForm<any>) => void;
  setFooter: (footer: React.ReactNode) => void;
  close: () => void;
  children: React.ReactNode;
  filterExpressionValid?: boolean;
  editMode?: boolean;
  onSave: (config: SliConfigBySliType<SLI_TYPE>) => void;
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
  onSave
}: CreateSliFormProps<SLI_TYPE>) {
  const [submitStatus, doSubmit] = useFormSubmission(createSliConfiguration);

  useSetFormFooterEffect({
    formId: 'createSliForm',
    isSaving: submitStatus === 'pending',
    cloneOnly: editMode,
    onCancel: close,
    setFooter
  });

  const track = useSloTrackers();

  // eslint-disable-next-line import/no-deprecated
  const sliName = getField(form, [sliSliNameKey])?.value ?? '';

  const trackSaveSuccess = (entityType: SliType, editMode: boolean): void => {
    const event = editMode ? SLI_MANAGEMENT_EDIT_FINISH : SLI_MANAGEMENT_CREATE_FINISH;
    track(event, { entityType });
  };

  const normalizeFormData = (submittedForm: Item) => {
    const jsFormData = submittedForm.toJS();

    if (entityType === 'website') {
      return toWebsiteSliConfiguration(jsFormData);
    }

    return toApplicationSliConfiguration(jsFormData);
  };

  const onSaveSuccess = (result: Result<SliConfigurationWithLastUpdated>) => {
    addMessage(
      {
        type: 'info',
        timeout: 4000,
        title: t('in-custom-dashboards:widgets.slo.createSliForm.sliCreateSuccess'),
        content: t('in-custom-dashboards:widgets.slo.createSliForm.sliCreated', {
          sliName
        })
      },
      'custom-dashboard-sli'
    );
    onSave(result.data as SliConfigBySliType<SLI_TYPE>);
    trackSaveSuccess(entityType, editMode);
    close();
  };

  const onSaveFailure = () => {
    addMessage(
      {
        type: 'danger',
        timeout: 4000,
        title: t('in-custom-dashboards:widgets.slo.createSliForm.failCreateSli'),
        content: t('in-custom-dashboards:widgets.slo.createSliForm.problemCreateSli', {
          sliName
        })
      },
      'custom-dashboard-error'
    );
  };

  const handleSubmit = (submittedForm: Item) => {
    if (!filterExpressionValid) return;

    doSubmit({ payload: normalizeFormData(submittedForm), onSuccess: onSaveSuccess, onError: onSaveFailure });
  };

  return (
    <Form
      form={form}
      setForm={updateForm as (f: Item) => void}
      onSubmit={handleSubmit}
      formId="createSliForm"
      aria-label={t('in-custom-dashboards:widgets.slo.createSliForm.formName')}
    >
      <Stack gap="large">
        {children}
        {editMode && <Message>{t('in-custom-dashboards:widgets.slo.createSliForm.sliConfigMsg')}</Message>}
        <Spacer />
      </Stack>
    </Form>
  );
}

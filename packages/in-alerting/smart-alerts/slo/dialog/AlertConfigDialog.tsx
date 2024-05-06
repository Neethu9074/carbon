/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Result, ServiceLevelsAlertConfig, ServiceLevelsAlertConfigWithMetadata } from '@instana/types';
import { Observable } from '@instana/observables';

import SloAlertFormProvider, { CreateSloAlertDialogMode } from 'in-alerting/smart-alerts/slo/form/SloAlertFormProvider';
import AlertConfigDialogPresenter from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import { AdvancedModeFooter } from 'in-alerting/smart-alerts/components/dialog/advanced/AdvancedModeFooter';
import { SloAlertForm, createSloAlertForm } from 'in-alerting/smart-alerts/slo/form/alertFormDefinition';
import AdvancedModeContainer from 'in-alerting/smart-alerts/slo/dialog/advanced/AdvancedModeContainer';
import { createSloAlertConfiguration } from 'in-alerting/smart-alerts/slo/api/sloAlertConfig';
import getTranslatedErrorMessage from 'in-service-levels/components/ConfigDialog/errors';
import { formToSloAlertConfiguration } from 'in-alerting/smart-alerts/slo/form/utils';
import { trackAlertSaved } from 'in-alerting/smart-alerts/components/tracker';
import { close as closeDialog } from 'in-components/DialogPresenter/store';
import useFormSubmission from 'in-service-levels/hooks/useFormSubmission';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { noop } from 'in-services/fixedObjects';
import { seconds } from 'in-services/time/time';
import { t } from 'in-i18n';

type SloAlertFormSubmissionAction = (
  config: ServiceLevelsAlertConfig
) => Observable<Result<ServiceLevelsAlertConfigWithMetadata>>;

interface AlertConfigDialogProps {
  onClose: VoidFunction;
  editMode?: boolean;
  alertConfig: ServiceLevelsAlertConfig;
}

const FORM_ID = 'slo-smart-alert-editor';

export default function AlertConfigDialog({ onClose, editMode, alertConfig }: AlertConfigDialogProps) {
  const mode = editMode ? 'EDIT' : 'NEW';
  const timeConfig = useTimeConfig();
  const [form, setForm] = useState(() => createSloAlertForm(alertConfig));
  const [submitStatus, doSubmit] = useFormSubmission<ServiceLevelsAlertConfig, ServiceLevelsAlertConfigWithMetadata>(
    getFormSubmitAction(mode)
  );

  return (
    <SloAlertFormProvider
      mode={mode}
      form={form}
      updateForm={setForm}
      onChange={(path, updater) => setForm(form.updateIn(path, updater) as SloAlertForm)}
    >
      <AlertConfigDialogPresenter
        editMode={editMode}
        form={form}
        withTrackClose={onClose}
        withTrackCreate={noop}
        updateForm={setForm}
        messages={[]}
        onChange={noop}
        stepConfigs={[]}
        stepRenderers={[]}
        step={0}
        formId={FORM_ID}
        handleSubmit={noop}
        footer={
          <AdvancedModeFooter
            form={form}
            setForm={setForm}
            onClose={onClose}
            onCreate={() => {
              if (!form.hierarchyValid) return;

              doSubmit({
                payload: formToSloAlertConfiguration(form),
                onSuccess,
                onError
              });
            }}
            isSaving={submitStatus === 'pending'}
            editMode={editMode}
            additionalValidationCheck={() => true}
            scrollToFirstFormError={() => {}}
          />
        }
        setSimpleMode={noop}
        TagBasedPayloadConfigurator={() => <></>}
        QueryBuilderComponent={() => <></>}
        AdvancedModeElement={AdvancedModeContainer}
        SimpleModeElement={() => <></>}
        timeConfig={timeConfig}
        isDynamicCustomPayloadValid
        isTagFilterFormModelValid
        thresholdResult={undefined}
      />
    </SloAlertFormProvider>
  );
}

function getFormSubmitAction(mode: CreateSloAlertDialogMode): SloAlertFormSubmissionAction {
  switch (mode) {
    case 'NEW':
      return createSloAlertConfiguration;
    case 'CLONE':
    case 'EDIT':
      throw Error(`${mode} mode is currently not yet implemented for SLO smart alerts`);
  }
}

function onSuccess({ data }: Result<ServiceLevelsAlertConfigWithMetadata>) {
  if (!data) throw Error('Unknown SLO smart-alert creation error');

  const { name } = data;

  addMessage({
    type: 'info',
    timeout: seconds.toMillis(4),
    title: t('in-service-levels:createSloDialog.messages.creationSuccessfulTitle'),
    content: t('in-service-levels:createSloDialog.messages.creationSuccessfulContent', {
      name
    })
  });

  trackAlertSaved(data, false);

  closeDialog();
}

const errorMessageHeader = {
  type: 'danger',
  title: t('in-service-levels:createSloDialog.messages.creationFailedTitle')
} as const;

function onError(result?: Result<ServiceLevelsAlertConfigWithMetadata>) {
  if (result && result.errors.length !== 0) {
    return result.errors.forEach(error =>
      addMessage({
        ...errorMessageHeader,
        timeout: seconds.toMillis(6),
        content: getTranslatedErrorMessage(error)
      })
    );
  }
}

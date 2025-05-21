/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Result, ServiceLevelsAlertConfig, ServiceLevelsAlertConfigWithMetadata } from '@instana/types';
import { Observable } from '@instana/observables';

import {
  createSloAlertConfiguration,
  updateSloAlertConfiguration
} from 'in-alerting/smart-alerts/slo/api/sloAlertConfig';
import SloAlertFormProvider, { CreateSloAlertDialogMode } from 'in-alerting/smart-alerts/slo/form/SloAlertFormProvider';
import AlertConfigDialogPresenter from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import { AdvancedModeFooter } from 'in-alerting/smart-alerts/components/dialog/advanced/AdvancedModeFooter';
import AdvancedModeContainer from 'in-alerting/smart-alerts/slo/dialog/advanced/AdvancedModeContainer';
import useSloAlertConfigForm from 'in-alerting/smart-alerts/slo/hooks/useSloAlertConfigForm';
import getTranslatedErrorMessage from 'in-service-levels/components/ConfigDialog/errors';
import { formToSloAlertConfiguration } from 'in-alerting/smart-alerts/slo/form/utils';
import { trackAlertSaved } from 'in-alerting/smart-alerts/components/tracker';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { SloAlertForm } from 'in-alerting/smart-alerts/slo/types';
import useFormSubmission from 'in-hooks/useFormSubmission';
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

  const [form, updateForm] = useSloAlertConfigForm(alertConfig);
  const sloALertConfigId = form.getIn(['id']).value;

  const [submitStatus, doSubmit] = useFormSubmission<ServiceLevelsAlertConfig, ServiceLevelsAlertConfigWithMetadata>(
    getFormSubmitAction(mode, sloALertConfigId)
  );

  return (
    <SloAlertFormProvider
      mode={mode}
      form={form}
      updateForm={updateForm}
      onChange={(path, updater) => updateForm(form.updateIn(path, updater) as SloAlertForm)}
    >
      <AlertConfigDialogPresenter
        editMode={editMode}
        form={form}
        withTrackClose={onClose}
        withTrackCreate={noop}
        updateForm={updateForm}
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
            setForm={updateForm}
            onClose={onClose}
            onCreate={() => {
              if (!form.hierarchyValid) return;

              doSubmit({
                payload: formToSloAlertConfiguration(form),
                onSuccess: result => onSuccess(mode, result, onClose),
                onError: result => onError(mode, result)
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

function getFormSubmitAction(mode: CreateSloAlertDialogMode, sloALertConfigId: string): SloAlertFormSubmissionAction {
  switch (mode) {
    case 'NEW':
      return createSloAlertConfiguration;
    case 'EDIT':
      return sloAlertConfig => updateSloAlertConfiguration(sloAlertConfig, sloALertConfigId);
  }
}

function onSuccess(
  mode: CreateSloAlertDialogMode,
  { data }: Result<ServiceLevelsAlertConfigWithMetadata>,
  onClose: VoidFunction
) {
  if (!data) throw Error('Unknown SLO smart-alert creation error');

  const { name } = data;

  addMessage({
    type: 'info',
    timeout: seconds.toMillis(4),
    title: t('in-alerting:smartAlerts.slo.messages.successTitle', { context: mode }),
    content: t('in-alerting:smartAlerts.slo.messages.successContent', { context: mode, name })
  });

  trackAlertSaved(data, false);

  onClose();
}

function onError(mode: CreateSloAlertDialogMode, result?: Result<ServiceLevelsAlertConfigWithMetadata>) {
  const errorMessageHeader = {
    type: 'danger',
    title: t('in-alerting:smartAlerts.slo.messages.failedTitle', { context: mode })
  } as const;

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

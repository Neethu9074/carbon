/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm, MapFormItems } from 'formalistic';
import React from 'react';

import { ApplicationAlertConfig } from '@instana/types';

import { useSimpleModePageNavigation } from 'in-alerting/smart-alerts/components/dialog/simple/useSimpleModePageNavigation';
import { BluePrint, getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import AlertingTearSheet, { AlertingFooterActions } from 'in-alerting/components/AlertingTearSheet';
import AlertingTearSheetContent from 'in-alerting/components/AlertingTearSheetContent';
import { days } from 'in-services/time/time';
import { t } from 'in-i18n';

/**
 * Timeframe used for the tag-suggestions in QB2.
 */
export const tagSuggestionTimeConfig = {
  windowSize: days.toMillis(1),
  autoRefresh: true
};

const FORM_ID = 'smart-alert-editor';

const stepConfigs = [
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step1Title'),
    validateIntermediately: []
  },
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step2Title'),
    validateIntermediately: [],
    isOptional: true
  },
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step3Title'),
    validateIntermediately: [],
    isOptional: true
  },
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step4Title'),
    validateIntermediately: [],
    isOptional: true
  },
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step5Title'),
    validateIntermediately: [],
    hidden: true,
    isBeta: true,
    isOptional: true
  },
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step6Title'),
    validateIntermediately: [],
    hidden: true,
    isOptional: true
  }
];
export interface AP_FORM_DATA extends MapFormItems {
  rule: Field<{ alertType: string }>; // TODO add application form data here
}

// TODO props need to be updated
interface AlertConfigTearSheetWithThresholdProps {
  form: MapForm<AP_FORM_DATA>;
  isGlobalSmartAlert: boolean;
  withTrackCreate: VoidFunction;
  withTrackClose: VoidFunction;
  updateForm: (form: MapForm<any>) => void;
  isSaving: boolean;
}

export default function AlertConfigTearSheetWithThreshold(props: AlertConfigTearSheetWithThresholdProps) {
  const { form, isGlobalSmartAlert } = props;
  const alertConfigWithFormModel = form.toJS() as unknown as ApplicationAlertConfig;
  const blueprintConfig = getBlueprintConfig(alertConfigWithFormModel.rule.alertType);

  return (
    <SmartAlertConfigTearSheetWithQueryValidation
      {...props}
      alertConfigWithFormModel={alertConfigWithFormModel}
      blueprintConfig={blueprintConfig}
      isGlobalSmartAlert={isGlobalSmartAlert}
    />
  );
}

type ExtendedProps = AlertConfigTearSheetWithThresholdProps & {
  alertConfigWithFormModel: ApplicationAlertConfig;
  blueprintConfig: BluePrint;
};

function SmartAlertConfigTearSheetWithQueryValidation(props: ExtendedProps) {
  const { form, withTrackCreate, withTrackClose, updateForm, isSaving } = props;

  const { step, setStep, backOrCancel, handleSubmit } = useSimpleModePageNavigation({
    stepConfigs,
    form,
    setForm: updateForm,
    onCreate: withTrackCreate,
    onClose: withTrackClose
  });

  const actions: AlertingFooterActions[] = [
    {
      kind: 'ghost',
      isLeftAlign: true,
      label: t('in-alerting:smartAlerts.components.smartAlertDialog.cancelTitle'),
      onClick: () => undefined
    },
    {
      kind: 'secondary',
      isLeftAlign: false,
      label: t('in-alerting:smartAlerts.components.smartAlertDialog.previousTitle'),
      onClick: backOrCancel
    },
    {
      kind: 'primary',
      isLeftAlign: false,
      label: t('in-alerting:smartAlerts.components.smartAlertDialog.buttonCreate'),
      onClick: handleSubmit
    }
  ];

  const stepRenderers: (() => JSX.Element)[] = [
    () => (
      <AlertingTearSheetContent title={stepConfigs[0].title}>
        <></>
      </AlertingTearSheetContent>
    ),
    () => <AlertingTearSheetContent title={stepConfigs[1].title}> {''}</AlertingTearSheetContent>,
    () => <AlertingTearSheetContent title={stepConfigs[2].title}> {''}</AlertingTearSheetContent>,
    () => <AlertingTearSheetContent title={stepConfigs[3].title}> {''}</AlertingTearSheetContent>,
    () => <AlertingTearSheetContent title={stepConfigs[4].title}> {''}</AlertingTearSheetContent>,
    () => <AlertingTearSheetContent title={stepConfigs[5].title}> {''}</AlertingTearSheetContent>
  ];

  return (
    <AlertingTearSheet
      step={step}
      setStep={setStep}
      actions={actions}
      stepConfigs={stepConfigs}
      isSaving={isSaving}
      formId={FORM_ID}
      form={form}
    >
      {stepRenderers.map(
        (Renderer: (props: AlertConfigTearSheetWithThresholdProps) => JSX.Element, idx: number) =>
          step === idx && <Renderer {...props} key={idx} />
      )}
    </AlertingTearSheet>
  );
}

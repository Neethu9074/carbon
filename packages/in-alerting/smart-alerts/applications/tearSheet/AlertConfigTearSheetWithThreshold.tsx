/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react';
import { Field, Item, MapForm, MapFormItems, MapPath } from 'formalistic';

import { ApplicationAlertConfig, TimeConfig } from '@instana/types';

import {
  APStepRenderers,
  stepConfigs,
  getFooterActions
} from 'in-alerting/smart-alerts/applications/tearSheet/steps/TearSheetStepConfigs';
import useCalculateThresholdOnBackendSignalEmitter from 'in-alerting/smart-alerts/applications/hooks/useCalculateThresholdOnBackendSignalEmitter';
//@ts-expect-error TS migration
import { useThresholdSuggestion } from 'in-alerting/smart-alerts/applications/hooks/useThresholdSuggestion';
import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
//@ts-expect-error
import useIsTagFilterFormModelExists from 'in-alerting/smart-alerts/applications/hooks/useIsTagFilterFormModelExists';
//@ts-expect-error
import useIsTagFilterFormModelValid from 'in-alerting/smart-alerts/applications/hooks/useIsTagFilterFormModelValid';
import { useSimpleModePageNavigation } from 'in-alerting/smart-alerts/components/dialog/simple/useSimpleModePageNavigation';
import useAlertingTearSheetAction from 'in-alerting/smart-alerts/applications/tearSheet/hooks/useAlertingTearSheetAction';
import { getQueryBuilderForAlertType } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import useAlertConfigValidation from 'in-alerting/smart-alerts/applications/hooks/useAlertConfigValidation';
import { BluePrint, getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import AlertingTearSheet, { AlertingFooterActions } from 'in-alerting/components/AlertingTearSheet';
import { blueprintConfigs } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { smartAlertsLogsBlueprintEnabled } from 'in-services/featureFlags';
import { MessageType } from 'in-components/MessageStack/MessageStack';
import { days } from 'in-services/time/time';

/**
 * Timeframe used for the tag-suggestions in QB2.
 */
export const tagSuggestionTimeConfig = {
  windowSize: days.toMillis(1),
  autoRefresh: true
};

const FORM_ID = 'smart-alert-editor';

export interface AP_FORM_DATA extends MapFormItems {
  rule: Field<{ alertType: string }>; // TODO add application form data here
}

export interface AlertConfigTearSheetWithThresholdProps {
  form: MapForm<AP_FORM_DATA>;
  isGlobalSmartAlert?: boolean;
  editMode?: boolean;
  migrationMode?: boolean;
  scopeMigrationDetails?: { query?: string; result: string };
  updateForm: (form: MapForm<any>) => void;
  granularity: number;
  onChange: (path: MapPath<any>, updater: (item: Item) => Item) => void;
  onChartViewConfigChange: (arg: number) => void;
  selectedChartViewConfigIndex: number;
  setForm: (form: MapForm<any>) => void;
  timeConfig: TimeConfig;
  withTrackClose: () => void; // TODO check typedef once redirection is implemented
  withTrackCreate: () => void;
  isSaving: boolean;
  messages: MessageType[] | EnrichedError[];
  headerWithMsg: boolean;
  initialConfiguredApplications?: object;
}

export default function AlertConfigTearSheetWithThreshold(props: AlertConfigTearSheetWithThresholdProps) {
  const { form, isGlobalSmartAlert } = props;

  useCalculateThresholdOnBackendSignalEmitter(form);

  const alertConfigWithFormModel = form.toJS() as unknown as ApplicationAlertConfig;
  const blueprintConfig = getBlueprintConfig(alertConfigWithFormModel.rule.alertType);

  const blueprintConfigList =
    smartAlertsLogsBlueprintEnabled || blueprintConfig?.type === 'logs'
      ? blueprintConfigs
      : blueprintConfigs.filter(config => config?.type !== 'logs');

  return (
    <SmartAlertConfigTearSheetWithQueryValidation
      {...props}
      alertConfigWithFormModel={alertConfigWithFormModel}
      blueprintConfig={blueprintConfig}
      isGlobalSmartAlert={isGlobalSmartAlert}
      blueprintConfigList={blueprintConfigList}
    />
  );
}

export interface TearSheetWithQueryValidationProps extends AlertConfigTearSheetWithThresholdProps {
  alertConfigWithFormModel: ApplicationAlertConfig;
  blueprintConfig: BluePrint;
  blueprintConfigList: any;
}

export interface SlideInConfig {
  title?: string;
  component?: ReactNode;
}

function SmartAlertConfigTearSheetWithQueryValidation({
  alertConfigWithFormModel,
  blueprintConfig,
  ...props
}: TearSheetWithQueryValidationProps) {
  const {
    migrationMode,
    form,
    updateForm,
    editMode,
    withTrackCreate,
    withTrackClose,
    headerWithMsg,
    isSaving,
    isGlobalSmartAlert
  } = props;

  // we are validating only the user-defined part, not the whole enriched form model here,
  // because only that part can ever be invalid
  const { rule, tagFilterExpression, threshold } = alertConfigWithFormModel;
  const { isQueryValid, getTagCatalog } = useMemo(() => {
    const thresholdType = threshold.type;
    return getQueryBuilderForAlertType(rule.alertType, thresholdType);
  }, [rule.alertType, threshold.type]);

  const updateTagFilterExpression = (filteredTagFilterExpression: any) => {
    updateForm(form.updateIn(['tagFilterExpression'], (f: any) => f.setValue(filteredTagFilterExpression)));
  };

  useIsTagFilterFormModelExists(tagFilterExpression, getTagCatalog, updateTagFilterExpression);

  const isTagFilterFormModelValid = useIsTagFilterFormModelValid(tagFilterExpression, isQueryValid);

  const isValid = blueprintConfig.isRuleComplete(rule) && isTagFilterFormModelValid;

  const [thresholdResult, setThresholdResult] = useState();
  useThresholdSuggestion(form, updateForm, setThresholdResult, {
    isGlobalSmartAlert,
    isValid,
    alertConfigWithFormModel,
    blueprintConfig
  });

  const { step, setStep, backOrCancel, handleSubmit } = useSimpleModePageNavigation({
    stepConfigs,
    form,
    setForm: updateForm,
    onCreate: withTrackCreate,
    onClose: withTrackClose
  });

  const { cancelTearSheet } = useAlertingTearSheetAction();

  //@ts-expect-error
  const actions: AlertingFooterActions[] = getFooterActions(editMode, backOrCancel, cancelTearSheet);

  const stepRenderers = APStepRenderers;

  const navItems = useAlertConfigValidation(
    stepConfigs,
    blueprintConfig,
    form,
    isTagFilterFormModelValid,
    thresholdResult
  );

  return (
    <AlertingTearSheet
      step={step}
      setStep={setStep}
      actions={actions}
      stepConfigs={navItems}
      isSaving={isSaving}
      formId={FORM_ID}
      form={form}
      migrationMode={migrationMode}
      handleSubmit={handleSubmit}
      thresholdResult={thresholdResult}
      headerWithMsg={headerWithMsg}
      additionalValidationCheck={step === 1 || step === 3 ? isTagFilterFormModelValid : true}
      setForm={updateForm}
    >
      {stepRenderers.map(
        (
          Renderer: (
            props: AlertConfigTearSheetWithThresholdProps & {
              isTagFilterFormModelValid: boolean;
              setStep: Dispatch<SetStateAction<number>>;
            }
          ) => JSX.Element,
          idx: number
        ) => {
          return (
            step === idx && (
              <Renderer
                {...props}
                key={idx}
                isGlobalSmartAlert={isGlobalSmartAlert}
                isTagFilterFormModelValid={isTagFilterFormModelValid}
                setStep={setStep}
              />
            )
          );
        }
      )}
    </AlertingTearSheet>
  );
}

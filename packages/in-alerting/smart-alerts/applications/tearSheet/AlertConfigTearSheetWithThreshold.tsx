/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, Item, MapForm, MapFormItems, MapPath } from 'formalistic';
import React, { ReactNode, useMemo, useState } from 'react';

import { ApplicationAlertConfig, TimeConfig } from '@instana/types';

//@ts-expect-error TS migration
import useIsTagFilterFormModelValid from 'in-alerting/smart-alerts/applications/hooks/useIsTagFilterFormModelValid';
import {
  APStepRenderers,
  stepConfigs,
  getFooterActions
} from 'in-alerting/smart-alerts/applications/tearSheet/steps/TearSheetStepConfigs';
import useCalculateThresholdOnBackendSignalEmitter from 'in-alerting/smart-alerts/applications/hooks/useCalculateThresholdOnBackendSignalEmitter';
//@ts-expect-error TS migration
import { useThresholdSuggestion } from 'in-alerting/smart-alerts/applications/hooks/useThresholdSuggestion';
import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import { useRemoveInvalidTagsFromFilterExpression } from 'in-alerting/smart-alerts/hooks/useRemoveInvalidTagsFromFilterExpression';
import { useSimpleModePageNavigation } from 'in-alerting/smart-alerts/components/dialog/simple/useSimpleModePageNavigation';
import useAlertingTearSheetAction from 'in-alerting/smart-alerts/applications/tearSheet/hooks/useAlertingTearSheetAction';
import { getQueryBuilderForAlertType } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import useAlertConfigValidation from 'in-alerting/smart-alerts/applications/hooks/useAlertConfigValidation';
import { BluePrint, getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import AlertingTearSheet, { AlertingFooterActions } from 'in-alerting/components/AlertingTearSheet';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { days } from 'in-services/time/time';

// import { useObservable } from '@instana/hooks';

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
  messages: EnrichedError[];
  initialConfiguredApplications?: object;
}

export default function AlertConfigTearSheetWithThreshold(props: AlertConfigTearSheetWithThresholdProps) {
  const { form, isGlobalSmartAlert } = props;

  useCalculateThresholdOnBackendSignalEmitter(form);

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

export interface TearSheetWithQueryValidationProps extends AlertConfigTearSheetWithThresholdProps {
  alertConfigWithFormModel: ApplicationAlertConfig;
  blueprintConfig: BluePrint;
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
  const { migrationMode, form, updateForm, editMode, withTrackCreate, withTrackClose, isSaving, isGlobalSmartAlert } =
    props;

  // we are validating only the user-defined part, not the whole enriched form model here,
  // because only that part can ever be invalid
  const { rule, tagFilterExpression, threshold } = alertConfigWithFormModel;
  const { isQueryValid, getTagCatalog } = useMemo(() => {
    const thresholdType = threshold.type;
    return getQueryBuilderForAlertType(rule.alertType, thresholdType);
  }, [rule.alertType, threshold.type]);

  const isTagFilterFormModelValid = useIsTagFilterFormModelValid(tagFilterExpression, isQueryValid);

  const updateTagFilterExpression = (filteredTagFilterExpression: any) => {
    updateForm(form.updateIn(['tagFilterExpression'], (f: any) => f.setValue(filteredTagFilterExpression)));
  };

  useRemoveInvalidTagsFromFilterExpression(
    getTagCatalog,
    tagFilterExpression as unknown as FormModelElement[],
    updateTagFilterExpression
  );

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
      additionalValidationCheck={step === 2 ? isTagFilterFormModelValid : true}
      setForm={updateForm}
    >
      {stepRenderers.map((Renderer: (props: AlertConfigTearSheetWithThresholdProps) => JSX.Element, idx: number) => {
        return step === idx && <Renderer {...props} key={idx} />;
      })}
    </AlertingTearSheet>
  );
}

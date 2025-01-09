/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react';
import { Item, MapForm, MapPath } from 'formalistic';

import { AdaptiveBaselineData, HistoricBaselineData, Result, StaticThresholdData, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

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
import {
  BluePrint,
  getBlueprintConfig,
  blueprintConfigs
} from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { useSimpleModePageNavigation } from 'in-alerting/smart-alerts/components/dialog/simple/useSimpleModePageNavigation';
//@ts-expect-error
import { channelListLoading$ } from 'in-alerting/smart-alerts/components/tearSheet/AlertChannelsList';
import { smartAlertsLogsBlueprintEnabled, alertChannelPerSeverityApplicationSaEnabled } from 'in-services/featureFlags';
import { ApplicationSmartAlertConfig } from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { getQueryBuilderForAlertType } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import useAlertConfigValidation from 'in-alerting/smart-alerts/applications/hooks/useAlertConfigValidation';
import AlertingTearSheet from 'in-alerting/components/AlertingTearSheet';
import { MessageType } from 'in-components/MessageStack/MessageStack';
import { productAreas } from 'in-services/tracking/productAreas';
import { days } from 'in-services/time/time';
import { Nullish } from 'in-types';

/**
 * Timeframe used for the tag-suggestions in QB2.
 */
export const tagSuggestionTimeConfig = {
  windowSize: days.toMillis(1),
  autoRefresh: true
};

const FORM_ID = 'smart-alert-editor';

export interface AlertConfigTearSheetWithThresholdProps {
  form: MapForm<any>;
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
  withTrackClose: () => void;
  withTrackCreate: () => void;
  isSaving: boolean;
  messages: MessageType[] | EnrichedError[];
  headerWithMsg: boolean;
  initialConfiguredApplications?: object;
  cancelTearSheet: () => string | Nullish;
}

export default function AlertConfigTearSheetWithThreshold(props: AlertConfigTearSheetWithThresholdProps) {
  const { form, isGlobalSmartAlert } = props;

  useCalculateThresholdOnBackendSignalEmitter(form);

  const alertConfigWithFormModel = form.toJS() as unknown as ApplicationSmartAlertConfig;
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
  alertConfigWithFormModel: ApplicationSmartAlertConfig;
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
    isGlobalSmartAlert,
    cancelTearSheet
  } = props;

  // we are validating only the user-defined part, not the whole enriched form model here,
  // because only that part can ever be invalid
  const { rule, tagFilterExpression } = alertConfigWithFormModel;

  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;

  const { isQueryValid, getTagCatalog } = useMemo(() => {
    return getQueryBuilderForAlertType(rule.alertType, thresholdType);
  }, [rule.alertType, thresholdType]);

  const updateTagFilterExpression = (filteredTagFilterExpression: any) => {
    updateForm(form.updateIn(['tagFilterExpression'], (f: any) => f.setValue(filteredTagFilterExpression)));
  };

  useIsTagFilterFormModelExists(tagFilterExpression, getTagCatalog, updateTagFilterExpression);

  const isTagFilterFormModelValid = useIsTagFilterFormModelValid(tagFilterExpression, isQueryValid, true);

  const isValid = blueprintConfig.isRuleComplete(rule) && isTagFilterFormModelValid;

  const [thresholdResult, setThresholdResult] = useState();
  useThresholdSuggestion(form, updateForm, setThresholdResult, {
    isGlobalSmartAlert,
    isValid,
    alertConfigWithFormModel,
    blueprintConfig,
    editMode
  });

  const { step, setStep, backOrCancel, handleSubmit } = useSimpleModePageNavigation({
    stepConfigs,
    form,
    setForm: updateForm,
    onCreate: withTrackCreate,
    onClose: withTrackClose
  });

  const actions = getFooterActions(backOrCancel, cancelTearSheet, handleSubmit, editMode, migrationMode);

  const navItems = useAlertConfigValidation(
    stepConfigs,
    blueprintConfig,
    form,
    isTagFilterFormModelValid,
    thresholdResult
  );

  const channelListLoading = useObservable(channelListLoading$, []) as number | undefined;
  return (
    <AlertingTearSheet
      step={step}
      setStep={setStep}
      actions={actions}
      stepConfigs={navItems}
      isSaving={isSaving}
      formId={FORM_ID}
      form={form}
      headerWithMsg={headerWithMsg}
      additionalValidationCheck={additionalValidationCheck(step, isTagFilterFormModelValid, channelListLoading)}
      setForm={updateForm}
      sideNavigationEnabled={editMode}
      productArea={productAreas.applications}
    >
      {APStepRenderers.map(
        (
          Renderer: (
            props: AlertConfigTearSheetWithThresholdProps & {
              isTagFilterFormModelValid: boolean;
              setStep: Dispatch<SetStateAction<number>>;
              thresholdResult:
                | Result<StaticThresholdData | AdaptiveBaselineData | HistoricBaselineData>
                | undefined
                | null;
            }
          ) => JSX.Element,
          idx: number
        ) => {
          return (
            step === idx && (
              <Renderer
                {...props}
                key={`key-${idx}`}
                isGlobalSmartAlert={isGlobalSmartAlert}
                isTagFilterFormModelValid={isTagFilterFormModelValid}
                thresholdResult={thresholdResult}
                setStep={setStep}
              />
            )
          );
        }
      )}
    </AlertingTearSheet>
  );
}

function additionalValidationCheck(
  step: number,
  isTagFilterFormModelValid: boolean,
  channelListLoading: number | undefined
) {
  if (step === 1 || step === 3) {
    return isTagFilterFormModelValid;
  } else if (step === 5) {
    return channelListLoading === undefined && !alertChannelPerSeverityApplicationSaEnabled ? false : true;
  }
  return true;
}

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode, useMemo, useState } from 'react';
import { Item, MapForm, MapPath } from 'formalistic';

import { TimeConfig } from '@instana/types';

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
import { stepConfigsForCarbonTearSheet } from 'in-alerting/smart-alerts/applications/tearSheet/steps/TearSheetStepConfigs';
import { ApplicationSmartAlertConfig } from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { getQueryBuilderForAlertType } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import useAlertConfigValidation from 'in-alerting/smart-alerts/applications/hooks/useAlertConfigValidation';
import AlertingFullScreenTearSheet from 'in-alerting/components/AlertingFullScreenTearSheet';
import { smartAlertsLogsBlueprintEnabled } from 'in-services/featureFlags';
import { MessageType } from 'in-components/MessageStack/MessageStack';
import { productAreas } from 'in-services/tracking/productAreas';
import { days } from 'in-services/time/time';
import { t } from 'in-i18n';

/**
 * Timeframe used for the tag-suggestions in QB2.
 */
export const tagSuggestionTimeConfig = {
  windowSize: days.toMillis(1),
  autoRefresh: true
};

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
  initialConfiguredApplications?: object;
  cancelTearSheet: string;
  tearSheetTitle: string;
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
    form,
    updateForm,
    editMode,
    isGlobalSmartAlert,
    tearSheetTitle,
    withTrackCreate,
    cancelTearSheet,
    migrationMode
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

  const navItems = useAlertConfigValidation(
    stepConfigsForCarbonTearSheet,
    blueprintConfig,
    form,
    isTagFilterFormModelValid,
    thresholdResult,
    updateForm
  );

  return (
    //@ts-expect-error
    <AlertingFullScreenTearSheet
      {...props}
      isTagFilterFormModelValid={isTagFilterFormModelValid}
      isEditMode={editMode ?? false}
      tearSheetTitle={tearSheetTitle}
      stepConfigs={navItems}
      thresholdResult={thresholdResult}
      form={form}
      handleFormSubmit={() => handleFormSubmit(withTrackCreate)}
      actionButtonLabel={getButtonLabel(editMode, migrationMode)}
      cancelTearSheet={cancelTearSheet}
      productArea={productAreas.applications}
    />
  );
}

function handleFormSubmit(withTrackCreate: () => void): void {
  withTrackCreate();
}

function getButtonLabel(editMode?: boolean, migrationMode?: boolean) {
  if (migrationMode) {
    return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonMigrate');
  }
  if (editMode) {
    return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonSave');
  }
  return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonCreate');
}

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo, useState } from 'react';
import { Item, MapForm } from 'formalistic';

import {
  createBoundedAlertQueryBuilder,
  createIsAlertQueryValid
} from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import useCalculateThresholdOnBackendSignalEmitter from 'in-alerting/smart-alerts/eum/hooks/useCalculateThresholdOnBackendSignalEmitter';
// @ts-expect-error
import { useIsTagFilterFormModelValid } from 'in-alerting/smart-alerts/websites/hooks/useIsTagFilterFormModelValid';
//@ts-expect-error TS migration
import useThresholdSuggestion from 'in-alerting/smart-alerts/eum/hooks/useThresholdSuggestion';
import { stepConfigsForCarbonTearSheet } from 'in-alerting/smart-alerts/websites/TearSheet/steps/TearSheetStepConfigs';
import { TimeConfig, WebsiteAlertConfigWithMetadata, WebsiteAlertRule, WebsiteAlertRuleUnion } from 'in-types';
import useAlertConfigValidation from 'in-alerting/smart-alerts/websites/hooks/useAlertConfigValidation';
import { getBlueprintConfig, MetricName } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import AlertingFullScreenTearSheet from 'in-alerting/components/AlertingFullScreenTearSheet';
import { getButtonLabel } from 'in-alerting/smart-alerts/websites/TearSheet/sharedFunctions';
import createThresholdForm from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import { productAreas } from 'in-services/tracking/productAreas';
import { days } from 'in-services/time';

export interface AlertConfigTearSheetWithThresholdProps {
  form: MapForm<any>;
  updateForm: ((form: MapForm<any>, setForm?: (form: MapForm<any>) => void) => void) | ((form: MapForm<any>) => void);
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  onChartViewConfigChange: (arg: number) => void;
  selectedChartViewConfigIndex: number;
  editMode: boolean;
  timeConfig: TimeConfig;
  onCreate: (simpleMode: boolean) => void;
  isSaving: boolean;
  messages: EnrichedError[];
  withTrackClose: () => void;
  cancelTearSheet: string;
  tearSheetTitle: string;
}

/**
 * Timeframe used for the tag-suggestions in QB2.
 */
const tagSuggestionTimeConfig = {
  windowSize: days.toMillis(1),
  autoRefresh: false
};

export default function AlertConfigTearSheetWithThreshold(props: AlertConfigTearSheetWithThresholdProps) {
  const { editMode, tearSheetTitle, form, updateForm, onCreate } = props;

  useCalculateThresholdOnBackendSignalEmitter(form);
  const [, setTagFilterValid] = useState(true);

  const alertConfigWithFormModel = form.toJS() as unknown as WebsiteAlertConfigWithMetadata;

  const { rule, tagFilterExpression, websiteId, threshold } = alertConfigWithFormModel;

  const { metricName, alertType } = rule as WebsiteAlertRuleUnion;

  const blueprintConfig = getBlueprintConfig(alertType);

  const validThreshold = (threshold as any)?.warningThreshold?.type
    ? (threshold as any).warningThreshold
    : (threshold as any)?.criticalThreshold;

  const beaconType = blueprintConfig.getBeaconType(metricName as MetricName);

  const { isQueryValid } = useMemo(
    () => createBoundedAlertQueryBuilder(websiteId, beaconType, validThreshold?.type, tagSuggestionTimeConfig),
    [websiteId, beaconType, validThreshold?.type]
  );

  const isAlertQueryValid = createIsAlertQueryValid(isQueryValid);

  const isTagFilterFormModelValid = useIsTagFilterFormModelValid(tagFilterExpression, isAlertQueryValid);

  const isValid = blueprintConfig.isRuleComplete(rule as WebsiteAlertRule) && isTagFilterFormModelValid;

  const [thresholdResult, setThresholdResult] = useState();
  useThresholdSuggestion(form, updateForm, setThresholdResult, createThresholdForm, {
    isValid,
    simpleMode: true,
    alertConfigWithFormModel,
    blueprintConfig
  });

  // this hook will validate each step and prevents navigation
  const navItems = useAlertConfigValidation(
    stepConfigsForCarbonTearSheet,
    form,
    isTagFilterFormModelValid,
    thresholdResult,
    updateForm
  );

  return (
    <AlertingFullScreenTearSheet
      {...props}
      blueprintConfig={blueprintConfig}
      isTagFilterFormModelValid
      isEditMode={false}
      tearSheetTitle={tearSheetTitle}
      stepConfigs={navItems}
      thresholdResult={thresholdResult}
      setTagFilterValid={setTagFilterValid}
      handleFormSubmit={() => handleFormSubmit(onCreate)}
      actionButtonLabel={getButtonLabel(editMode)}
      productArea={productAreas.websites_mobile_apps}
    />
  );
}

function handleFormSubmit(onCreate: (simpleMode: boolean) => void): void {
  onCreate(true);
}

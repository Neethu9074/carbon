/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo, useState } from 'react';
import { MapForm, Item } from 'formalistic';

//@ts-expect-error ts migartion
import { useIsTagFilterFormModelValid } from 'in-alerting/smart-alerts/synthetics/hooks/useIsTagFilterFormModelValid';
import {
  createBoundedAlertQueryBuilder,
  createIsAlertQueryValid
} from 'in-alerting/smart-alerts/mobileApp/components/AlertQueryBuilder';
import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
//@ts-expect-error
import useIsTagFilterFormModelExists from 'in-alerting/smart-alerts/applications/hooks/useIsTagFilterFormModelExists';
//@ts-expect-error TS migration
import useThresholdSuggestion from 'in-alerting/smart-alerts/eum/hooks/useThresholdSuggestion';
import { stepConfigsForCarbonTearSheet } from 'in-alerting/smart-alerts/mobileApp/TearSheet/steps/TearSheetStepConfigs';
import useAlertConfigValidation from 'in-alerting/smart-alerts/mobileApp/hooks/useAlertConfigValidation';
import { getBlueprintConfig, MetricName } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { MobileAppAlertRule, MobileAppAlertRuleUnion, ThresholdType, TimeConfig } from 'in-types';
import AlertingFullScreenTearSheet from 'in-alerting/components/AlertingFullScreenTearSheet';
import { getButtonLabel } from 'in-alerting/smart-alerts/mobileApp/data/sharedFunctions';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import createThresholdForm from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import { productAreas } from 'in-services/tracking/productAreas';
import { days } from 'in-services/time';

/**
 * Timeframe used for the tag-suggestions in QB2.
 */
export const tagSuggestionTimeConfig = {
  windowSize: days.toMillis(1),
  autoRefresh: true
};

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

export default function AlertConfigTearSheetWithThreshold(props: AlertConfigTearSheetWithThresholdProps) {
  const { editMode, tearSheetTitle, form, updateForm, onCreate } = props;

  const alertConfigWithFormModel = form.toJS();
  const { rule, tagFilterExpression, mobileAppId, threshold } = alertConfigWithFormModel;
  const { metricName, alertType } = rule as MobileAppAlertRuleUnion;

  const validThreshold = (threshold as any)?.warningThreshold ?? (threshold as any)?.criticalThreshold;

  const thresholdType = validThreshold?.type as ThresholdType;

  const blueprintConfig = getBlueprintConfig(alertType);
  const beaconType = blueprintConfig.getBeaconType(metricName as MetricName);

  const { isQueryValid, getTagCatalog } = useMemo(
    () =>
      createBoundedAlertQueryBuilder(
        mobileAppId as string | undefined,
        beaconType,
        thresholdType,
        tagSuggestionTimeConfig
      ),
    [mobileAppId, beaconType, thresholdType]
  );

  const isAlertQueryValid = createIsAlertQueryValid(isQueryValid);

  const updateTagFilterExpression = (filteredTagFilterExpression: FormModelElement[]) => {
    updateForm(form.updateIn(['tagFilterExpression'], f => f.setValue(filteredTagFilterExpression)));
  };

  useIsTagFilterFormModelExists(tagFilterExpression, getTagCatalog, updateTagFilterExpression);

  const isTagFilterFormModelValid = useIsTagFilterFormModelValid(tagFilterExpression, isAlertQueryValid);

  const [, setTagFilterValid] = useState(true);

  const [thresholdResult, setThresholdResult] = useState();

  // this hook will validate each step and prevents navigation
  const navItems = useAlertConfigValidation(
    stepConfigsForCarbonTearSheet,
    form,
    isTagFilterFormModelValid,
    thresholdResult,
    updateForm
  );

  const isValid = blueprintConfig.isRuleComplete(rule as MobileAppAlertRule) && isTagFilterFormModelValid;

  useThresholdSuggestion(form, updateForm, setThresholdResult, createThresholdForm, {
    isValid,
    simpleMode: false,
    alertConfigWithFormModel,
    blueprintConfig
  });

  return (
    <AlertingFullScreenTearSheet
      {...props}
      blueprintConfig={blueprintConfig}
      isTagFilterFormModelValid={isTagFilterFormModelValid}
      isEditMode={editMode}
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

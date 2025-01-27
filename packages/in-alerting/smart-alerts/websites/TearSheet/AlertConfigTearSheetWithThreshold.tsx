/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo, useState } from 'react';
import { MapForm } from 'formalistic';

import {
  createBoundedAlertQueryBuilder,
  createIsAlertQueryValid
} from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
// @ts-expect-error
import { useIsTagFilterFormModelValid } from 'in-alerting/smart-alerts/websites/hooks/useIsTagFilterFormModelValid';
//@ts-expect-error TS migration
import useThresholdSuggestion from 'in-alerting/smart-alerts/eum/hooks/useThresholdSuggestion';
import { stepConfigsForCarbonTearSheet } from 'in-alerting/smart-alerts/websites/TearSheet/steps/TearSheetStepConfigs';
import { Item, TimeConfig, WebsiteAlertConfigWithMetadata, WebsiteAlertRule, WebsiteAlertRuleUnion } from 'in-types';
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
  const { editMode, tearSheetTitle, form, updateForm } = props;

  const [, setTagFilterValid] = useState(true); //TODO

  const alertConfigWithFormModel = form.toJS() as unknown as WebsiteAlertConfigWithMetadata;

  const { rule, tagFilterExpression, websiteId, threshold } = alertConfigWithFormModel;

  const { metricName, alertType } = rule as WebsiteAlertRuleUnion;

  const blueprintConfig = getBlueprintConfig(alertType);

  const beaconType = blueprintConfig.getBeaconType(metricName as MetricName);

  // this hook will validate each step and prevents navigation
  const navItems = useAlertConfigValidation(stepConfigsForCarbonTearSheet);

  const { isQueryValid } = useMemo(
    () => createBoundedAlertQueryBuilder(websiteId, beaconType, threshold?.type, tagSuggestionTimeConfig),
    [websiteId, beaconType, threshold?.type]
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

  return (
    //@ts-expect-error TODO add `onChange` function
    <AlertingFullScreenTearSheet
      {...props}
      isTagFilterFormModelValid
      isEditMode={false}
      tearSheetTitle={tearSheetTitle}
      stepConfigs={navItems}
      thresholdResult={thresholdResult}
      setTagFilterValid={setTagFilterValid}
      handleFormSubmit={() => undefined}
      actionButtonLabel={getButtonLabel(editMode)}
      productArea={productAreas.websites_mobile_apps}
    />
  );
}

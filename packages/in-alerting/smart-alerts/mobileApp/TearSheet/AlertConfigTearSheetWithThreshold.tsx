/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';
import { MapForm } from 'formalistic';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import { stepConfigsForCarbonTearSheet } from 'in-alerting/smart-alerts/mobileApp/TearSheet/steps/TearSheetStepConfigs';
import useAlertConfigValidation from 'in-alerting/smart-alerts/mobileApp/hooks/useAlertConfigValidation';
import AlertingFullScreenTearSheet from 'in-alerting/components/AlertingFullScreenTearSheet';
import { getButtonLabel } from 'in-alerting/smart-alerts/mobileApp/data/sharedFunctions';
import { productAreas } from 'in-services/tracking/productAreas';
import { Item, TimeConfig } from 'in-types';

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
  const { editMode, tearSheetTitle } = props;

  const [, setTagFilterValid] = useState(true); //TODO
  // this hook will validate each step and prevents navigation
  const navItems = useAlertConfigValidation(stepConfigsForCarbonTearSheet);

  return (
    // @ts-expect-error TODO fix type error
    <AlertingFullScreenTearSheet
      {...props}
      isTagFilterFormModelValid
      isEditMode={false}
      tearSheetTitle={tearSheetTitle}
      stepConfigs={navItems}
      thresholdResult={undefined}
      setTagFilterValid={setTagFilterValid}
      handleFormSubmit={() => undefined}
      actionButtonLabel={getButtonLabel(editMode)}
      productArea={productAreas.websites_mobile_apps}
    />
  );
}

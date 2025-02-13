/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Item, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { TimeConfig } from '@instana/types';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import { stepConfigsForCarbonTearSheet } from 'in-alerting/smart-alerts/synthetics/tearsheet/steps/TearSheetStepConfigs';
import useAlertConfigValidation from 'in-alerting/smart-alerts/synthetics/hooks/useAlertConfigValidation';
import AlertingFullScreenTearSheet from 'in-alerting/components/AlertingFullScreenTearSheet';
import { productAreas } from 'in-services/tracking/productAreas';
import { t } from 'in-i18n';

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
  const { editMode, onCreate, tearSheetTitle } = props;

  const [, setTagFilterValid] = useState(true);

  const navItems = useAlertConfigValidation(stepConfigsForCarbonTearSheet);

  return (
    <AlertingFullScreenTearSheet
      {...props}
      isTagFilterFormModelValid
      isEditMode={editMode}
      tearSheetTitle={tearSheetTitle}
      stepConfigs={navItems}
      thresholdResult={null}
      setTagFilterValid={setTagFilterValid}
      handleFormSubmit={() => handleFormSubmit(onCreate)}
      actionButtonLabel={getButtonLabel(editMode)}
      productArea={productAreas.synthetic_monitoring}
    />
  );
}

function handleFormSubmit(onCreate: (simpleMode: boolean) => void): void {
  onCreate(true);
}

function getButtonLabel(editMode?: boolean): string {
  if (editMode) {
    return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonSave');
  }
  return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonCreate');
}

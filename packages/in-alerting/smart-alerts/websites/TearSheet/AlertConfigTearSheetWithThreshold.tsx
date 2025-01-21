/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AlertingFullScreenTearSheet from 'in-alerting/components/AlertingFullScreenTearSheet';
import { getButtonLabel } from 'in-alerting/smart-alerts/websites/TearSheet/sharedFunctions';
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

export default function AlertConfigTearSheetWithThreshold(props: any) {
  const { editMode, tearSheetTitle } = props;
  return (
    <AlertingFullScreenTearSheet
      {...props}
      isTagFilterFormModelValid
      isEditMode={false}
      tearSheetTitle={tearSheetTitle}
      stepConfigs={[]} // TODO
      thresholdResult={undefined}
      setTagFilterValid
      handleFormSubmit={() => undefined}
      actionButtonLabel={getButtonLabel(editMode)}
      productArea={productAreas.websites_mobile_apps}
    />
  );
}

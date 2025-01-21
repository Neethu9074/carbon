/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import AlertingFullScreenTearSheet from 'in-alerting/components/AlertingFullScreenTearSheet';
import { productAreas } from 'in-services/tracking/productAreas';
import { t } from 'in-i18n';

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

function getButtonLabel(editMode?: boolean): string {
  if (editMode) {
    return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonSave');
  }
  return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonCreate');
}

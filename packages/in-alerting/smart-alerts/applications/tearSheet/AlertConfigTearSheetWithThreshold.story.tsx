/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createField, createMapForm } from 'formalistic';
import React from 'react';

import AlertConfigTearSheetWithThreshold from 'in-alerting/smart-alerts/applications/tearSheet/AlertConfigTearSheetWithThreshold';

export default {
  component: AlertConfigTearSheetWithThreshold
};

export function Default() {
  return (
    <AlertConfigTearSheetWithThreshold
      form={dummyForm()}
      isGlobalSmartAlert
      withTrackCreate={() => undefined}
      withTrackClose={() => undefined}
      updateForm={() => undefined}
      isSaving={false}
    />
  );
}

const dummyForm = () => {
  return createMapForm().put(
    'rule',
    createField({
      value: { alertType: 'slowness' }
    })
  );
};

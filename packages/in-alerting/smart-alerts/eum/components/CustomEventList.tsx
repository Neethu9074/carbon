/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import MobileAppCustomEventsList from 'in-alerting/smart-alerts/mobileApp/components/CustomEventsList';
import WebsiteCustomEventsList from 'in-alerting/smart-alerts/websites/components/CustomEventsList';
import { eumType as mobileAppEum } from 'in-alerting/smart-alerts/mobileApp/constants';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import createThresholdForm from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { TimeConfig } from 'in-types';

export default function CustomEventList({
  eumType,
  form,
  timeConfig,
  updateForm
}: {
  eumType: string;
  form: MapForm<any>;
  timeConfig: TimeConfig;
  updateForm: (form: MapForm<any>) => void;
}) {
  const onValueChange = (value: string) => {
    let updatedForm = form.updateIn(['rule', 'customEventName'], f =>
      (f as Field<string>).setValue(value ?? '').setTouched(true)
    );

    const threshold = form.get('threshold').toJS();
    const thresholdWithHistoricBaseline = { ...threshold, type: HISTORIC_BASELINE };
    // @ts-ignore
    updatedForm = updatedForm
      .updateIn(['rule', 'customEventName'], (f: Field<string>) => f.setValue(value ?? '').setTouched(true))
      .put('threshold', createThresholdForm(thresholdWithHistoricBaseline, 'customEvent').setTouched(true));

    return updateForm(updatedForm);
  };
  return (
    <>
      {eumType === websiteEum && (
        <WebsiteCustomEventsList
          websiteId={form.get('websiteId').value}
          tagFilterExpression={form.get('tagFilterExpression').value}
          timeConfig={timeConfig}
          onCustomEventSelect={onValueChange}
          slideOut={() => undefined}
        />
      )}
      {eumType === mobileAppEum && (
        <MobileAppCustomEventsList
          mobileAppId={form.get('mobileAppId').value}
          tagFilterExpression={form.get('tagFilterExpression').value}
          timeConfig={timeConfig}
          onCustomEventSelect={onValueChange}
          slideOut={() => undefined}
        />
      )}
    </>
  );
}

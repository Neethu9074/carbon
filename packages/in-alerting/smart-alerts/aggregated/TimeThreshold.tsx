/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item, MapForm } from 'formalistic';
import React from 'react';

//@ts-expect-error TS migration required
import ConfigureAlertingThreshold from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/ConfigureAlertingThreshold';
import BorderedContainer from 'in-alerting/components/BorderedContainer';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/aggregated/TimeThreshold.mless';

export default function TimeThreshold({
  form,
  onChange,
  updateForm
}: {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  updateForm?: (form: MapForm<any>) => void;
}) {
  return (
    <BorderedContainer>
      <div className={locals.container}>
        <h3 className={locals.headline}>
          {t(
            'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigTimeThresholdTitleViolationsInSequence'
          )}
        </h3>
        <BorderedContainer>
          <ConfigureAlertingThreshold form={form} onChange={onChange} updateForm={updateForm} />
        </BorderedContainer>
      </div>
    </BorderedContainer>
  );
}

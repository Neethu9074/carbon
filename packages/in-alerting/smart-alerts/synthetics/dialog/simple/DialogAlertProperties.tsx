/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field } from 'formalistic';
import React from 'react';

// @ts-expect-error needs migration
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertPropertiesTitleRow';
import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogStep3.mless';

export default function DialogAlertProperties(props: AlertConfigDialogPresenterProps & MainDialogControl) {
  const { form, onChange } = props;
  return (
    <SimpleModeStepContentWrapper headline={t('in-alerting:smartAlerts.synthetics.simple.alertDialogHeadline')}>
      <div className={locals.alertChannelsContainer}>
        <AlertProperties
          form={form}
          onChange={onChange}
          getDescriptionPlaceholder={() => 'some Description'}
          getPreviewTitlePlaceholder={() => 'some Preview Title'}
          renderAlertPopertiesTitleRow={() => (
            <AlertPropertiesTitleRow
              form={form}
              onChange={onChange}
              getTitlePlaceholder={() => (form.get('name') as Field<string>).value ?? 'undefined'}
              placeholders={[]}
            />
          )}
        />
      </div>
    </SimpleModeStepContentWrapper>
  );
}

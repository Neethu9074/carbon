/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SelectAlertChannel from 'in-alerting/smart-alerts/components/smart-alert-dialog/SelectAlertChannel';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/simple/SimpleAlertConfigDialogStep3.mless';

export default function SimpleAlertConfigDialogStep3({ form, onChange, setAlertChannelsVisible }) {
  return (
    <SimpleModeStepContentWrapper
      headline={t('in-new-components:alerting.simple.simpleAlertConfigDialogStep3Headline')}
    >
      <div className={locals.alertChannelsContainer}>
        <SelectAlertChannel form={form} onChange={onChange} setAlertChannelsVisible={setAlertChannelsVisible} />
      </div>
    </SimpleModeStepContentWrapper>
  );
}

SimpleAlertConfigDialogStep3.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  setAlertChannelsVisible: PropTypes.func.isRequired
};

import PropTypes from 'prop-types';
import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/Alerting/components/SimpleModeStepContentWrapper';
import SimpleAlertConfigDialogChart from 'in-websites/alerting/simple/SimpleAlertConfigDialogChart';
import AlertLocationFilters from 'in-websites/alerting/components/AlertLocationFilters';

import locals from './SimpleAlertConfigDialogStep2.mless';

export default function SimpleAlertConfigDialogStep2({ form, granularity, timeConfig, websiteLabel, updateForm }) {
  return (
    <SimpleModeStepContentWrapper headline="Where do you want the alert to trigger?">
      <div className={locals.alertLocationFiltersWrapper}>
        <AlertLocationFilters form={form} websiteLabel={websiteLabel} timeConfig={timeConfig} updateForm={updateForm} />
      </div>

      <SimpleAlertConfigDialogChart form={form} granularity={granularity} timeConfig={timeConfig} />
    </SimpleModeStepContentWrapper>
  );
}

SimpleAlertConfigDialogStep2.propTypes = {
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  updateForm: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  websiteLabel: PropTypes.string.isRequired
};

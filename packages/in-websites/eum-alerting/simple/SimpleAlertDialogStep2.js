import PropTypes from 'prop-types';
import React from 'react';

import AlertLocationFilters from 'in-websites/eum-alerting/simple/AlertLocationFilters';
import JsErrorsChart from 'in-websites/eum-alerting/simple/JsErrorsChart';

import locals from './SimpleAlertDialogStep.mless';

export default function SimpleAlertDialogStep2({ form, timeConfig, websiteLabel, onChange }) {
  return (
    <>
      <h1 className={locals.headline}>Where do you want the alert to trigger?</h1>
      <AlertLocationFilters form={form} websiteLabel={websiteLabel} timeConfig={timeConfig} onChange={onChange} />
      <JsErrorsChart form={form} timeConfig={timeConfig} />
    </>
  );
}

SimpleAlertDialogStep2.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  websiteLabel: PropTypes.string.isRequired
};

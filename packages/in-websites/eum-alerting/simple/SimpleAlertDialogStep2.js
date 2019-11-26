import PropTypes from 'prop-types';
import React from 'react';

import AlertLocationFilters from 'in-websites/eum-alerting/simple/AlertLocationFilters';
import JsErrorsChart from 'in-websites/eum-alerting/simple/JsErrorsChart';

import locals from './SimpleAlertDialogStep.mless';

export default function SimpleAlertDialogStep2({ form, granularity, onChange, timeConfig, websiteLabel }) {
  return (
    <>
      <h1 className={locals.headline}>Where do you want the alert to trigger?</h1>
      <AlertLocationFilters form={form} websiteLabel={websiteLabel} timeConfig={timeConfig} onChange={onChange} />
      <JsErrorsChart form={form} timeConfig={timeConfig} onChange={onChange} granularity={granularity} />
    </>
  );
}

SimpleAlertDialogStep2.propTypes = {
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  websiteLabel: PropTypes.string.isRequired
};

import PropTypes from 'prop-types';
import React from 'react';

import AlertLocationFilters from 'in-websites/AlertConfigDialog/simple/AlertLocationFilters';
import JsErrorsChart from 'in-websites/AlertConfigDialog/simple/JsErrorsChart';

import locals from './SimpleAlertDialogStep.mless';

export default function SimpleAlertDialogStep2({ form, timeConfig }) {
  return (
    <>
      <h1 className={locals.headline}>Where do you want the alert to trigger?</h1>
      <AlertLocationFilters form={form} timeConfig={timeConfig} />
      <JsErrorsChart form={form} />
    </>
  );
}

SimpleAlertDialogStep2.propTypes = {
  form: PropTypes.object.isRequired,
  timeConfig: PropTypes.object.isRequired
};

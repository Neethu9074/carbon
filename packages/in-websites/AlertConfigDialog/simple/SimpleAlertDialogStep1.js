import PropTypes from 'prop-types';
import React from 'react';

import SelectAlertForJsError from './SelectAlertForJsError/SelectAlertForJsError';
import JsErrorsChart from 'in-websites/AlertConfigDialog/simple/JsErrorsChart';
import Menu from 'in-websites/AlertConfigDialog/components/Menu';

import locals from './SimpleAlertDialogStep.mless';

const itemLabels = ['Specific JS Error(s)'];

export default function SimpleAlertDialogStep1({ form, onChange }) {
  return (
    <>
      <h1 className={locals.headline}>What do you want to be alerted on?</h1>
      <Menu itemLabels={itemLabels} itemClickTracker={() => {}} addRightSeperator />
      <SelectAlertForJsError form={form} onChange={onChange} />
      <JsErrorsChart form={form} />
    </>
  );
}

SimpleAlertDialogStep1.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

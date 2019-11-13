import PropTypes from 'prop-types';
import React from 'react';

import SelectAlertForJsError from './SelectAlertForJsError/SelectAlertForJsError';
import JsErrorsChart from 'in-websites/eum-alerting/simple/JsErrorsChart';
import Menu from 'in-websites/eum-alerting/components/Menu';

import locals from './SimpleAlertDialogStep.mless';

const itemLabels = ['Specific JS Error(s)'];

export default function SimpleAlertDialogStep1({ form, onChange, timeConfig, setJsErrorsListVisible }) {
  return (
    <>
      <h1 className={locals.headline}>What do you want to be alerted on?</h1>
      <Menu itemLabels={itemLabels} itemClickTracker={() => {}} addRightSeperator />
      <SelectAlertForJsError
        form={form}
        onChange={onChange}
        timeConfig={timeConfig}
        onSelectJsError={setJsErrorsListVisible}
      />
      <JsErrorsChart form={form} onChange={onChange} timeConfig={timeConfig} />
    </>
  );
}

SimpleAlertDialogStep1.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired
};

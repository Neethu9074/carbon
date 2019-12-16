import PropTypes from 'prop-types';
import React from 'react';

import SelectAlertChannel from 'in-websites/eum-alerting/components/SelectAlertChannel';

import locals from './SimpleAlertConfigDialogStep.mless';

export default function SimpleAlertConfigDialogStep3({ form, onChange, setAlertChannelsVisible }) {
  return (
    <>
      <h1 className={locals.headline}>Who should get the alerts?</h1>
      <div className={locals.alertChannelsContainer}>
        <SelectAlertChannel form={form} onChange={onChange} setAlertChannelsVisible={setAlertChannelsVisible} />
      </div>
    </>
  );
}

SimpleAlertConfigDialogStep3.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  setAlertChannelsVisible: PropTypes.func.isRequired
};

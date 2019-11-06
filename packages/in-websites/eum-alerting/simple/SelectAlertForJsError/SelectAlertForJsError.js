import PropTypes from 'prop-types';
import React from 'react';

import { ProvideManualPattern } from './ProvideManualPattern';

import locals from './SelectAlertForJsError.mless';

export default function SelectAlertForJsError({ form, onChange, onSelectJsError, timeConfig }) {
  return (
    <div className={locals.container}>
      <h2 className={locals.headline}>Automatic Alert for Specific JS Error(s)</h2>
      <p className={locals.description}>
        You will be alerted every time specific JS Error messages occur more often than normal.
      </p>
      <ProvideManualPattern form={form} onChange={onChange} timeConfig={timeConfig} onSelectJsError={onSelectJsError} />
    </div>
  );
}

SelectAlertForJsError.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  onSelectJsError: PropTypes.func.isRequired
};

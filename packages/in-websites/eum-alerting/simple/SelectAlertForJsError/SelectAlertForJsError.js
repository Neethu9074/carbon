import PropTypes from 'prop-types';
import React from 'react';

import TabSwitch from 'in-websites/eum-alerting/components/TabSwitch';
import { ProvideManualPattern } from './ProvideManualPattern';

import locals from './SelectAlertForJsError.mless';

export default function SelectAlertForJsError({ form, onChange }) {
  return (
    <div className={locals.container}>
      <h2 className={locals.headline}>Automatic Alert for Specific JS Error(s)</h2>
      <p className={locals.description}>
        You will be alerted every time specific JS Errors occur more often than normal.
      </p>
      <TabSwitch
        tabs={[
          {
            label: 'Provide Manual Pattern',
            element: <ProvideManualPattern form={form} onChange={onChange} />
          }
        ]}
      />
    </div>
  );
}

SelectAlertForJsError.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

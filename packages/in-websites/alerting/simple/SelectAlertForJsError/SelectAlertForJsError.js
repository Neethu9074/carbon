import React from 'react';

import { alertingDialogItemPickerTimeframe } from 'in-websites/alerting/constants';
import ProvideJsError from 'in-websites/alerting/components/ProvideJsError';
import { modeSimple } from 'in-websites/alerting/constants';

import locals from './SelectAlertForJsError.mless';

export default function SelectAlertForJsError(props) {
  return (
    <div className={locals.container}>
      <h2 className={locals.headline}>Automatic Alert for Specific JS Error(s)</h2>
      <p className={locals.description}>
        You will be alerted every time matching JS Error messages occur more often than normal.
      </p>
      <ProvideJsError
        {...props}
        mode={modeSimple}
        timeConfig={{
          windowSize: alertingDialogItemPickerTimeframe
        }}
      />
    </div>
  );
}

import React from 'react';

import ProvideManualPattern from 'in-websites/eum-alerting/components/ProvideManualPattern';
import { modeSimple } from 'in-websites/eum-alerting/constants';

import locals from './SelectAlertForJsError.mless';

export default function SelectAlertForJsError(props) {
  return (
    <div className={locals.container}>
      <h2 className={locals.headline}>Automatic Alert for Specific JS Error(s)</h2>
      <p className={locals.description}>
        You will be alerted every time matching JS Error messages occur more often than normal.
      </p>
      <ProvideManualPattern {...props} mode={modeSimple} />
    </div>
  );
}

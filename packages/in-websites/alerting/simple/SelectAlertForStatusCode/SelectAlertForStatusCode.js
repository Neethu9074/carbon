import React from 'react';

import ProvideStatusCode from 'in-websites/alerting/components/ProvideStatusCode';
import { modeSimple } from 'in-websites/alerting/constants';

import locals from '../SelectAlertForJsError/SelectAlertForJsError.mless';

export default function SelectAlertForStatusCode(props) {
  return (
    <div className={locals.container}>
      <h2 className={locals.headline}>Automatic Alert for Specific Status Code(s)</h2>
      <p className={locals.description}>
        You will be alerted every time matching HTTP Status Codes occur more often than normal.
      </p>
      <ProvideStatusCode {...props} mode={modeSimple} />
    </div>
  );
}

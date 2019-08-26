import React, { Fragment } from 'react';

import LogDnaButton from 'in-integrations/logging/logdna/LogDnaButton';
import HumioButton from 'in-integrations/logging/humio/HumioButton';

export default function LoggingIntegrationButtons(props) {
  return (
    <Fragment>
      <HumioButton {...props} />
      <LogDnaButton {...props} />
    </Fragment>
  );
}

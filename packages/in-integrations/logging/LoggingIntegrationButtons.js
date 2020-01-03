import React from 'react';

import CoralogixButton from 'in-integrations/logging/coralogix/CoralogixButton';
import LogDnaButton from 'in-integrations/logging/logdna/LogDnaButton';
import SplunkButton from 'in-integrations/logging/splunk/SplunkButton';
import HumioButton from 'in-integrations/logging/humio/HumioButton';
import { coralogixEnabled } from 'in-services/featureFlags';
import MultiButton from 'in-new-components/MultiButton';

export default function LoggingIntegrationButtons(props) {
  const integrations = [
    coralogixEnabled && <CoralogixButton {...props} />,
    <HumioButton {...props} />,
    <SplunkButton {...props} />,
    <LogDnaButton {...props} />
  ].filter(Boolean);

  return <MultiButton label="Go To Logs" icon="lib_application_logging" buttons={integrations} />;
}

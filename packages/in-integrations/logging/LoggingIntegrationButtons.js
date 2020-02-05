import React from 'react';

import CoralogixButton, {
  shouldShowButton as showCoralogixButton
} from 'in-integrations/logging/coralogix/CoralogixButton';
import LogDnaButton, { shouldShowButton as showLogDnaButton } from 'in-integrations/logging/logdna/LogDnaButton';
import SplunkButton, { shouldShowButton as showSplunkButton } from 'in-integrations/logging/splunk/SplunkButton';
import HumioButton, { shouldShowButton as showHumioButton } from 'in-integrations/logging/humio/HumioButton';
import ElkButton, { shouldShowButton as showElkButton } from 'in-integrations/logging/elk/ElkButton';
import { integrationKey as coralogixIntegrationKey } from 'in-integrations/logging/coralogix/consts';
import { integrationKey as logdnaIntegrationKey } from 'in-integrations/logging/logdna/consts';
import { integrationKey as splunkIntegrationKey } from 'in-integrations/logging/splunk/consts';
import { integrationKey as humioIntegrationKey } from 'in-integrations/logging/humio/consts';
import { integrationKey as elkIntegrationKey } from 'in-integrations/logging/elk/consts';
import { getIntegrationConfiguration } from 'in-integrations/logging/configurationsStore';
import MultiButton from 'in-new-components/MultiButton';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  coralogixIntegration: getIntegrationConfiguration(coralogixIntegrationKey),
  logdnaIntegration: getIntegrationConfiguration(logdnaIntegrationKey),
  splunkIntegration: getIntegrationConfiguration(splunkIntegrationKey),
  humioIntegration: getIntegrationConfiguration(humioIntegrationKey),
  elkIntegration: getIntegrationConfiguration(elkIntegrationKey)
})(function LoggingIntegrationButtons(props) {
  const { coralogixIntegration, logdnaIntegration, splunkIntegration, humioIntegration, elkIntegration } = props;

  const integrations = [
    showCoralogixButton(props) &&
      coralogixIntegration &&
      coralogixIntegration.enabled && <CoralogixButton {...props} />,
    showHumioButton(props) && humioIntegration && humioIntegration.enabled && <HumioButton {...props} />,
    showLogDnaButton(props) && logdnaIntegration && logdnaIntegration.enabled && <LogDnaButton {...props} />,
    showSplunkButton(props) && splunkIntegration && splunkIntegration.enabled && <SplunkButton {...props} />,
    showElkButton(props) && elkIntegration && elkIntegration.enabled && <ElkButton {...props} />
  ].filter(Boolean);

  return <MultiButton label="Go To Logs" icon="lib_application_logging" buttons={integrations} />;
});

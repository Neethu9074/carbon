import React from 'react';

import LogDnaButton, { shouldShowButton as shouldShowLogDnaButton } from 'in-integrations/logging/logdna/LogDnaButton';
import SplunkButton, { shouldShowButton as shouldShowSplunkButton } from 'in-integrations/logging/splunk/SplunkButton';
import HumioButton, { shouldShowButton as shouldShowHumioButton } from 'in-integrations/logging/humio/HumioButton';
import { integrationKey as logdnaIntegrationKey } from 'in-integrations/logging/logdna/consts';
import { integrationKey as splunkIntegrationKey } from 'in-integrations/logging/splunk/consts';
import { integrationKey as humioIntegrationKey } from 'in-integrations/logging/humio/consts';
import { getIntegrationConfiguration } from 'in-integrations/logging/configurationsStore';

import MultiButton from 'in-new-components/MultiButton';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  humioIntegrationConfiguration: getIntegrationConfiguration(humioIntegrationKey),
  splunkIntegrationConfiguration: getIntegrationConfiguration(splunkIntegrationKey),
  logdnaIntegrationConfiguration: getIntegrationConfiguration(logdnaIntegrationKey)
})(LoggingIntegrationButtons);

function LoggingIntegrationButtons(props) {
  const { humioIntegrationConfiguration, splunkIntegrationConfiguration, logdnaIntegrationConfiguration } = props;

  const integrations = [];

  // Add buttons in this order based on user's configuration
  if (humioIntegrationConfiguration && humioIntegrationConfiguration.enabled && shouldShowHumioButton(props)) {
    integrations.push(<HumioButton {...props} />);
  }
  if (splunkIntegrationConfiguration && splunkIntegrationConfiguration.enabled && shouldShowSplunkButton(props)) {
    integrations.push(<SplunkButton {...props} />);
  }
  if (logdnaIntegrationConfiguration && logdnaIntegrationConfiguration.enabled && shouldShowLogDnaButton(props)) {
    integrations.push(<LogDnaButton {...props} />);
  }

  return <MultiButton label="Go To Logs" icon="lib_application_logging" buttons={integrations} />;
}

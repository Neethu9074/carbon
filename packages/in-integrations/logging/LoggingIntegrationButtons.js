/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
import { getIntegrationConfiguration } from 'in-integrations/logging/configurationsStore';
import { integrationKey as elkIntegrationKey } from 'in-integrations/logging/elk/consts';
import MultiButton from 'in-new-components/MultiButton';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(getObservables())(LoggingIntegrationButtonsRenderer);

export function getObservables() {
  return {
    coralogixIntegration: getIntegrationConfiguration(coralogixIntegrationKey),
    elkIntegration: getIntegrationConfiguration(elkIntegrationKey),
    humioIntegration: getIntegrationConfiguration(humioIntegrationKey),
    logdnaIntegration: getIntegrationConfiguration(logdnaIntegrationKey),
    splunkIntegration: getIntegrationConfiguration(splunkIntegrationKey)
  };
}

export function LoggingIntegrationButtonsRenderer(props) {
  /*
    Keep the list sorted alphabetically
   */
  const { coralogixIntegration, elkIntegration, humioIntegration, logdnaIntegration, splunkIntegration } = props;

  const integrations = [
    showCoralogixButton(props) && coralogixIntegration && coralogixIntegration.enabled && (
      <CoralogixButton {...props} />
    ),
    showElkButton(props) && elkIntegration && elkIntegration.enabled && <ElkButton {...props} />,
    showHumioButton(props) && humioIntegration && humioIntegration.enabled && <HumioButton {...props} />,
    showLogDnaButton(props) && logdnaIntegration && logdnaIntegration.enabled && <LogDnaButton {...props} />,
    showSplunkButton(props) && splunkIntegration && splunkIntegration.enabled && <SplunkButton {...props} />
  ].filter(Boolean);

  return <MultiButton label={t('in-integrations:logging.goToLogs')}  kind="secondary" icon="lib_application_logging" buttons={integrations} />;
}

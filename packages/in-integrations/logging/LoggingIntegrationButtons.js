/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { CarbonMenuButton } from '@instana/components';

import CoralogixButton, {
  shouldShowButton as showCoralogixButton
} from 'in-integrations/logging/coralogix/CoralogixButton';
import SplunkButton, { shouldShowButton as showSplunkButton } from 'in-integrations/logging/splunk/SplunkButton';
import MezmoButton, { shouldShowButton as showMezmoButton } from 'in-integrations/logging/mezmo/MezmoButton';
import HumioButton, { shouldShowButton as showHumioButton } from 'in-integrations/logging/humio/HumioButton';
import ElkButton, { shouldShowButton as showElkButton } from 'in-integrations/logging/elk/ElkButton';
import { integrationKey as coralogixIntegrationKey } from 'in-integrations/logging/coralogix/consts';
import { integrationKey as splunkIntegrationKey } from 'in-integrations/logging/splunk/consts';
import { integrationKey as mezmoIntegrationKey } from 'in-integrations/logging/mezmo/consts';
import { integrationKey as humioIntegrationKey } from 'in-integrations/logging/humio/consts';
import { getIntegrationConfiguration } from 'in-integrations/logging/configurationsStore';
import { integrationKey as elkIntegrationKey } from 'in-integrations/logging/elk/consts';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from 'in-integrations/logging/LoggingIntegrationButtons.mless';

export default connectTo(getObservables())(LoggingIntegrationButtonsRenderer);

export function getObservables() {
  return {
    coralogixIntegration: getIntegrationConfiguration(coralogixIntegrationKey),
    elkIntegration: getIntegrationConfiguration(elkIntegrationKey),
    humioIntegration: getIntegrationConfiguration(humioIntegrationKey),
    mezmoIntegration: getIntegrationConfiguration(mezmoIntegrationKey),
    splunkIntegration: getIntegrationConfiguration(splunkIntegrationKey)
  };
}

export function LoggingIntegrationButtonsRenderer({ addMargin, ...props }) {
  /*
    Keep the list sorted alphabetically
   */
  const { coralogixIntegration, elkIntegration, humioIntegration, mezmoIntegration, splunkIntegration } = props;
  const integrations = [
    showCoralogixButton(props) && coralogixIntegration && coralogixIntegration.enabled && (
      <CoralogixButton {...props} />
    ),
    showElkButton(props) && elkIntegration && elkIntegration.enabled && <ElkButton {...props} />,
    showHumioButton(props) && humioIntegration && humioIntegration.enabled && <HumioButton {...props} />,
    showMezmoButton(props) && mezmoIntegration && mezmoIntegration.enabled && <MezmoButton {...props} />,
    showSplunkButton(props) && splunkIntegration && splunkIntegration.enabled && <SplunkButton {...props} />
  ].filter(Boolean);

  if (integrations.length === 0) {
    return null;
  }

  return (
    <CarbonMenuButton
      className={classNames({
        [locals.gotoLogsButton]: addMargin
      })}
      size="sm"
      label={t('in-integrations:logging.goToLogs')}
      kind="tertiary"
    >
      {integrations}
    </CarbonMenuButton>
  );
}

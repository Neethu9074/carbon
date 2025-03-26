/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import { useRef } from 'react';
import React from 'react';

import { CarbonMenuButton } from '@instana/components';

import FalconLogScaleButton, {
  shouldShowButton as showFalconLogScaleButton
} from 'in-integrations/logging/falconLogScale/FalconLogScaleButton';
import CoralogixButton, {
  shouldShowButton as showCoralogixButton
} from 'in-integrations/logging/coralogix/CoralogixButton';
import SplunkButton, { shouldShowButton as showSplunkButton } from 'in-integrations/logging/splunk/SplunkButton';
import { integrationKey as falconLogScaleIntegrationKey } from 'in-integrations/logging/falconLogScale/consts';
import MezmoButton, { shouldShowButton as showMezmoButton } from 'in-integrations/logging/mezmo/MezmoButton';
import ElkButton, { shouldShowButton as showElkButton } from 'in-integrations/logging/elk/ElkButton';
import { integrationKey as coralogixIntegrationKey } from 'in-integrations/logging/coralogix/consts';
import { integrationKey as splunkIntegrationKey } from 'in-integrations/logging/splunk/consts';
import { integrationKey as mezmoIntegrationKey } from 'in-integrations/logging/mezmo/consts';
import { getIntegrationConfiguration } from 'in-integrations/logging/configurationsStore';
import { integrationKey as elkIntegrationKey } from 'in-integrations/logging/elk/consts';
import AnalyzeLogsButton from 'in-integrations/logging/analyzeLogs/analyzeLogsButton';
import useTimeConfig from 'in-hooks/useTimeConfig';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from 'in-integrations/logging/LoggingIntegrationButtons.mless';

export default connectTo(getObservables())(LoggingIntegrationButtonsRenderer);

export function getObservables() {
  return {
    coralogixIntegration: getIntegrationConfiguration(coralogixIntegrationKey),
    elkIntegration: getIntegrationConfiguration(elkIntegrationKey),
    falconLogScaleIntegration: getIntegrationConfiguration(falconLogScaleIntegrationKey),
    mezmoIntegration: getIntegrationConfiguration(mezmoIntegrationKey),
    splunkIntegration: getIntegrationConfiguration(splunkIntegrationKey)
  };
}

export function LoggingIntegrationButtonsRenderer({ addMargin, tagFilter, ...props }) {
  const menuContainerRef = useRef(null);
  const timeConfig = useTimeConfig();
  const { coralogixIntegration, elkIntegration, falconLogScaleIntegration, mezmoIntegration, splunkIntegration } =
    props;

  // Keep the list sorted alphabetically
  const integrations = [
    showCoralogixButton(props) && coralogixIntegration && coralogixIntegration.enabled && (
      <CoralogixButton {...props} />
    ),
    showElkButton(props) && elkIntegration && elkIntegration.enabled && <ElkButton {...props} />,
    showFalconLogScaleButton(props) && falconLogScaleIntegration && falconLogScaleIntegration.enabled && (
      <FalconLogScaleButton {...props} />
    ),
    showMezmoButton(props) && mezmoIntegration && mezmoIntegration.enabled && <MezmoButton {...props} />,
    showSplunkButton(props) && splunkIntegration && splunkIntegration.enabled && <SplunkButton {...props} />
  ].filter(Boolean);

  if (integrations.length === 0) {
    return null;
  }

  integrations.unshift(<AnalyzeLogsButton tagFilter={tagFilter} timeConfig={timeConfig} />);

  const integrationsWithKeys = integrations.map((item, i) => React.cloneElement(item, { key: `integration-${i}` }));

  return (
    <CarbonMenuButton
      className={classNames({
        [locals.gotoLogsButton]: addMargin,
        [locals.divisoryLine]: true
      })}
      ref={menuContainerRef}
      menuTarget={menuContainerRef.current}
      size="sm"
      label={t('in-integrations:logging.goToLogs')}
      kind="tertiary"
    >
      {integrationsWithKeys}
    </CarbonMenuButton>
  );
}

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Toggle, Spacer, Ul, Li, Button, KeyValue } from '@instana/components';

import Overlay from 'in-components/overlays/Overlay';
import ButtonGroup from 'in-components/ButtonGroup';
import { t } from 'in-i18n';

import locals from './SettingsButton.mless';

export default function SettingsButton(props) {
  return (
    <Overlay align="bottomRight" content={SettingsContent} props={props}>
      {({ toggle }) => <Button kind="secondary" icon="lib_actions_settings" onClick={toggle} />}
    </Overlay>
  );
}

function SettingsContent({
  showServiceInformation,
  setShowServiceInformation,
  disableShowServiceInformation,
  colorCodeType,
  setColorCodeMechanism,
  showSubCallBars,
  setShowSubCallBars,
  activeView
}) {
  return (
    <Ul className={locals.overlayContent} framed={false}>
      <Li>
        <KeyValue
          label={t('in-analyze:traceDetail.components.colorCodingToggleButtons.colorizeByExpl')}
          value={t('in-analyze:traceDetail.components.colorCodingToggleButtons.colorizeBy')}
          accentuated
          inverted
        />
        <ButtonGroup
          buttonPropsList={[
            {
              text: t('in-analyze:traceDetail.components.colorCodingToggleButtons.service'),
              key: 'byService',
              onClick: () => setColorCodeMechanism('byService')
            },
            {
              text: t('in-analyze:traceDetail.components.colorCodingToggleButtons.endpoint'),
              key: 'byEndpoint',
              onClick: () => setColorCodeMechanism('byEndpoint')
            },
            {
              text: t('in-analyze:traceDetails.buttonTechnology'),
              key: 'byEndpointType',
              onClick: () => setColorCodeMechanism('byEndpointType')
            }
          ]}
          activeKey={colorCodeType}
        />
      </Li>

      <Li>
        <KeyValue
          label={t('in-applications:traceDetail.tabs.calls.settings.showServiceInformationExpl')}
          value={t('in-applications:traceDetail.tabs.calls.settings.showServiceInformation')}
          accentuated
          inverted
        />
        <Spacer horizontal="xxsmall" />
        <Toggle
          checked={showServiceInformation}
          onChange={() => setShowServiceInformation(!showServiceInformation)}
          disabled={disableShowServiceInformation || activeView === 'chart'}
        />
      </Li>

      <Li>
        <KeyValue
          label={t('in-applications:traceDetail.tabs.calls.settings.showSubCallsExpl')}
          value={t('in-applications:traceDetail.tabs.calls.settings.showSubCalls')}
          accentuated
          inverted
        />
        <Spacer horizontal="xxsmall" />
        <Toggle
          checked={showSubCallBars}
          onChange={() => setShowSubCallBars(!showSubCallBars)}
          disabled={activeView === 'chart'}
        />
      </Li>
    </Ul>
  );
}

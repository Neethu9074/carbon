/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { CarbonMenuButton, CarbonMenuItem, Stack, PreviewPill } from '@instana/components';

import {
  SETTINGS_ALERT_CHANNEL_ADD_CLICK,
  SETTINGS_ALERT_CHANNEL_ADD_MENU_CLICK
} from 'in-services/tracking/eventNames';
import configs from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { alertChannelCTATrackerSegment } from 'in-settings/tracker';
import { goToAlertChannelView } from 'in-settings/navigation/paths';
import { t } from 'in-i18n';

import locals from './NewChannelButton.mless';

export default function NewChannelButton() {
  const { location } = useNavigation();
  return (
    <CarbonMenuButton
      kind="ghost"
      className={locals.createNewButton}
      menuAlignment="bottom-end"
      size="sm"
      label={t('in-settings:tabs.addAlertChannel')}
      onClick={() => {
        alertChannelCTATrackerSegment({
          EVENT_NAME: SETTINGS_ALERT_CHANNEL_ADD_MENU_CLICK,
          path: location.pathname,
          channel: 'alert channel'
        });
      }}
    >
      {Object.keys(configs).map(kind => (
        <AlertChannelButton type={kind} />
      ))}
    </CarbonMenuButton>
  );
}

function AlertChannelButton({ type }) {
  const { location } = useNavigation();
  return (
    configs[type].active !== false && (
      <CarbonMenuItem
        // adjusting z-index to keep the entries behinder header navbar while scrolling
        // see styles in less file
        className="alertChannelButtonMenu"
        onClick={() => {
          goToAlertChannelView(type);
          alertChannelCTATrackerSegment({
            EVENT_NAME: SETTINGS_ALERT_CHANNEL_ADD_CLICK,
            path: location.pathname,
            channel: configs[type].label
          });
        }}
        label={
          <Stack direction="horizontal" align="center" distribution="spaceBetween" gap="normal">
            {configs[type].label}
            {configs[type].isAlpha && <PreviewPill privatePreview />}
            {configs[type].isBeta && <PreviewPill />}
          </Stack>
        }
      />
    )
  );
}

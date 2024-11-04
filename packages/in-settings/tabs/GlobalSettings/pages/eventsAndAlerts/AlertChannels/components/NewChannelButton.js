/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Button, CarbonMenuButton, CarbonMenuItem, Stack, PreviewPill } from '@instana/components';

import {
  clickAddAlertChannelTracker,
  clickAddAlertChannelMenuTracker,
  alertChannelCTATrackerSegment
} from 'in-settings/tracker';
import {
  SETTINGS_ALERT_CHANNEL_ADD_CLICK,
  SETTINGS_ALERT_CHANNEL_ADD_MENU_CLICK
} from 'in-services/tracking/eventNames';
import configs from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { goToAlertChannelView } from 'in-settings/navigation/paths';
import { carbonButtonEnabled } from 'in-services/featureFlags';
import MultiButton from 'in-components/MultiButton';
import { t } from 'in-i18n';

import locals from './NewChannelButton.mless';

export default function NewChannelButton(props) {
  const { location } = useNavigation();
  if (carbonButtonEnabled) {
    return (
      <CarbonMenuButton
        kind="ghost"
        className={locals.createNewButton}
        menuAlignment="bottom-end"
        size="sm"
        label={t('in-settings:tabs.addAlertChannel')}
        onClick={() => {
          clickAddAlertChannelMenuTracker();
          alertChannelCTATrackerSegment({
            EVENT_NAME: SETTINGS_ALERT_CHANNEL_ADD_MENU_CLICK,
            path: location.pathname,
            channel: 'alert channel'
          });
        }}
      >
        {Object.keys(configs).map(kind => (
          <AlertChannelButton type={kind} {...props} />
        ))}
      </CarbonMenuButton>
    );
  }
  return (
    <MultiButton
      className={locals.createNewButton}
      kind="action"
      icon="lib_openclose_add_circle_outline"
      label={t('in-settings:tabs.addAlertChannel')}
      trackEventDropdown={() => {
        clickAddAlertChannelMenuTracker();
        alertChannelCTATrackerSegment({
          EVENT_NAME: SETTINGS_ALERT_CHANNEL_ADD_MENU_CLICK,
          path: location.pathname,
          channel: 'alert channel'
        });
      }}
      buttons={Object.keys(configs).map(kind => (
        <AlertChannelButton type={kind} {...props} />
      ))}
    />
  );
}

function AlertChannelButton({ type, className }) {
  const { location } = useNavigation();
  if (carbonButtonEnabled) {
    return (
      configs[type].active !== false && (
        <CarbonMenuItem
          className={classNames({
            [className]: className,
            ['alertChannelButtonMenu']: true
          })}
          onClick={() => {
            goToAlertChannelView(type);
            clickAddAlertChannelTracker({ alertChannelType: configs[type].label });
            alertChannelCTATrackerSegment({
              EVENT_NAME: SETTINGS_ALERT_CHANNEL_ADD_CLICK,
              path: location.pathname,
              channel: configs[type].label
            });
          }}
          label={
            <div className={locals.menuButtonItem}>
              <Stack direction="horizontal" align="center" distribution="spaceBetween" gap="normal">
                {configs[type].label}
                {configs[type].isAlpha && (
                  <div className={locals.betaBadge}>
                    <PreviewPill privatePreview />
                  </div>
                )}
                {configs[type].isBeta && (
                  <div className={locals.betaBadge}>
                    <PreviewPill />
                  </div>
                )}
              </Stack>
            </div>
          }
        />
      )
    );
  }
  return (
    configs[type].active !== false && (
      <Button
        className={classNames({
          [locals.alertChannelButton]: true,
          [className]: className
        })}
        kind="secondary"
        onClick={() => {
          goToAlertChannelView(type);
          clickAddAlertChannelTracker({ alertChannelType: configs[type].label });
          alertChannelCTATrackerSegment({
            EVENT_NAME: SETTINGS_ALERT_CHANNEL_ADD_CLICK,
            path: location.pathname,
            channel: configs[type].label
          });
        }}
      >
        {configs[type].label}
        {configs[type].isAlpha && (
          <div className={locals.betaBadge}>
            <PreviewPill privatePreview />
          </div>
        )}
        {configs[type].isBeta && (
          <div className={locals.betaBadge}>
            <PreviewPill />
          </div>
        )}
      </Button>
    )
  );
}

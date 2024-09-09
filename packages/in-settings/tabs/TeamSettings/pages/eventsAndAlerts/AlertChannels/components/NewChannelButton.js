/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Button } from '@instana/legacy';

import {
  clickAddAlertChannelTracker,
  clickAddAlertChannelMenuTracker,
  alertChannelCTATrackerSegment
} from 'in-settings/tracker';
import {
  SETTINGS_ALERT_CHANNEL_ADD_CLICK,
  SETTINGS_ALERT_CHANNEL_ADD_MENU_CLICK
} from 'in-services/tracking/eventNames';
// eslint-disable-next-line import/no-deprecated
import PreviewBadge from 'in-components/PreviewBadge/PreviewBadge';
import configs from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { goToAlertChannelView } from 'in-settings/navigation/paths';
import MultiButton from 'in-components/MultiButton';
import { t } from 'in-i18n';

import locals from './NewChannelButton.mless';

export default function NewChannelButton(props) {
  const { location } = useNavigation();
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
            <PreviewBadge privatePreview />
          </div>
        )}
        {configs[type].isBeta && (
          <div className={locals.betaBadge}>
            <PreviewBadge />
          </div>
        )}
      </Button>
    )
  );
}

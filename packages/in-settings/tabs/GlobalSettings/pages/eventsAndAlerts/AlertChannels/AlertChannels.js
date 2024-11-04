/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import NewChannelButton from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/components/NewChannelButton';
import AlertChannelsList from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/AlertChannelsList';
import { deleteAlertChannelTracker, alertChannelCTATrackerSegment } from 'in-settings/tracker';
import { SETTINGS_ALERT_CHANNEL_DELETE } from 'in-services/tracking/eventNames';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { deleteAlertChannel } from 'in-api/alertChannels';

export default function AlertChannels(props) {
  const { location } = useNavigation();
  return (
    <AlertChannelsList
      {...props}
      rightHeader={<NewChannelButton />}
      tableActions={{
        delete: {
          deleteEntity: entity => {
            deleteAlertChannelTracker({
              alertChannelId: entity.id ?? '',
              alertChannelKind: entity.kind ?? '',
              alertChannelName: entity.name ?? ''
            });
            alertChannelCTATrackerSegment({
              EVENT_NAME: SETTINGS_ALERT_CHANNEL_DELETE,
              path: location.pathname,
              channel: entity.kind ?? '',
              additionalLabel: entity.id ?? ''
            });
            return deleteAlertChannel(entity.id);
          }
        }
      }}
    />
  );
}

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import NewChannelButton from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/components/NewChannelButton';
import AlertChannelsList from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannelsList';
import { deleteAlertChannelTracker } from 'in-settings/tracker';
import { deleteAlertChannel } from 'in-api/alertChannels';

export default function AlertChannels(props) {
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
            return deleteAlertChannel(entity.id);
          }
        }
      }}
    />
  );
}

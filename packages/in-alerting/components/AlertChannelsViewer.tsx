/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Severity } from '@instana/types/typeDefinitions';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
//@ts-expect-error TS migration
import AlertChannelsList from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/AlertChannelsList';
//@ts-expect-error TS migration
import { getAlertChannelsInfosMutable } from 'in-api/alertChannels';
import NoChannelSelected from 'in-alerting/components/NoChannelSelected';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { role } from 'in-stores/user';

export default function AlertChannelsViewer({
  alertChannelIds,
  alertChannels,
  alertChannelPerSeverityEnabled
}: {
  alertChannelIds: string[];
  alertChannels?: { [P in Severity]?: string[] };
  alertChannelPerSeverityEnabled?: boolean;
}) {
  return (
    <>
      <AlertChannelsList
        setTitle={false}
        loadEntities={() => getSelectedAlertChannels(alertChannelIds)}
        hasRowNavigation={role?.canConfigureIntegrations}
        renderNoDataAvailable={() => <NoChannelSelected />}
        isSearchable={false}
        getHeader={() => null}
        rightHeader={null}
        detailView
        alertChannels={alertChannels}
        alertChannelPerSeverityEnabled={alertChannelPerSeverityEnabled}
      />
    </>
  );
}

const getSelectedAlertChannels = createMemoizedObservableForReferencedEntities(function (selectedChannels) {
  if (selectedChannels.length === 0) {
    return alwaysEmptyArray;
  }
  // null is treated as a pending result when converting the HTTP response into a result
  return getAlertChannelsInfosMutable(selectedChannels).startWith(null);
});

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import AlertChannelsOverview from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannelsOverview';
import NoChannelSelected from 'in-new-components/Alerting/components/channels/NoChannelSelected';
import { getAlertChannelsInfosMutable } from 'in-api/alertChannels';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { role } from 'in-stores/user';

export default function AlertChannelsViewer({ alertChannelIds }) {
  return (
    <>
      <AlertChannelsOverview
        setTitle={false}
        loadEntities={() => getSelectedAlertChannels(alertChannelIds)}
        hasRowNavigation={role.canConfigureIntegrations}
        renderNoDataAvailable={() => <NoChannelSelected />}
        isSearchable={false}
        getHeader={() => null}
        rightHeader={null}
        tableActions={[]}
      />
    </>
  );
}

const getSelectedAlertChannels = createMemoizedObservableForReferencedEntities(function(selectedChannels) {
  if (selectedChannels.length === 0) {
    return alwaysEmptyArray;
  }
  // null is treated as a pending result when converting the HTTP response into a result
  return getAlertChannelsInfosMutable(selectedChannels).startWith(null);
});

AlertChannelsViewer.propTypes = {
  alertChannelIds: PropTypes.arrayOf(PropTypes.string).isRequired
};

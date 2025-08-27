/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Severity } from '@instana/types/typeDefinitions';
import { Observable } from '@instana/observables';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import AlertChannelsList, {
  AlertChannel
} from 'in-alerting/smart-alerts/components/tearSheet/AlertChannelSelectionList';
import { getAlertChannelsInfosMutable } from 'in-api/alertChannels';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { t } from 'in-i18n';

export default function AlertChannelsViewer({
  alertChannelIds,
  alertChannels,
  alertChannelPerSeverityEnabled
}: {
  alertChannelIds: string[];
  alertChannels?: { [P in Severity]?: string[] };
  alertChannelPerSeverityEnabled?: boolean;
}) {
  const [role] = useCurrentUserRole();

  return (
    <>
      <AlertChannelsList
        setTitle={false}
        loadEntities={() => getSelectedAlertChannels(alertChannelIds) as Observable<AlertChannel[] | null>}
        hasRowNavigation={role?.canConfigureIntegrations}
        noDataDescription={t('in-alerting:components.noChannelSelectedDetailPage')}
        isSearchable={false}
        rightHeader={null}
        detailView
        alertChannels={alertChannels as Record<string, string[]>}
        alertChannelPerSeverityEnabled={alertChannelPerSeverityEnabled}
      />
    </>
  );
}

const getSelectedAlertChannels = createMemoizedObservableForReferencedEntities(function (selectedChannels: string[]) {
  if (selectedChannels.length === 0) {
    return alwaysEmptyArray;
  }
  // null is treated as a pending result when converting the HTTP response into a result
  return getAlertChannelsInfosMutable(selectedChannels).startWith(null);
});

// Made with Bob

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { MapForm } from 'formalistic';
import { match } from 'react-router';
import React from 'react';

import { AbstractIntegration, AbstractIntegrationUnion } from '@instana/types';

//@ts-expect-error TS migration
import AlertChannelModificationForm from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/components/AlertChannelModificationForm';
//@ts-expect-error TS migration
import { createForm } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/components/AlertChannelModificationForm';
//@ts-expect-error TS migration
import { save } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/components/AlertChannelModificationForm';
import { globalSettingsAlertingAlertChannels } from 'in-settings/navigation/paths';
import { createAlertChannel, getAlertChannel } from 'in-api/alertChannels';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';
import { t } from 'in-i18n';

interface MatchParams {
  id: string;
}

interface AlertChannelModificationProps {
  location: Location;
  match: match<MatchParams>;
}

export default function AlertChannelModification(props: AlertChannelModificationProps) {
  const kind = getMatrixParameter(props.location, '/channels', 'kind') as AbstractIntegration['kind'];
  const entityId = props.match.params.id;
  const { goToPath } = useNavigation();
  const isCreate = entityId ? false : true;

  return (
    <AlertChannelModificationForm
      title={t('in-settings:tabs.alertChannel')}
      entityId={entityId}
      createDefaultEntity={() => createAlertChannel(null, kind)}
      createForm={createForm}
      getEntityFromApi={getAlertChannel}
      openEntities={() => goToPath(globalSettingsAlertingAlertChannels)}
      saveEntity={(
        alertChannel: Map<keyof AbstractIntegrationUnion, AbstractIntegrationUnion[keyof AbstractIntegrationUnion]>,
        form: MapForm<any>
      ) => save(alertChannel, form, isCreate)}
      listPath={globalSettingsAlertingAlertChannels}
      setMinHeight
    />
  );
}

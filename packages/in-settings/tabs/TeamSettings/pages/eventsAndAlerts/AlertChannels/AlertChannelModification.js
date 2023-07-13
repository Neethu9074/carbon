/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import AlertChannelModificationForm, {
  createForm,
  save
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/components/AlertChannelModificationForm';
import { teamSettingsAlertingAlertChannels } from 'in-settings/navigation/paths';
import { createAlertChannel, getAlertChannel } from 'in-api/alertChannels';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { t } from 'in-i18n';

export default function AlertChannelModification(props) {
  const kind = getMatrixParameter(props.location, '/channels', 'kind');
  const entityId = props.match.params.id;
  const { goToPath } = useNavigation();

  return (
    <AlertChannelModificationForm
      title={t('in-settings:tabs.alertChannel')}
      entityId={entityId}
      createDefaultEntity={() => createAlertChannel(null, kind)}
      createForm={createForm}
      getEntityFromApi={getAlertChannel}
      openEntities={() => goToPath(teamSettingsAlertingAlertChannels)}
      saveEntity={save}
      listPath={teamSettingsAlertingAlertChannels}
    />
  );
}

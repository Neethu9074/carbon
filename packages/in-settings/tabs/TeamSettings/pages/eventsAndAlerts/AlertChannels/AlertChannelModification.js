/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createMapForm } from 'formalistic';
import { fromJS } from 'immutable';
import theme from 'in-themes';
import { t } from 'in-i18n';
import React from 'react';

import AlertChannelTestButton from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/components/AlertChannelTestButton';
import { fullyQualified } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { getAlertChannel, saveAlertChannel, createAlertChannel } from 'in-api/alertChannels';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { teamSettingsAlertingAlertChannels } from 'in-settings/navigation/paths';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import DescriptionText from 'in-components/form/DescriptionText';
import { submitAlertChannelTracker } from 'in-settings/tracker';
import SectionLine from 'in-settings/components/SectionLine';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import entityForm from 'in-hoc/entityForm';

export default function AlertChannelModification(props) {
  const kind = getMatrixParameter(props.location, '/channels', 'kind');
  const entityId = props.match.params.id;

  return (
    <AlertChannelModificationForm
      title={t('in-settings:tabs.alertChannel')}
      entityId={entityId}
      createDefaultEntity={() => createAlertChannel(null, kind)}
      createForm={createForm}
      getEntityFromApi={getAlertChannel}
      openEntities={() => goToPath(teamSettingsAlertingAlertChannels)}
      saveEntity={save}
    />
  );
}

function save(alertChannel, form) {
  const alertChannelType = form.get('kind').value;

  submitAlertChannelTracker({ type: alertChannelType });
  return saveAlertChannel(fromJS(getConfig(alertChannel).createEntity(alertChannel, form)));
}

function createForm(alertChannel) {
  if (!alertChannel || alertChannel.get('errors')) {
    return createMapForm();
  }

  return getConfig(alertChannel).createForm(alertChannel);
}

function getConfig(alertChannel) {
  return fullyQualified[alertChannel.get('kind')];
}

const AlertChannelModificationForm = entityForm(function AlertChannelModificationForm(props) {
  const { entity, form, message, error, loading, setForm, isCreate } = props;

  if (!entity || !form) {
    return <LoadingIndicator />;
  }

  if (entity && entity.get('errors')) {
    return (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={theme.lib.colors.yellow800}>
          {t('in-settings:tabs.unknownAlertChannel')}
        </SubViewHeader>
        <SectionLine />
        <DescriptionText>
          {entity.get('errors').get(0)}
          <br />
          {t('in-settings:tabs.ifYouFollowedALinkToGetHereItHasMostLikelyBeenDeleted')}
        </DescriptionText>
      </SettingsDetailPage>
    );
  }

  const fullyQualifiedAlertChannel = getConfig(entity);
  const Form = fullyQualifiedAlertChannel.Form;
  const alertChannelLabel = fullyQualifiedAlertChannel.label;

  return (
    <SettingsDetailPage>
      <SubViewHeader>
        {isCreate
          ? t('in-settings:tabs.createAlertChannelLabelAlertChannel', { alertChannelLabel: alertChannelLabel })
          : t('in-settings:tabs.modifyEntityNameAlertChannel', { entityName: entity.get('name') })}
      </SubViewHeader>
      <SectionLine />

      {message ? (
        <Section>
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        </Section>
      ) : null}

      <Form {...props} />

      <AlertChannelTestButton alertChannel={entity} form={form} setForm={setForm} />

      <SaveCancel
        form={form}
        message={message}
        loading={loading}
        isCreate={isCreate}
        listPath={teamSettingsAlertingAlertChannels}
      />
    </SettingsDetailPage>
  );
});

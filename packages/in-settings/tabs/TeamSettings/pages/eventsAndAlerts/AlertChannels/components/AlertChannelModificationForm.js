/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createMapForm } from 'formalistic';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import React from 'react';

import AlertChannelTestButton from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/components/AlertChannelTestButton';
import { fullyQualified } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/configs';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import DescriptionText from 'in-components/form/DescriptionText';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { submitAlertChannelTracker } from 'in-settings/tracker';
import SectionLine from 'in-settings/components/SectionLine';
import Notification from 'in-components/form/Notification';
import SaveCancel from 'in-settings/components/SaveCancel';
import { saveAlertChannel } from 'in-api/alertChannels';
import Section from 'in-settings/components/Section';
import entityForm from 'in-hoc/entityForm';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './AlertChannelModificationForm.mless';

export default entityForm(AlertChannelModificationForm);

function AlertChannelModificationForm(props) {
  const { entity, form, message, error, loading, setForm, isCreate, renderCustomFormActions, listPath } = props;

  if (!entity || !form) {
    return <LoadingIndicator />;
  }

  if (entity.get('errors')) {
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
        <Section className={locals.messageSection}>
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        </Section>
      ) : null}
      <Form {...props} />
      <AlertChannelTestButton alertChannel={entity} form={form} setForm={setForm} />

      {renderCustomFormActions?.({ form, loading }) ?? (
        <SaveCancel form={form} message={message} loading={loading} isCreate={isCreate} listPath={listPath} />
      )}
    </SettingsDetailPage>
  );
}

function getConfig(alertChannel) {
  return fullyQualified[alertChannel.get('kind')];
}

export function save(alertChannel, form) {
  const alertChannelType = form.get('kind').value;

  submitAlertChannelTracker({ type: alertChannelType });
  return saveAlertChannel(fromJS(getConfig(alertChannel).createEntity(alertChannel, form)));
}

export function createForm(alertChannel) {
  if (!alertChannel || alertChannel.get('errors')) {
    return createMapForm();
  }

  return getConfig(alertChannel).createForm(alertChannel);
}

AlertChannelModificationForm.propTypes = {
  /**
   * Alert channel which we want to create.
   */
  entity: PropTypes.object,
  /**
   * Provided message  is of type error (injected by entityForm).
   */
  error: PropTypes.bool,
  /**
   * Formalistic form object
   */
  form: PropTypes.object.isRequired,
  /**
   * Wether to create a new or modify an existing alert channel.
   */
  isCreate: PropTypes.bool,
  /**
   * Go back to this past if saving entity is successful.
   */
  listPath: PropTypes.string,
  /**
   * Loading state (injected by entityForm).
   */
  loading: PropTypes.bool,
  /**
   * Informational message shown at top of the form (injected by entityForm).
   */
  message: PropTypes.string,
  /**
   * Custom form actions (like save/cancel).
   */
  renderCustomFormActions: PropTypes.func,
  /**
   * It Sets the form entit from state to the current form config (injected by entityForm).
   */
  setForm: PropTypes.func.isRequired
};

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { Fragment, useEffect, useState } from 'react';
import { createMapForm } from 'formalistic';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';

import { Button, CarbonMultiSelect, Collapsible, Link, Message, Stack, Typography } from '@instana/components';
import { Pill, Label } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import AlertChannelTestButton from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/components/AlertChannelTestButton';
import { fullyQualified } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { createAlertChannelTracker, alertChannelCTATrackerSegment } from 'in-settings/tracker';
import { SETTINGS_ALERT_CHANNEL_CREATE } from 'in-services/tracking/eventNames';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { savingMessage as entityFormSavingMessage } from 'in-hoc/entityForm';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import DescriptionText from 'in-components/form/DescriptionText';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { hasError, isLoading } from 'in-services/util/result';
import SectionLine from 'in-settings/components/SectionLine';
import FeatureFeedback from 'in-components/FeatureFeedback';
import { rbacTeamsEnabled } from 'in-services/featureFlags';
import Notification from 'in-components/form/Notification';
import { pendingResult } from 'in-services/fixedObjects';
import { saveAlertChannel } from 'in-api/alertChannels';
import Section from 'in-settings/components/Section';
import { getTeamsResult } from 'in-api/teams';
import entityForm from 'in-hoc/entityForm';
import { t, Trans } from 'in-i18n';

import locals from './AlertChannelModificationForm.mless';

export default entityForm(AlertChannelModificationForm);

function AlertChannelModificationForm(props) {
  const {
    entity,
    form,
    message,
    error,
    loading,
    setForm,
    isCreate,
    renderCustomFormActions,
    listPath,
    setMinHeight = false
  } = props;

  const dataResult = useObservable(getTeamsResult, []) ?? pendingResult;
  const teamsLoading = isLoading(dataResult);
  const teamsHasErrors = hasError(dataResult);
  const teamsList = !teamsLoading && !teamsHasErrors ? dataResult : [];
  const teamsAssigned = entity.get('rbacTags');
  const [selectedList, setSelectedList] = useState([]);
  useEffect(() => {
    if (rbacTeamsEnabled && !teamsLoading && !teamsHasErrors) {
      const teamsSelected = teamsAssigned
        ? teamsList.filter(item => teamsAssigned.some(team => team.get('id') == item.id))
        : [];
      setForm(form.put('rbacTags', teamsSelected));
      setSelectedList(teamsSelected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamsAssigned, teamsList]);

  if (!entity || !form) {
    return <LoadingIndicator />;
  }

  if (entity.get('errors')) {
    return (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={themes.default.ids.color.option.yellow['500']}>
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
  const AdvancedFormSettings = fullyQualifiedAlertChannel.AdvancedFormSettings;

  const alertChannelLabel = fullyQualifiedAlertChannel.label;
  const testAlertChannelLabel = fullyQualifiedAlertChannel.testAlertChannelLabel;
  const onSelectionChanged = item => {
    setSelectedList(item);
    setForm(form.put('rbacTags', item));
  };

  return (
    <Fragment>
      <SettingsDetailPage className={setMinHeight ? locals.minHeightSettingsPage : undefined}>
        <HorizontalFlexWrapper>
          <SubViewHeader>
            {isCreate
              ? t('in-settings:tabs.createAlertChannelLabelAlertChannel', { alertChannelLabel: alertChannelLabel })
              : t('in-settings:tabs.modifyEntityNameAlertChannel', { entityName: entity.get('name') })}
          </SubViewHeader>
          {fullyQualifiedAlertChannel?.isAlpha && (
            <div className={locals.betaMarker}>
              {fullyQualifiedAlertChannel.feedbackLink ? (
                <FeatureFeedback
                  href={fullyQualifiedAlertChannel.feedbackLink}
                  labelText={t('in-settings:general.alphaLabel')}
                />
              ) : (
                <Pill type="gray">{t('in-settings:general.alphaLabel')}</Pill>
              )}
            </div>
          )}
          {fullyQualifiedAlertChannel?.isBeta && (
            <div className={locals.betaMarker}>
              <FeatureFeedback href={fullyQualifiedAlertChannel.feedbackLink} />
            </div>
          )}
        </HorizontalFlexWrapper>
        {fullyQualifiedAlertChannel?.referencesDocumentation && (
          <Message className={locals.documentation} withIcon iconType="lib_help_error_info_circle" bold>
            <Trans
              i18nKey="in-settings:tabs.alertChannelDocumentationMessage"
              components={{
                documentationLink: (
                  <Link href={fullyQualifiedAlertChannel?.documentationLink} external>
                    &nbsp;
                  </Link>
                )
              }}
            />
          </Message>
        )}
        <SectionLine />
        {message ? (
          <Section className={locals.messageSection}>
            <Notification failure={error} loading={loading}>
              {message}
            </Notification>
          </Section>
        ) : null}
        <Form {...props} />
        {fullyQualifiedAlertChannel?.testAPI !== null && (
          <AlertChannelTestButton
            alertChannel={entity}
            form={form}
            setForm={setForm}
            alertChannelLabel={alertChannelLabel}
            testAlertChannelLabel={testAlertChannelLabel}
          />
        )}
        {rbacTeamsEnabled && (
          <>
            <SectionLine />
            <Typography variant="heading-02" noMargin>
              {t('in-settings:tabs.accessTitle')}
            </Typography>
            <Section>
              <Label htmlFor="teamsSelect">{t('in-settings:tabs.accessDesc')}</Label>
              <div id="teamsSelect" className={locals.teamsSelector}>
                <CarbonMultiSelect
                  label={t('in-settings:tabs.chooseTeams')}
                  onChange={data => onSelectionChanged(data.selectedItems)}
                  items={teamsList}
                  selectedItems={selectedList}
                  itemToString={item => (item ? item.tag : '')}
                />
              </div>
            </Section>
          </>
        )}

        {AdvancedFormSettings && (
          <Collapsible initiallyOpen={getDefaultStateOfAdvancedSection(entity, form)}>
            <Collapsible.Header style={{ paddingInlineStart: 0 }}>
              <Typography variant="heading-02" noMargin>
                {t('in-settings:tabs.advanced')}
              </Typography>
            </Collapsible.Header>
            <Collapsible.Content>
              <div className={locals.advancedFormContainer}>
                <AdvancedFormSettings {...props} />
              </div>
            </Collapsible.Content>
          </Collapsible>
        )}
      </SettingsDetailPage>
      {renderCustomFormActions?.({ form, loading }) ?? (
        <SubmissionButton form={form} message={message} loading={loading} isCreate={isCreate} listPath={listPath} />
      )}
    </Fragment>
  );
}

function getDefaultStateOfAdvancedSection(entity, form) {
  if (!entity || !form || entity.get('errors')) return false;

  const fullyQualifiedAlertChannel = getConfig(entity);
  return fullyQualifiedAlertChannel.advancedStateShouldBeExpandedByDefault
    ? fullyQualifiedAlertChannel.advancedStateShouldBeExpandedByDefault(form)
    : false;
}

function SubmissionButton({ form, message, loading, isCreate, listPath }) {
  const saving = loading && message === entityFormSavingMessage;
  const saveButtonLabel = isCreate ? t('forms.actions.create') : t('forms.actions.save');
  const savingStateName = t('forms.states.saving');

  const { goToPath } = useNavigation();

  return (
    <div className={locals.submissionWrapper}>
      <SectionLine withMarginBottom={false} />
      <Stack direction="horizontal" distribution="end" gap="disabled">
        <Button kind="secondary" className={locals.button} onClick={() => goToPath(listPath)}>
          {t('forms.actions.cancel')}
        </Button>
        <Button
          kind="primary"
          type="submit"
          className={locals.button}
          disabled={(!form.hierarchyValid && form.touched) || loading || saving}
          icon={saving ? 'lib_actions_loading' : null}
          iconSpinning
        >
          {saving ? savingStateName : saveButtonLabel}
        </Button>
      </Stack>
    </div>
  );
}

function getConfig(alertChannel) {
  return fullyQualified[alertChannel.get('kind')];
}

export function save(alertChannel, form) {
  const addRbacTags = obj => {
    let result = obj;
    const rbacTags = form.get('rbacTags');
    if (rbacTags) {
      result = { ...obj, rbacTags };
    }
    return result;
  };
  createAlertChannelTracker({ alertChannelType: form.get('kind').value, alertChannelName: form.get('name').value });
  // Todo - modernize
  alertChannelCTATrackerSegment({
    EVENT_NAME: SETTINGS_ALERT_CHANNEL_CREATE,
    path: '',
    channel: form.get('kind').value
  });
  return saveAlertChannel(fromJS(addRbacTags(getConfig(alertChannel).createEntity(alertChannel, form))));
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
  setForm: PropTypes.func.isRequired,
  /**
   * Sets whether the form page should have a minimum height or not. Used in global settings page to push footer to bottom
   */
  setMinHeight: PropTypes.bool
};

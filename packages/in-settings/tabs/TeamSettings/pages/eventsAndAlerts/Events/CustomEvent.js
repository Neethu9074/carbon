/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';
import React from 'react';

import { combineLatest } from '@instana/observables';
import { Stack } from '@instana/components';

import {
  createCustomSystemRuleBasedEventSpecification,
  createCustomSystemRuleBasedEventSpecificationForEntityVerification,
  createCustomSystemRuleBasedHostAvailability,
  createCustomThresholdBasedEventSpecification,
  getCustomEventSpecification,
  saveCustomEventSpecification,
  getCustomEventActions,
  saveCustomEventSpecificationWithActions
} from 'in-api/eventSpecifications';
import {
  createEventFormDefinition,
  dataSourceSystem,
  entityVerification,
  hostAvailabilityDetection
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import {
  deprecateAppDataLegacyEventsEnabled,
  disallowAppDataLegacyEventsEnabled,
  hideAppDataLegacyEventsEnabled
} from 'in-services/featureFlags';
import {
  getSeverityText,
  isAppDataEntityType,
  unmapConditionValue
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';
import CustomEventForm from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventForm';
import { serializeQuery } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import useEntityForm from 'in-settings/tabs/TeamSettings/pages/automation/useEntityForm';
import { getMetricDefinition, isBuiltInDynamicMetric } from 'in-sdk/metrics/metrics';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import MigrateToSmartAlerts from 'in-alerting/migration/MigrateToSmartAlerts';
import LegacyAppdataEventInfoMessage from './LegacyAppdataEventInfoMessage';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { teamSettingsAlertingEvents } from 'in-settings/navigation/paths';
import { actionAutomationEnabled } from 'in-services/featureFlags';
import DescriptionText from 'in-components/form/DescriptionText';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import Notification from 'in-components/form/Notification';
import SaveCancel from 'in-settings/components/SaveCancel';
import { submitEventTracker } from 'in-settings/tracker';
import Section from 'in-settings/components/Section';
import { getPluginName } from 'in-sdk/pluginName';
import { goToPath } from 'in-stores/navigation';
import Title from 'in-components/Title/Title';
import { role } from 'in-stores/user';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function CustomEvent(props) {
  const entityId = props.match.params.id;

  function mergeResultData() {
    const eventDetails$ = getCustomEventSpecification(entityId);
    const actionDetails$ = getCustomEventActions(entityId);
    // calling Get Event and Get action associations call and combining results
    return combineLatest([eventDetails$, actionDetails$]).map(([eventResponse, actionResponse]) =>
      eventResponse.set('actionIds', actionResponse?.map(action => action.id) ?? [])
    );
  }
  const entityFormParam = {
    entityId,
    createDefaultEntity: createCustomThresholdBasedEventSpecification,
    createForm: event => createEventFormDefinition(fromJS(event), !entityId),
    getEntityFromApi:
      role.canConfigureAutomationActions && actionAutomationEnabled ? mergeResultData : getCustomEventSpecification,
    saveEntity: (event, form) => save(fromJS(event), form),
    openEntities: () => goToPath(teamSettingsAlertingEvents)
  };
  const {
    entity,
    form,
    isCreate,
    saveEnabled,
    loading,
    error,
    message,
    onSubmit,
    setForm,
    onChange,
    setSaveEnabled
  } = useEntityForm(entityFormParam);
  const errorLoading = error && !entity;
  let content = null;
  if (loading) {
    content = <LoadingIndicator />;
  } else if (errorLoading) {
    content = (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={theme.lib.colors.yellow800}>
          {t('in-settings:tabs.unknownEvent')}
        </SubViewHeader>
        <SectionLine />
        <DescriptionText>
          {message}
          <br />
          {t('in-settings:tabs.ifYouFollowedALinkToGetHereItHasMostLikelyBeenDeleted')}
        </DescriptionText>
      </SettingsDetailPage>
    );
  } else {
    const immutableEntity = fromJS(entity);
    const entityType = getPluginName(immutableEntity.get('entityType'), 1) ?? '';
    const isLegacyAppDataEntityType = isAppDataEntityType(entityType);
    const hasPermissionsToEditSmartAlerts = role.canConfigureCustomAlerts && role.canConfigureGlobalAlertConfigs;
    const isDeprecated = deprecateAppDataLegacyEventsEnabled && isLegacyAppDataEntityType;

    const isMigratable =
      isDeprecated &&
      hasPermissionsToEditSmartAlerts &&
      // only migrateable entities have the 'migrated' property set. For the other ones this prop is `undefined`, thus checking for false and not falsy.
      immutableEntity.get('migrated') === false;

    const isMigrated = !!immutableEntity.get('migrated');

    const isDeleted = !!immutableEntity.get('deleted');

    const disallowAppDataLegacyEvent =
      isLegacyAppDataEntityType && (disallowAppDataLegacyEventsEnabled || hideAppDataLegacyEventsEnabled);
    const readOnly = isDeleted || isMigrated || disallowAppDataLegacyEvent;

    content = (
      <SettingsDetailPage>
        <Stack direction="horizontal" distribution="spaceBetween">
          <SubViewHeader>
            {isCreate
              ? t('in-settings:tabs.createANewEvent')
              : t('in-settings:tabs.configureEventEntityName', { entityName: immutableEntity.get('name') })}
          </SubViewHeader>

          {isMigratable && !isDeleted && (
            <span style={{ alignSelf: 'center' }}>
              <MigrateToSmartAlerts eventSpecificationId={props.entityId} />
            </span>
          )}
        </Stack>
        <SectionLine />

        {(isDeleted || isDeprecated) && (
          <LegacyAppdataEventInfoMessage
            migrated={isMigrated}
            saved
            disallowed={disallowAppDataLegacyEventsEnabled}
            deleted={isDeleted}
          />
        )}

        {message ? (
          <Section>
            <Notification failure={error} loading={loading}>
              {message}
            </Notification>
          </Section>
        ) : null}

        <CustomEventForm
          disabled={readOnly}
          form={form}
          setForm={setForm}
          onChange={onChange}
          entity={immutableEntity}
          setSaveEnabled={setSaveEnabled}
          // when we already show an information above, we need to hide another message inside the form
          hideLegacyAppDataEventDeprecationInfo={isDeleted || isDeprecated}
        />

        <SaveCancel
          form={form}
          message={message}
          loading={loading}
          saveEnabled={saveEnabled && !readOnly}
          isCreate={isCreate}
          listPath={teamSettingsAlertingEvents}
        />
      </SettingsDetailPage>
    );
  }

  return (
    <>
      <Title title={t('in-settings:tabs.event')} />
      <form onSubmit={onSubmit}>{content}</form>
    </>
  );
}

function save(event, form) {
  const isTriggering = form.get('triggering').value;
  const severity = Number(form.get('severity')?.value ?? 0);
  const entityType = form.get('entityType')?.value ?? null;
  const scopeType = form.get('applyOn').value;
  const actionIds = form.get('actionIds')?.value ?? [];

  submitEventTracker({
    scopeType,
    entityType,
    type: isTriggering ? 'Incident' : 'None',
    severity: getSeverityText(severity)
  });

  const eventSpecification = getEventSpecification(event, form);
  if (role.canConfigureAutomationActions && actionAutomationEnabled && !isTriggering) {
    eventSpecification.actions = actionIds?.map(value => ({ id: value }));
    return saveCustomEventSpecificationWithActions(eventSpecification);
  } else {
    return saveCustomEventSpecification(eventSpecification);
  }
}

function getTagFilterForHostAvailability(form) {
  if (form.containsKey('tagOperator')) {
    return {
      name: 'tag',
      operator: form.get('tagOperator').value,
      stringValue: form.get('tagValue')?.value
    };
  }

  return null;
}

function getHostAvailabilityEventSpecification(form, event) {
  const hostAvailabilityFields = {
    id: event ? event.get('id') : null,
    name: form.get('name').value,
    triggering: form.get('triggering').value,
    description: form.get('description').value,
    expirationTime: form.get('gracePeriod').value,
    tagFilter: getTagFilterForHostAvailability(form),
    offlineDuration: Number(form.get('offlineDuration')?.value ?? 0),
    closeAfter: Number(form.get('closeAfter')?.value ?? 0),
    enabled: event ? event.get('enabled') : true,
    severity: Number(form.get('severity')?.value ?? 0)
  };

  return createCustomSystemRuleBasedHostAvailability(hostAvailabilityFields);
}

function getEntityVerificationEventSpecification(form, query, event) {
  const entityVerificationFields = {
    id: event ? event.get('id') : null,
    name: form.get('name').value,
    query,
    triggering: form.get('triggering').value,
    description: form.get('description').value,
    expirationTime: form.get('gracePeriod').value,
    enabled: event ? event.get('enabled') : true,
    severity: Number(form.get('severity')?.value ?? 0),
    matchingEntityType: form.get('matchingEntityType')?.value ?? null,
    matchingOperator: form.get('matchingOperator')?.value ?? null,
    matchingEntityLabel: form.get('matchingEntityLabel')?.value ?? null,
    offlineDuration: Number(form.get('offlineDuration')?.value ?? 0)
  };

  return createCustomSystemRuleBasedEventSpecificationForEntityVerification(entityVerificationFields);
}

function getCustomSystemRuleBasedEventSpecification(form, query, event) {
  return createCustomSystemRuleBasedEventSpecification(
    event ? event.get('id') : null,
    form.get('name').value,
    // For now, all system rule based events use 'any' as their entity type. It does not make any sense to have this
    // attribute at all but the back end validation requires a value.
    'any',
    query,
    form.get('triggering').value,
    form.get('description').value,
    form.get('gracePeriod').value,
    event ? event.get('enabled') : true,
    'system',
    Number(form.get('severity')?.value ?? 0),
    form.get('systemRule')?.value ?? null
  );
}

function getEventSpecification(event, form) {
  const ruleType = form.get('dataSource') && form.get('dataSource').value === dataSourceSystem ? 'system' : 'threshold';
  const query = serializeQuery(form);

  if (ruleType === 'system') {
    const systemRule = form.get('systemRule')?.value;

    if (systemRule === entityVerification.id) {
      return getEntityVerificationEventSpecification(form, query, event);
    }

    if (systemRule === hostAvailabilityDetection.id) {
      return getHostAvailabilityEventSpecification(form, event);
    }

    return getCustomSystemRuleBasedEventSpecification(form, query, event);
  } else {
    const formatterType = form.get('formatter')?.value ?? null;
    let conditionValue = Number(form.get('conditionValue')?.value ?? 0);
    conditionValue = unmapConditionValue(conditionValue, formatterType);

    const entityType = form.get('entityType')?.value ?? null;
    let metricName = form.get('metricName')?.value ?? null;
    let metricPattern = null;

    if (isBuiltInDynamicMetric(entityType, metricName)) {
      const metricDefinition = getMetricDefinition(entityType, metricName);
      if (metricDefinition && metricDefinition.metricPattern) {
        metricPattern = {
          prefix: metricDefinition.metricPattern.pre,
          postfix: metricDefinition.metricPattern.post,
          operator: form.get('metricPatternOperator').value,
          placeholder: form.get('metricPatternPlaceholder')?.value ?? null
        };
        metricName = null;
      }
    }

    return createCustomThresholdBasedEventSpecification(
      event ? event.get('id') : null,
      form.get('name').value,
      form.get('entityType')?.value ?? null,
      query,
      form.get('triggering').value,
      form.get('description').value,
      form.get('gracePeriod').value,
      event ? event.get('enabled') : true,
      ruleType,
      metricName,
      metricPattern,
      form.get('rollup') ? Number(form.get('rollup').value) : null,
      form.get('window') ? Number(form.get('window').value) : null,
      form.get('aggregation')?.value ?? null,
      form.get('conditionOperator')?.value ?? null,
      conditionValue,
      Number(form.get('severity')?.value ?? 0)
    );
  }
}

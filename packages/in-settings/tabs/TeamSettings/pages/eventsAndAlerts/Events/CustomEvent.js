/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack } from '@instana/components';

import {
  createCustomSystemRuleBasedEventSpecification,
  createCustomSystemRuleBasedEventSpecificationForEntityVerification,
  createCustomSystemRuleBasedHostAvailability,
  createCustomThresholdBasedEventSpecification,
  getCustomEventSpecification,
  saveCustomEventSpecification
} from 'in-api/eventSpecifications';
import {
  createEventFormDefinition,
  dataSourceSystem,
  entityVerification,
  hostAvailabilityDetection
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { getSeverityText, unmapConditionValue } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';
import CustomEventForm from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventForm';
import { serializeQuery } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import { getMetricDefinition, isBuiltInDynamicMetric } from 'in-sdk/metrics/metrics';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import MigrateToSmartAlerts from 'in-alerting/migration/MigrateToSmartAlerts';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { teamSettingsAlertingEvents } from 'in-settings/navigation/paths';
import { deprecateAppDataLegacyEvents } from 'in-services/featureFlags';
import DescriptionText from 'in-components/form/DescriptionText';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import Notification from 'in-components/form/Notification';
import SaveCancel from 'in-settings/components/SaveCancel';
import { submitEventTracker } from 'in-settings/tracker';
import Section from 'in-settings/components/Section';
import { getPluginName } from 'in-sdk/pluginName';
import { goToPath } from 'in-stores/navigation';
import entityForm from 'in-hoc/entityForm';
import { role } from 'in-stores/user';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function CustomEvent(props) {
  const entityId = props.match.params.id;

  return (
    <Form
      title={t('in-settings:tabs.event')}
      entityId={entityId}
      createDefaultEntity={createCustomThresholdBasedEventSpecification}
      createForm={event => createEventFormDefinition(event, !entityId)}
      getEntityFromApi={getCustomEventSpecification}
      openEntities={() => goToPath(teamSettingsAlertingEvents)}
      saveEntity={save}
    />
  );
}

const Form = entityForm(function DetailsForm(props) {
  const { entity, form, message, error, loading, isCreate, saveEnabled } = props;

  if (!entity || !form) {
    return <LoadingIndicator />;
  }

  if (entity && entity.get('errors')) {
    return (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={theme.lib.colors.yellow800}>
          {t('in-settings:tabs.unknownEvent')}
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

  const entityType = getPluginName(entity.get('entityType'), 1) ?? '';
  const isOneOfMigratableEntityTypes = ['application', 'service', 'endpoint'].includes(entityType.toLocaleLowerCase());
  const hasPermissionsToEditSmartAlerts = role.canConfigureCustomAlerts && role.canConfigureGlobalAlertConfigs;
  const isMigrateableDfqScope = !entity.get('query')?.startsWith('event.');

  const isMigratable =
    deprecateAppDataLegacyEvents &&
    hasPermissionsToEditSmartAlerts &&
    isOneOfMigratableEntityTypes &&
    isMigrateableDfqScope &&
    entity.get('migrated') === false; // only migrateable entities have this property set. For the other ones this prop is `undefined`, thus checking for false and not falsy.

  return (
    <SettingsDetailPage>
      <Stack direction="horizontal" distribution="spaceBetween">
        <SubViewHeader>
          {isCreate
            ? t('in-settings:tabs.createANewEvent')
            : t('in-settings:tabs.configureEventEntityName', { entityName: entity.get('name') })}
        </SubViewHeader>

        {isMigratable && (
          <span style={{ alignSelf: 'center' }}>
            <MigrateToSmartAlerts eventSpecificationId={props.entityId} />
          </span>
        )}
      </Stack>
      <SectionLine />

      {message ? (
        <Section>
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        </Section>
      ) : null}

      <CustomEventForm {...props} />

      <SaveCancel
        form={form}
        message={message}
        loading={loading}
        saveEnabled={saveEnabled}
        isCreate={isCreate}
        listPath={teamSettingsAlertingEvents}
      />
    </SettingsDetailPage>
  );
});

function save(event, form) {
  const isTriggering = form.get('triggering').value;
  const severity = Number(form.get('severity')?.value ?? 0);
  const entityType = form.get('entityType')?.value ?? null;
  const scopeType = form.get('applyOn').value;

  submitEventTracker({
    scopeType,
    entityType,
    type: isTriggering ? 'Incident' : 'None',
    severity: getSeverityText(severity)
  });

  const eventSpecification = getEventSpecification(event, form);
  return saveCustomEventSpecification(eventSpecification);
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

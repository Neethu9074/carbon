/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import { themes } from '@instana/design-tokens';
import { Stack } from '@instana/components';

import {
  createCustomSystemRuleBasedEventSpecification,
  createCustomSystemRuleBasedEventSpecificationForEntityVerification,
  createCustomSystemRuleBasedHostAvailability,
  createCustomSystemRuleBasedEventSpecificationForEntityCount,
  getCustomEventSpecificationMutable,
  saveCustomEventSpecification,
  createCustomSystemRuleBasedEventSpecificationForEntityCountVerification
} from 'in-api/eventSpecifications';
import {
  createEventFormDefinition,
  dataSourceSystem,
  entityCountVerification,
  entityVerification,
  hostAvailabilityDetection
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import {
  createCustomThresholdBasedEventSpecification,
  createCustomMultiThresholdBasedEventSpecification,
  createThresholdRule
} from 'in-api/eventSpecificationsHelpers';
import {
  getSeverityText,
  isDeprecatedAppDataEntityType,
  unmapConditionValue
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/util';
import {
  deprecateAppDataLegacyEventsEnabled,
  disallowAppDataLegacyEventsEnabled,
  hideAppDataLegacyEventsEnabled
} from 'in-services/featureFlags';
import LegacyAppdataEventInfoMessage from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/components/LegacyAppdataEventInfoMessage';
import {
  SETTINGS_EVENT_SUBMIT,
  SETTINGS_EVENT_VIEW,
  APPLICATIONS_ALERTING_DEPRECATED_EVENT_OPEN
} from 'in-services/tracking/tracking';
import { entityCountDetection } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import CustomEventForm from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/CustomEventForm';
import { serializeQuery } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/shared';
import { getMetricDefinition, isBuiltInDynamicMetric } from 'in-sdk/metrics/metrics';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import MigrateToSmartAlerts from 'in-alerting/migration/MigrateToSmartAlerts';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { globalSettingsAlertingEvents } from 'in-settings/navigation/paths';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import DescriptionText from 'in-components/form/DescriptionText';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import useEntityForm from 'in-settings/hooks/useEntityForm';
import Notification from 'in-components/form/Notification';
import SaveCancel from 'in-settings/components/SaveCancel';
import Section from 'in-settings/components/Section';
import { getPluginName } from 'in-sdk/pluginName';
import Title from 'in-components/Title/Title';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function CustomEvent(props) {
  const entityId = props.match.params.id;
  const { trackCta } = useSegmentTracking();
  const { goToPath } = useNavigation();
  const entityFormParam = {
    entityId,
    createDefaultEntity: createCustomThresholdBasedEventSpecification,
    createForm: event => createEventFormDefinition(event ?? createCustomThresholdBasedEventSpecification(), !entityId),
    getEntityFromApi: getCustomEventSpecificationMutable,
    saveEntity: (event, form) => save(event, form, trackCta),
    // eslint-disable-next-line
    openEntities: () => goToPath(globalSettingsAlertingEvents)
  };

  const { entity, form, isCreate, saveEnabled, loading, error, message, onSubmit, setForm, onChange } =
    useEntityForm(entityFormParam);

  useEffect(() => {
    if (entityId && entity) trackCta(SETTINGS_EVENT_VIEW, { entity, type: 'CUSTOM' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity, entityId]);

  const errorLoading = error && !entity;

  let content = null;

  if (loading) {
    content = <LoadingIndicator />;
  } else if (errorLoading) {
    content = (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={themes.default.ids.color.option.yellow['500']}>
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
    const entityType = getPluginName(entity.entityType, 1) ?? '';
    const isLegacyAppDataEntityType = isDeprecatedAppDataEntityType(entityType);
    const hasPermissionsToEditSmartAlerts =
      role.canConfigureApplicationSmartAlerts && role.canConfigureGlobalApplicationSmartAlerts;
    const isDeprecated = deprecateAppDataLegacyEventsEnabled && isLegacyAppDataEntityType;

    const isMigratable =
      isDeprecated &&
      hasPermissionsToEditSmartAlerts &&
      // only migrateable entities have the 'migrated' property set. For the other ones this prop is `undefined`, thus checking for false and not falsy.
      entity.migrated === false;

    const isMigrated = !!entity.migrated;

    const isDeleted = !!entity.deleted;

    const disallowAppDataLegacyEvent =
      isLegacyAppDataEntityType && (disallowAppDataLegacyEventsEnabled || hideAppDataLegacyEventsEnabled);
    const readOnly = isDeleted || isMigrated || disallowAppDataLegacyEvent;

    content = (
      <SettingsDetailPage>
        <Stack direction="horizontal" distribution="spaceBetween">
          <SubViewHeader>
            {isCreate
              ? t('in-settings:tabs.createANewEvent')
              : t('in-settings:tabs.configureEventEntityName', { entityName: entity.name })}
          </SubViewHeader>

          {isMigratable && !isDeleted && (
            <span style={{ alignSelf: 'center' }}>
              <MigrateToSmartAlerts eventSpecificationId={entityId} />
            </span>
          )}
        </Stack>
        <SectionLine />

        {(isDeleted || isDeprecated) && (
          <TrackingLegacyAppdataEventInfoMessage
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
          // when we already show an information above, we need to hide another message inside the form
          hideLegacyAppDataEventDeprecationInfo={isDeleted || isDeprecated}
        />

        <SaveCancel
          form={form}
          message={message}
          loading={loading}
          saveEnabled={saveEnabled && !readOnly}
          isCreate={isCreate}
          listPath={globalSettingsAlertingEvents}
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

function save(event, form, trackCta) {
  const isTriggering = form.get('triggering').value;
  const severity = Number(form.get('severity')?.value ?? 0);
  const entityType = form.get('entityType')?.value ?? null;
  const scopeType = form.get('applyOn')?.value ?? null;

  // TODO: Update cta later
  trackCta(SETTINGS_EVENT_SUBMIT, {
    scopeType,
    entityType,
    type: isTriggering ? 'Incident' : 'None',
    severity: getSeverityText(severity)
  });

  const eventSpecification = getEventSpecification(event, form);
  addTransientEventSetting(eventSpecification, form);
  return saveCustomEventSpecification(eventSpecification);
}

function addTransientEventSetting(eventSpecification, form) {
  eventSpecification.transientEventEnabled = form.get('transientEventEnabled').value ?? true;
  eventSpecification.transientEventThreshold = form.get('transientEventThreshold').value ?? 300000;
  eventSpecification.transientEventAlertMuted = form.get('transientEventAlertMuted').value ?? false;
  return eventSpecification;
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
    id: event?.id ?? null,
    name: form.get('name').value,
    triggering: form.get('triggering').value,
    description: form.get('description').value,
    expirationTime: form.get('gracePeriod').value,
    tagFilter: getTagFilterForHostAvailability(form),
    offlineDuration: Number(form.get('offlineDuration')?.value ?? 0),
    closeAfter: Number(form.get('closeAfter')?.value ?? 0),
    enabled: event?.enabled ?? true,
    severity: Number(form.get('severity')?.value ?? 0)
  };

  return createCustomSystemRuleBasedHostAvailability(hostAvailabilityFields);
}

function getEntityVerificationEventSpecification(form, query, event) {
  const entityVerificationFields = {
    id: event?.id ?? null,
    name: form.get('name').value,
    query,
    triggering: form.get('triggering').value,
    description: form.get('description').value,
    expirationTime: form.get('gracePeriod').value,
    enabled: event?.enabled ?? true,
    severity: Number(form.get('severity')?.value ?? 0),
    matchingEntityType: form.get('matchingEntityType')?.value ?? null,
    matchingOperator: form.get('matchingOperator')?.value ?? null,
    matchingEntityLabel: form.get('matchingEntityLabel')?.value ?? null,
    offlineDuration: Number(form.get('offlineDuration')?.value ?? 0)
  };

  return createCustomSystemRuleBasedEventSpecificationForEntityVerification(entityVerificationFields);
}

function getEntityCountEventSpecification(form, event) {
  const entityCountFields = {
    id: event?.id ?? null,
    name: form.get('name').value,
    triggering: form.get('triggering').value,
    description: form.get('description').value,
    expirationTime: form.get('gracePeriod').value,
    conditionOperator: form.get('conditionOperator').value,
    conditionValue: Number(form.get('conditionValue').value),
    enabled: event?.enabled ?? true,
    severity: Number(form.get('severity')?.value ?? 0)
  };

  return createCustomSystemRuleBasedEventSpecificationForEntityCount(entityCountFields);
}

function getEntityCountVerificationEventSpecification(form, query, event) {
  const entityCountVerificationFields = {
    id: event?.id ?? null,
    name: form.get('name').value,
    query,
    triggering: form.get('triggering').value,
    description: form.get('description').value,
    expirationTime: form.get('gracePeriod').value,
    enabled: event?.enabled ?? true,
    severity: Number(form.get('severity')?.value ?? 0),
    matchingEntityType: form.get('matchingEntityType')?.value ?? null,
    matchingOperator: form.get('matchingOperator')?.value ?? null,
    matchingEntityLabel: form.get('matchingEntityLabel')?.value ?? null,
    conditionOperator: form.get('conditionOperator').value,
    conditionValue: Number(form.get('conditionValue').value)
  };

  return createCustomSystemRuleBasedEventSpecificationForEntityCountVerification(entityCountVerificationFields);
}

function getCustomSystemRuleBasedEventSpecification(form, query, event) {
  return createCustomSystemRuleBasedEventSpecification(
    event?.id ?? null,
    form.get('name').value,
    // For now, all system rule based events use 'any' as their entity type. It does not make any sense to have this
    // attribute at all but the back end validation requires a value.
    'any',
    query,
    form.get('triggering').value,
    form.get('description').value,
    form.get('gracePeriod').value,
    event?.enabled ?? true,
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

    if (systemRule === entityCountDetection.id) {
      return getEntityCountEventSpecification(form, event);
    }

    if (systemRule === entityCountVerification.id) {
      return getEntityCountVerificationEventSpecification(form, query, event);
    }

    return getCustomSystemRuleBasedEventSpecification(form, query, event);
  }

  return getCustomEventMultiRuleBasedEventSpecification(form, query, event);
}

function getCustomEventMultiRuleBasedEventSpecification(form, query, event) {
  const severity = Number(form.get('severity')?.value ?? 0);
  const entityType = form.get('entityType')?.value ?? null;
  const rulesForm = form.get('rules');
  const rules = rulesForm?.map(formToRuleMapper({ entityType, severity }));
  const ruleLogicalOperator = form.get('ruleLogicalOperator').value;

  return createCustomMultiThresholdBasedEventSpecification(
    event?.id ?? null,
    entityType,
    form.get('gracePeriod').value,
    rules ?? [],
    ruleLogicalOperator,
    form.get('name').value,
    form.get('description').value,
    query,
    form.get('triggering').value,
    event?.enabled
  );
}

const formToRuleMapper =
  ({ severity, entityType }) =>
  ruleForm => {
    const formatterType = ruleForm.get('formatter')?.value ?? null;
    const aggregation = ruleForm.get('aggregation')?.value ?? null;
    let conditionValue = Number(ruleForm.get('conditionValue')?.value ?? 0);
    conditionValue = unmapConditionValue(conditionValue, formatterType, aggregation);

    let metricName = ruleForm.get('metricName')?.value ?? null;
    let metricPattern = null;

    if (isBuiltInDynamicMetric(entityType, metricName)) {
      const metricDefinition = getMetricDefinition(entityType, metricName);
      if (metricDefinition && metricDefinition.metricPattern) {
        metricPattern = {
          prefix: metricDefinition.metricPattern.pre,
          postfix: metricDefinition.metricPattern.post,
          operator: ruleForm.get('metricPatternOperator').value,
          placeholder: ruleForm.get('metricPatternPlaceholder')?.value ?? null
        };
        metricName = null;
      }
    }
    return createThresholdRule(
      metricName,
      metricPattern,
      ruleForm.get('rollup') ? Number(ruleForm.get('rollup').value) : 0,
      ruleForm.get('window') ? Number(ruleForm.get('window').value) : null,
      ruleForm.get('aggregation')?.value ?? null,
      ruleForm.get('conditionOperator')?.value ?? null,
      conditionValue,
      severity
    );
  };

function TrackingLegacyAppdataEventInfoMessage({ migrated, saved, disallowed, deleted }) {
  const { trackCta } = useSegmentTracking();
  useEffect(() => {
    if (!deleted) {
      trackCta(APPLICATIONS_ALERTING_DEPRECATED_EVENT_OPEN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleted]);

  return <LegacyAppdataEventInfoMessage migrated={migrated} saved={saved} disallowed={disallowed} deleted={deleted} />;
}

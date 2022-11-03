/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { combineLatest } from '@instana/observables';

import {
  createCustomThresholdBasedEventSpecification,
  getBuiltinEventActions,
  updateActionsAssignedToBuiltInEvent
} from 'in-api/eventSpecifications';
import { createBuiltinEventFormDefinition } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/BuiltinEventFormContent';
import ActionsSelection from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/ActionsSelection';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { teamSettingsAlertingEvents } from 'in-settings/navigation/paths';
import { getBuiltInEventSpecification } from 'in-api/eventSpecifications';
import { getFormatter } from 'in-services/formatters/backendFormatter';
import { actionAutomationEnabled } from 'in-services/featureFlags';
import SectionHeading from 'in-settings/components/SectionHeading';
import DescriptionText from 'in-components/form/DescriptionText';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import FormGroup from 'in-settings/components/FormGroup';
import Table from 'in-sdk/components/dashboard/Table';
import Section from 'in-settings/components/Section';
import { getPlainMetricList } from 'in-sdk/metrics';
import { compare } from 'in-services/util/number';
import PluginIcon from 'in-components/PluginIcon';
import { getPluginName } from 'in-sdk/pluginName';
import { goToPath } from 'in-stores/navigation';
import { find } from 'in-services/arrayUtils';
import Label from 'in-components/form/Label';
import entityForm from 'in-hoc/entityForm';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './BuiltInEvent.mless';

const paramCols = [
  stringColumn(t('in-settings:tabs.name'), 'name'),
  stringColumn(t('in-settings:tabs.description'), 'description', 120),
  formattedColumn(t('in-settings:tabs.value'), 'defaultValue')
];

export default function BuiltinEvent(props) {
  const entityId = props.match.params.id;

  function mergeResultData() {
    const eventDetails$ = getBuiltInEventSpecification(entityId);
    const actionDetails$ = getBuiltinEventActions(entityId);
    // calling Get Event and Get action associations call and combining results
    return combineLatest([eventDetails$, actionDetails$]).map(([eventResponse, actionResponse]) =>
      eventResponse.set(
        'actionIds',
        actionResponse.map(action => action.id)
      )
    );
  }

  function save(form) {
    const actionIds = form.get('actionIds')?.value ?? [];
    const actions = actionIds.length > 0 ? actionIds.map(value => ({ id: value })) : [];
    return updateActionsAssignedToBuiltInEvent(actions, entityId);
  }

  return (
    <Form
      title={t('in-settings:tabs.builtInEventDefinition')}
      entityId={entityId}
      createDefaultEntity={createCustomThresholdBasedEventSpecification}
      createForm={event => createBuiltinEventFormDefinition(event)}
      getEntityFromApi={
        role.canConfigureAutomationActions && actionAutomationEnabled ? mergeResultData : getBuiltInEventSpecification
      }
      openEntities={() => goToPath(teamSettingsAlertingEvents)}
      saveEntity={(_, form) => save(form)}
    />
  );
}

const Form = entityForm(function DetailsForm(props) {
  const { entity, form, setForm, isCreate, saveEnabled, message, error, loading } = props;

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

  const entityType = entity.get('shortPluginId');
  const metricList = getPlainMetricList(entityType);

  const paramRows = entity
    .get('hyperParams')
    .toArray()
    .map(param => ({
      key: param.get('id'),
      name: param.get('name'),
      description: param.get('description'),
      defaultValue: param.get('defaultValue'),
      valueFormat: param.get('valueFormat')
    }));

  return (
    <SettingsDetailPage>
      <Title title={t('in-settings:tabs.builtInEventDefinition')} />
      <SubViewHeader>{t('in-settings:tabs.configureBuiltInEvent', { eventName: entity.get('name') })}</SubViewHeader>
      <SectionLine />

      <FormGroup>
        <Label>{t('in-settings:tabs.entityType')}</Label>
        <div className={locals.flexWrapper}>
          <PluginIcon className={locals.entityIcon} color={theme.lib.colors.N600Light} plugin={entityType} />
          {getPluginName(entityType, 1)}
        </div>
      </FormGroup>
      <FormGroup>
        <Label>{t('in-settings:tabs.name')}</Label>
        {entity.get('name')}
      </FormGroup>
      <FormGroup>
        <Label>{t('in-settings:tabs.description')}</Label>
        {entity.get('description')}
      </FormGroup>
      <FormGroup>
        <Label>{t('in-settings:tabs.eventInputs')}</Label>
        <ul>
          {entity.get('ruleInputs').map((input, i) => {
            let label = input.get('inputName');
            if (input.get('inputKind') === 'METRIC') {
              const metricDefinition = find(metricList, _metric => _metric.value === label);
              if (metricDefinition) {
                label = metricDefinition.label;
              }
            }
            return (
              <li key={i}>
                {mapInputKind(input.get('inputKind'))} - {label}
              </li>
            );
          })}
        </ul>
      </FormGroup>
      <FormGroup moreMargin>
        <Label>{t('in-settings:tabs.parameters')}</Label>
        <Table cols={paramCols} rows={paramRows} />
      </FormGroup>
      {message ? (
        <Section>
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        </Section>
      ) : null}
      {role.canConfigureAutomationActions && actionAutomationEnabled && !entity.get('triggering') && (
        <>
          <SectionHeading>{t('in-settings:tabs.ActionAssociations')}</SectionHeading>
          <ActionsSelection
            form={form}
            setForm={setForm}
            name={entity.get('name')}
            descrption={entity.get('description')}
          />
        </>
      )}
      <SaveCancel
        form={form}
        message={message}
        loading={!entity}
        hasSaveButton={
          saveEnabled && role.canConfigureAutomationActions && actionAutomationEnabled && !entity.get('triggering')
        }
        isCreate={isCreate}
        listPath={teamSettingsAlertingEvents}
        cancelButtonLabel={t('in-settings:tabs.back')}
      />
    </SettingsDetailPage>
  );
});

function mapInputKind(kind) {
  switch (kind) {
    case 'METRIC':
      return t('in-settings:tabs.metric');
    case 'SNAPSHOT_FIELD':
      return t('in-settings:tabs.snapshotField');
    case 'EVENT':
      return t('in-settings:tabs.event');
    case 'DERIVED_METRIC':
      return t('in-settings:tabs.derivedMetric');
    case 'METRIC_PATTERN':
      return t('in-settings:tabs.metricPattern');
    default:
      return '?';
  }
}

function stringColumn(title, attr, width = 80) {
  return {
    title,
    type: 'string',
    width,
    typeArgs: {
      getValue(row) {
        return row[attr];
      }
    }
  };
}

function formattedColumn(title, attr) {
  return {
    title,
    type: 'custom',
    width: 50,
    typeArgs: {
      comparator: compare,
      get(row) {
        const valueFormat = row.valueFormat;
        const value = row[attr];

        return {
          value,
          content: getFormatter(valueFormat).detailed(value)
        };
      }
    }
  };
}

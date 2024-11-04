/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import { createBuiltinEventFormDefinition } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/BuiltinEventFormContent';
import { createCustomThresholdBasedEventSpecification } from 'in-api/eventSpecificationsHelpers';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { globalSettingsAlertingEvents } from 'in-settings/navigation/paths';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { getBuiltInEventSpecification } from 'in-api/eventSpecifications';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getFormatter } from 'in-services/formatters/backendFormatter';
import DescriptionText from 'in-components/form/DescriptionText';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import FormGroup from 'in-settings/components/FormGroup';
import { viewEventTracker } from 'in-settings/tracker';
import Table from 'in-sdk/components/dashboard/Table';
import Section from 'in-settings/components/Section';
import { getPlainMetricList } from 'in-sdk/metrics';
import { compare } from 'in-services/util/number';
import PluginIcon from 'in-components/PluginIcon';
import { getPluginName } from 'in-sdk/pluginName';
import { find } from 'in-services/arrayUtils';
import Label from 'in-components/form/Label';
import entityForm from 'in-hoc/entityForm';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './BuiltInEvent.mless';

const paramCols = [
  stringColumn(t('in-settings:tabs.name'), 'name'),
  stringColumn(t('in-settings:tabs.description'), 'description', 120),
  formattedColumn(t('in-settings:tabs.value'), 'defaultValue')
];

export default function BuiltinEvent(props) {
  const { goToPath } = useNavigation();
  const entityId = props.match.params.id;
  const entityData = useObservable(() => getBuiltInEventSpecification(entityId), []);

  useEffect(() => {
    if (entityData && entityData?.get('shortPluginId'))
      viewEventTracker({ id: entityId, entityType: entityData.get('shortPluginId'), type: 'BUILT_IN' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityData]);

  return (
    <Form
      title={t('in-settings:tabs.builtInEventDefinition')}
      entityId={entityId}
      createDefaultEntity={createCustomThresholdBasedEventSpecification}
      createForm={event => createBuiltinEventFormDefinition(event)}
      getEntityFromApi={getBuiltInEventSpecification}
      openEntities={() => goToPath(globalSettingsAlertingEvents)}
    />
  );
}

const Form = entityForm(function DetailsForm(props) {
  const { entity, form, message, error, loading } = props;

  if (!entity || !form) {
    return <LoadingIndicator />;
  }

  if (entity && entity.get('errors')) {
    return (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={themes.default.ids.color.option.yellow['500']}>
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
          <PluginIcon
            className={locals.entityIcon}
            color={themes.default.ids.color.option.neutral['600']}
            plugin={entityType}
          />
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
      <SaveCancel
        message=""
        loading={!event}
        isCreate={false}
        listPath={globalSettingsAlertingEvents}
        cancelButtonLabel={t('in-settings:tabs.back')}
        hasSaveButton={false}
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

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { teamSettingsAlertingEvents } from 'in-settings/navigation/paths';
import { getBuiltInEventSpecification } from 'in-api/eventSpecifications';
import { getFormatter } from 'in-services/formatters/backendFormatter';
import DescriptionText from 'in-components/form/DescriptionText';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import SaveCancel from 'in-settings/components/SaveCancel';
import FormGroup from 'in-settings/components/FormGroup';
import Table from 'in-sdk/components/dashboard/Table';
import { getPlainMetricList } from 'in-sdk/metrics';
import { compare } from 'in-services/util/number';
import PluginIcon from 'in-components/PluginIcon';
import { getPluginName } from 'in-sdk/pluginName';
import { find } from 'in-services/arrayUtils';
import Label from 'in-components/form/Label';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './BuiltInEvent.mless';

const paramCols = [
  stringColumn(t('in-settings:tabs.name'), 'name'),
  stringColumn(t('in-settings:tabs.description'), 'description', 120),
  formattedColumn(t('in-settings:tabs.value'), 'defaultValue')
];

export default connectTo(
  props => ({
    event: getBuiltInEventSpecification(props.match.params.id)
  }),
  function EventBuiltIn({ event }) {
    if (!event) {
      return <LoadingIndicator />;
    }

    if (event && event.get('errors')) {
      return (
        <SettingsDetailPage>
          <SubViewHeader iconType="lib_help_error_error_circle" iconColor={theme.lib.colors.yellow800}>
            {t('in-settings:tabs.unknownEvent')}
          </SubViewHeader>
          <SectionLine />
          <DescriptionText>
            {event.get('errors').get(0)}
            <br />
            {t('in-settings:tabs.ifYouFollowedALinkToGetHereItHasMostLikelyBeenDeleted')}
          </DescriptionText>
        </SettingsDetailPage>
      );
    }

    const entityType = event.get('shortPluginId');
    const metricList = getPlainMetricList(entityType);

    const paramRows = event
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
        <SubViewHeader>{t('in-settings:tabs.configureBuiltInEvent', { eventName: event.get('name') })}</SubViewHeader>
        <SectionLine />

        <FormGroup>
          <Label>{t('in-settings:tabs.entityType')}</Label>
          <div className={locals.flexWrapper}>
            <PluginIcon className={locals.entityIcon} color="#000" plugin={entityType} />
            {getPluginName(entityType, 1)}
          </div>
        </FormGroup>
        <FormGroup>
          <Label>{t('in-settings:tabs.name')}</Label>
          {event.get('name')}
        </FormGroup>
        <FormGroup>
          <Label>{t('in-settings:tabs.description')}</Label>
          {event.get('description')}
        </FormGroup>
        <FormGroup>
          <Label>{t('in-settings:tabs.eventInputs')}</Label>
          <ul>
            {event.get('ruleInputs').map((input, i) => {
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
        <SaveCancel
          message=""
          loading={!event}
          isCreate={false}
          listPath={teamSettingsAlertingEvents}
          cancelButtonLabel={t('in-settings:tabs.back')}
          hasSaveButton={false}
        />
      </SettingsDetailPage>
    );
  }
);

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
          content: getFormatter(valueFormat)(value)
        };
      }
    }
  };
}

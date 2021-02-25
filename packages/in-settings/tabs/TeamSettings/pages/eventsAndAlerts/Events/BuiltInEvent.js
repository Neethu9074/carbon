/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import theme from 'in-themes';
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

import locals from './BuiltInEvent.mless';

const paramCols = [
  stringColumn('Name', 'name'),
  stringColumn('Description', 'description', 120),
  formattedColumn('Value', 'defaultValue')
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
            Unknown Event
          </SubViewHeader>
          <SectionLine />
          <DescriptionText>
            {event.get('errors').get(0)}
            <br />
            If you followed a link to get here, it has most likely been deleted.
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
        <Title title="Built-in Event Definition" />
        <SubViewHeader>Configure Built-in Event: {event.get('name')}</SubViewHeader>
        <SectionLine />

        <FormGroup>
          <Label>Entity type</Label>
          <div className={locals.flexWrapper}>
            <PluginIcon className={locals.entityIcon} color="#000" plugin={entityType} />
            {getPluginName(entityType, 1)}
          </div>
        </FormGroup>
        <FormGroup>
          <Label>Name</Label>
          {event.get('name')}
        </FormGroup>
        <FormGroup>
          <Label>Description</Label>
          {event.get('description')}
        </FormGroup>
        <FormGroup>
          <Label>Event inputs</Label>
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
          <Label>Parameters</Label>
          <Table cols={paramCols} rows={paramRows} />
        </FormGroup>
        <SaveCancel
          message=""
          loading={!event}
          isCreate={false}
          listPath={teamSettingsAlertingEvents}
          cancelButtonLabel="Back"
          hasSaveButton={false}
        />
      </SettingsDetailPage>
    );
  }
);

function mapInputKind(kind) {
  switch (kind) {
    case 'METRIC':
      return 'Metric';
    case 'SNAPSHOT_FIELD':
      return 'Snapshot field';
    case 'EVENT':
      return 'Event';
    case 'DERIVED_METRIC':
      return 'Derived metric';
    case 'METRIC_PATTERN':
      return 'Metric pattern';
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

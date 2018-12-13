import React from 'react';

import {
  formatterTypeToLabel,
  mapConditionValue
} from 'in-views/configurationView/subview/Rules/components/RuleDetails';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import { builtInRulesPath } from 'in-stores/navigation/paths/settingPaths';
import Section from 'in-views/configurationView/components/Section';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Table from 'in-sdk/components/dashboard/Table';
import { getPlainMetricList } from 'in-sdk/metrics';
import { compare } from 'in-services/util/number';
import PluginIcon from 'in-components/PluginIcon';
import { getSingular } from 'in-sdk/pluginName';
import { goToPath } from 'in-stores/navigation';
import { getBuiltInRule } from 'in-api/rules';
import { find } from 'in-services/arrayUtils';
import Label from 'in-components/form/Label';
import connectTo from 'in-hoc/connectTo';
import Button from 'in-components/Button';
import Title from 'in-components/Title';

import locals from './RuleBuiltIn.mless';

const paramCols = [
  stringColumn('Name', 'name'),
  stringColumn('Description', 'description', 120),
  formattedColumn('Value', 'defaultValue')
];

export default connectTo(
  props => ({
    rule: getBuiltInRule(props.match.params.ruleId)
  }),
  function RuleBuiltIn({ rule }) {
    if (!rule) {
      return <LoadingIndicator type="dark" />;
    }

    const entityType = rule.get('shortPluginId');
    const metricList = getPlainMetricList(entityType);

    const paramRows = rule
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
      <SubViewWrapper>
        <Title title="Built-in Rule" />
        <SubViewHeader>Configure Built-in Rule: {rule.get('name')}</SubViewHeader>

        <Section>
          <Button kind="success" onClick={() => goToPath(builtInRulesPath)}>
            Back
          </Button>
        </Section>
        <Section>
          <Label>Entity type</Label>
          <div className={locals.flexWrapper}>
            <PluginIcon className={locals.entityIcon} dimension={16} color="#000" plugin={entityType} />
            {getSingular(entityType)}
          </div>
        </Section>
        <Section>
          <Label>Name</Label>
          <p>{rule.get('name')}</p>
        </Section>
        <Section>
          <Label>Description</Label>
          <p>{rule.get('description')}</p>
        </Section>
        <Section>
          <Label>Rule inputs</Label>
          <ul>
            {rule.get('ruleInputs').map((input, i) => {
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
        </Section>
        <Section>
          <Label>Parameters</Label>
          <Table cols={paramCols} rows={paramRows} />
        </Section>
      </SubViewWrapper>
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
        const valueUnit = formatterTypeToLabel(row.valueFormat);
        const value = mapConditionValue(row[attr], row.valueFormat);
        return {
          value,
          content: `${value} ${valueUnit}`
        };
      }
    }
  };
}

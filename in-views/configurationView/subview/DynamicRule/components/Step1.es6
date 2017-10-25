import React from 'react';

import MatchingEntityTable from 'in-views/configurationView/subview/DynamicRule/components/MatchingEntityTable';
import SectionLine from 'in-views/configurationView/subview/DynamicRule/components/SectionLine';
import RuleControl from 'in-views/configurationView/subview/DynamicRule/components/RuleControl';
import TooltipIcon from 'in-views/configurationView/subview/DynamicRule/components/TooltipIcon';
import MetricSelector from 'in-views/configurationView/subview/Rule/MetricSelector';
import Step from 'in-views/configurationView/subview/DynamicRule/components/Step';
import ValidationBlock from 'in-components/form/ValidationBlock';
import FormGroup from 'in-components/form/FormGroup';
import { servicePlugins } from 'in-forge/constants';
import { getSingular } from 'in-sdk/pluginName';
import { getCategories } from 'in-sdk/metrics';
import { Row, Col } from 'in-components/Grid';
import ComboBox from 'in-components/ComboBox';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import './Step1.less';

const block = 'in-dynamic-rule-dialog-step-1';
const furtherPluginsToFilter = [
  'unknownService',
  'defaultLogicalService',
  'defaultServiceInstance',
  'defaultLogicalConnection'
];
const pluginsWithMetricDefinitions = Object.keys(servicePlugins)
  .map(key => servicePlugins[key])
  .filter(plugin => furtherPluginsToFilter.indexOf(plugin) < 0)
  .filter(plugin => getCategories(plugin).length > 0)
  .sort((a, b) => getSingular(a).localeCompare(getSingular(b)));

export default function Step1({ form, onChange, excludeEntity, includeEntity }) {
  return (
    <Step number={1} title="Entities & Metrics" form={form} onChange={onChange}>
      <RuleControl name="Entity type and metric">
        <Row>
          <Col cols={6}>
            {form.get('entityType').map(field => (
              <FormGroup className={`${block}__select`}>
                <Label htmlFor="rule-entityType" hasError={!field.valid}>
                  Entity type
                </Label>
                <ComboBox
                  name="rule-entityType"
                  value={field.value}
                  options={[{ value: '', label: 'Please select' }].concat(
                    pluginsWithMetricDefinitions.map(plugin => {
                      return {
                        value: plugin,
                        label: getSingular(plugin)
                      };
                    })
                  )}
                  onChange={e => onChange(['entityType', 'metricName'], [e ? e.value : '-1', '-1'])}
                />
                {field.messages.map((message, i) => (
                  <ValidationBlock hasError key={i}>
                    {message.message}
                  </ValidationBlock>
                ))}
              </FormGroup>
            ))}
          </Col>
          <Col cols={6}>
            {form.get('metricName').map(field => (
              <FormGroup className={`${block}__select`}>
                <Label htmlFor="rule-metricName" hasError={!field.valid}>
                  Metric
                </Label>
                {form.get('entityType').value ? (
                  <MetricSelector
                    id="rule-metricName"
                    plugin={form.get('entityType').value}
                    value={form.get('metricName').value}
                    useComboBox
                    onChange={e => onChange('metricName', e ? e.value : '')}
                  />
                ) : (
                  <ComboBox options={[]} />
                )}
                {field.messages.map((message, i) => (
                  <ValidationBlock hasError key={i}>
                    {message.message}
                  </ValidationBlock>
                ))}
              </FormGroup>
            ))}
          </Col>
        </Row>
      </RuleControl>

      <SectionLine />

      <RuleControl name="Entities matched" helpComponent={MatchingEntitiesHelpBox}>
        {form.get('query').map(field => (
          <FormGroup>
            <div className={`${block}__filter-label-wrapper`}>
              <Label className={`${block}__filter-label`} htmlFor="rule-query" hasError={!field.valid}>
                Filter query
              </Label>
              <TooltipIcon tooltip="Apply a filter query to narrow down the number of entities the rule shall be applied on. If no filter query is given, it will be applied on all entities." />
            </div>
            <Input
              id="rule-query"
              type="text"
              className={`${block}__helpfified_input`}
              value={field.value}
              onChange={e => onChange('query', e.target.value)}
              hasError={!field.valid}
            />
            {form.get('matchingEntities').map(field =>
              field.messages.map((message, i) => (
                <ValidationBlock hasError key={i}>
                  {message.message}
                </ValidationBlock>
              ))
            )}
            {field.messages.map((message, i) => (
              <ValidationBlock hasError key={i}>
                {message.message}
              </ValidationBlock>
            ))}
            <MatchingEntityTable form={form} excludeEntity={excludeEntity} includeEntity={includeEntity} />
          </FormGroup>
        ))}
      </RuleControl>
    </Step>
  );
}

function MatchingEntitiesHelpBox() {
  return (
    <div className={`${block}__matching-entities-help-box`}>
      <span className={`${block}__matching-entities-help-box-beta`}>beta</span>
      <br />
      <br />
      <span>This feature is currently in testing phase. </span>
      <br />
      <br />
      <span>
        The number of entities that can be monitored by a dynamic rule is limited to{' '}
        <span className={`${block}__num-entities-during-beta`}>10</span> during the beta. Please narrow down the
        entities by adding a filter query and/or excluding entities.
      </span>
    </div>
  );
}

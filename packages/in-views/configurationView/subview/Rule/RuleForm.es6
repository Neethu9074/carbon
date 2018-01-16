import React from 'react';

import MetricSelector from 'in-views/configurationView/subview/Rule/MetricSelector';
import Section from 'in-views/configurationView/components/Section';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Helpify from 'in-components/form/Helpify';
import { getSingular } from 'in-sdk/pluginName';
import { getCategories } from 'in-sdk/metrics';
import ComboBox from 'in-components/ComboBox';
import { Row, Col } from 'in-components/Grid';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { plugins } from 'in-forge/constants';

import './RuleForm.less';

const block = 'in-rule-form';
const furtherPluginsToFilter = [
  'unknownService',
  'defaultLogicalService',
  'defaultServiceInstance',
  'defaultLogicalConnection'
];
const pluginsWithMetricDefinitions = Object.keys(plugins)
  .map(key => plugins[key])
  .filter(plugin => furtherPluginsToFilter.indexOf(plugin) < 0)
  .filter(plugin => getCategories(plugin).length > 0)
  .sort((a, b) => getSingular(a).localeCompare(getSingular(b)));

export default function RuleForm({ form, onChange }) {
  function isPercentile() {
    if (
      form &&
      form.get('entityType') &&
      form.get('entityType').value &&
      form.get('metricName') &&
      form.get('metricName').value
    ) {
      const categories = getCategories(form.get('entityType').value);
      const metricName = form.get('metricName').value;
      if (!categories) {
        return false;
      }

      let isPercentile = false;
      categories.forEach(category => {
        if (category.children) {
          category.children.forEach(child => {
            if (metricName === child.metric && child.isPercentile) {
              isPercentile = true;
              return;
            }
          });
        } else if (metricName === category.metric && category.isPercentile) {
          isPercentile = true;
        }

        if (isPercentile) {
          return;
        }
      });
      return isPercentile;
    }
    return false;
  }

  return (
    <fieldset>
      <Section>
        {form.get('name').map(field => (
          <FormGroup>
            <Label htmlFor="rule-name" hasError={!field.valid && field.touched}>
              Name
            </Label>
            <Helpify helpText="Rules can be selected by name in the rule binding dialog.">
              <Input
                id="rule-name"
                type="text"
                className={`${block}__helpfified_input`}
                value={field.value}
                onChange={e => onChange('name', e.target.value)}
                hasError={!field.valid && field.touched}
                autoFocus
              />
              <TouchedMessages field={field} />
            </Helpify>
          </FormGroup>
        ))}
      </Section>

      <Section>
        {form.get('entityType').map(field => (
          <FormGroup>
            <Label htmlFor="rule-entityType" hasError={!field.valid && field.touched}>
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
            <TouchedMessages field={field} />
          </FormGroup>
        ))}

        <Row>
          <Col cols={4}>
            {form.get('entityType').value
              ? form.get('metricName').map(field => (
                  <FormGroup>
                    <Label htmlFor="rule-metricName" hasError={!field.valid && field.touched}>
                      Metric
                    </Label>
                    <MetricSelector
                      id="rule-metricName"
                      plugin={form.get('entityType').value}
                      value={form.get('metricName').value}
                      useComboBox
                      onChange={e => onChange('metricName', e ? e.value : '')}
                    />
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))
              : null}
          </Col>
          {!isPercentile() ? (
            <Col cols={2}>
              {form.get('window').map(field => (
                <FormGroup>
                  <Label htmlFor="rule-window" hasError={!field.valid && field.touched}>
                    Time window
                  </Label>
                  <ComboBox
                    name="rule-window"
                    value={field.value}
                    options={[
                      { value: '', label: 'Please select' },
                      { value: '1000', label: '1 s' },
                      { value: '5000', label: '5 s' },
                      { value: '10000', label: '10 s' },
                      { value: '60000', label: '1 min' },
                      { value: '300000', label: '5 min' },
                      { value: '600000', label: '10 min' }
                    ]}
                    onChange={e => onChange('window', e ? e.value : '')}
                  />
                  <TouchedMessages field={field} />
                </FormGroup>
              ))}
            </Col>
          ) : null}
          {isPercentile() ? (
            <Col cols={2}>
              {form.get('rollup').map(field => (
                <FormGroup>
                  <Label htmlFor="rule-rollup" hasError={!field.valid && field.touched}>
                    Window Size
                  </Label>
                  <ComboBox
                    name="rule-rollup"
                    value={field.value}
                    options={[
                      { value: '', label: 'Please select' },
                      { value: '5000', label: '5s' },
                      { value: '60000', label: '1 min' },
                      { value: '300000', label: '5 min' },
                      { value: '3600000', label: '1 hour' }
                    ]}
                    onChange={e => onChange('rollup', e ? e.value : '')}
                  />
                  <TouchedMessages field={field} />
                </FormGroup>
              ))}
            </Col>
          ) : null}
          {!isPercentile() ? (
            <Col cols={2}>
              {form.get('aggregation').map(field => (
                <FormGroup>
                  <Label htmlFor="rule-aggregation" hasError={!field.valid && field.touched}>
                    Aggregation
                  </Label>
                  <ComboBox
                    name="rule-aggregation"
                    value={field.value}
                    options={[
                      { value: '', label: 'Please select' },
                      { value: 'avg', label: 'avg' },
                      { value: 'sum', label: 'sum' }
                    ]}
                    onChange={e => onChange('aggregation', e ? e.value : e)}
                  />
                  <TouchedMessages field={field} />
                </FormGroup>
              ))}
            </Col>
          ) : null}
          <Col cols={2}>
            {form.get('conditionOperator').map(field => (
              <FormGroup>
                <Label htmlFor="rule-conditionOperator" hasError={!field.valid && field.touched}>
                  Operator
                </Label>
                <ComboBox
                  name="rule-conditionOperator"
                  value={field.value}
                  options={[
                    { value: '', label: 'Please select' },
                    { value: '<', label: '<' },
                    { value: '<=', label: '<=' },
                    { value: '==', label: '==' },
                    { value: '>=', label: '>=' },
                    { value: '>', label: '>' },
                    { value: '!=', label: '!=' }
                  ]}
                  onChange={e => onChange('conditionOperator', e ? e.value : e)}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Col>
          <Col cols={2}>
            {form.get('conditionValue').map(field => (
              <FormGroup>
                <Label htmlFor="rule-conditionValue" hasError={!field.valid && field.touched}>
                  Value
                </Label>
                <Input
                  id="rule-conditionValue"
                  type="text"
                  value={field.value}
                  onChange={e => onChange('conditionValue', e.target.value)}
                  hasError={!field.valid && field.touched}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Col>
        </Row>
      </Section>
    </fieldset>
  );
}

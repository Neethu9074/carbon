import { createMapForm, createField, notBlankValidator } from 'formalistic';
import React from 'react';

import { defaultAndUnknownPluginNames, plugins10, plugins20 } from 'in-forge/constants';
import MetricSelector from 'in-views/configurationView/subview/Rule/MetricSelector';
import Section from 'in-views/configurationView/components/Section';
import { getCategories, isMetricPercentile } from 'in-sdk/metrics';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import FormGroup from 'in-components/form/FormGroup';
import Helpify from 'in-components/form/Helpify';
import { getSingular } from 'in-sdk/pluginName';
import ComboBox from 'in-components/ComboBox';
import { Row, Col } from 'in-components/Grid';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

import './RuleForm.less';

const block = 'in-rule-form';

const plugins = twoZeroModeEnabled ? plugins20 : plugins10;
const pluginsWithMetricDefinitions = Object.keys(plugins)
  .map(key => plugins[key])
  .filter(plugin => defaultAndUnknownPluginNames.indexOf(plugin) < 0)
  .filter(plugin => getCategories(plugin).length > 0)
  .sort((a, b) => getSingular(a).localeCompare(getSingular(b)));

function putWindowField(form, rule) {
  return form.put(
    'window',
    createField({
      value: String(rule.get('window')),
      validator: notBlankValidator
    })
  );
}

function putRollupField(form, rule) {
  return form.put(
    'rollup',
    createField({
      value: String(rule.get('rollup')),
      validator: notBlankValidator
    })
  );
}

function putAggregationField(form, rule) {
  return form.put(
    'aggregation',
    createField({
      value: rule.get('aggregation'),
      validator: notBlankValidator
    })
  );
}

export function ruleFormDefinition(rule) {
  let form = createMapForm()
    .put(
      'name',
      createField({
        value: rule ? rule.get('name') : '',
        validator: notBlankValidator
      })
    )
    .put(
      'entityType',
      createField({
        value: rule ? rule.get('entityType') : undefined,
        validator: notBlankValidator
      })
    )
    .put(
      'metricName',
      createField({
        value: rule ? rule.get('metricName') : '',
        validator: metricName => {
          return metricName && metricName != '-1' && metricName.length > 0
            ? null
            : [
                {
                  severity: 'error',
                  message: `Please enter a valid metric.`
                }
              ];
        }
      })
    );
  form = putWindowField(form, rule);
  form = putRollupField(form, rule);
  form = putAggregationField(form, rule);

  return form
    .put(
      'window',
      createField({
        value: String(rule.get('window')),
        validator: notBlankValidator
      })
    )
    .put(
      'rollup',
      createField({
        value: String(rule.get('rollup')),
        validator: notBlankValidator
      })
    )
    .put(
      'aggregation',
      createField({
        value: rule.get('aggregation'),
        validator: notBlankValidator
      })
    )
    .put(
      'conditionOperator',
      createField({
        value: rule.get('conditionOperator'),
        validator: notBlankValidator
      })
    )
    .put(
      'conditionValue',
      createField({
        value: String(rule.get('conditionValue')),
        validator(value) {
          const n = Number(value);
          if (isNaN(n)) {
            return [
              {
                severity: 'error',
                message: 'Please enter a number (use . as a decimal separator).'
              }
            ];
          }
          return null;
        }
      })
    );
}

export default function RuleForm({ form, onChange }) {
  function isPercentile(localForm = form) {
    if (
      !localForm ||
      !localForm.get('entityType') ||
      !localForm.get('entityType').value ||
      !localForm.get('metricName') ||
      !localForm.get('metricName').value
    ) {
      return false;
    }

    let metricName = localForm.get('metricName').value;
    let entityType = localForm.get('entityType').value;
    return isMetricPercentile(entityType, metricName);
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
                      onChange={e =>
                        onChange(
                          'metricName', //
                          e ? e.value : '', //
                          (updatedForm, rule) => {
                            if (isPercentile(updatedForm)) {
                              updatedForm = updatedForm.remove('window').remove('aggregation');
                              updatedForm = putRollupField(updatedForm, rule);
                              return updatedForm;
                            } else {
                              updatedForm = updatedForm.remove('rollup');
                              updatedForm = putWindowField(updatedForm, rule);
                              updatedForm = putAggregationField(updatedForm, rule);
                              return updatedForm;
                            }
                          }
                        )
                      }
                    />
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))
              : null}
          </Col>
          {!isPercentile() && (
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
          )}
          {isPercentile() && (
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
          )}
          {!isPercentile() && (
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
          )}
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

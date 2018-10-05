import { createMapForm, createField, notBlankValidator } from 'formalistic';
import React from 'react';

import {
  defaultAndUnknownPluginNames,
  plugins10,
  plugins20,
  pluginsDeprecatedIn20,
  oneZeroServicePlugins
} from 'in-forge/constants';
import { containsMetricInList, createMetricListItem, isBuiltInMetric } from 'in-sdk/metrics';
import MetricSelector from 'in-views/configurationView/subview/Rule/MetricSelector';
import Section from 'in-views/configurationView/components/Section';
import { getCategories, isMetricPercentile } from 'in-sdk/metrics';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import FormGroup from 'in-components/form/FormGroup';
import { getCustom } from 'in-api/metricsCatalog';
import Helpify from 'in-components/form/Helpify';
import { getSingular } from 'in-sdk/pluginName';
import ComboBox from 'in-components/ComboBox';
import { Row, Col } from 'in-components/Grid';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import connectTo from 'in-hoc/connectTo';

import './RuleForm.less';

const block = 'in-rule-form';

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

function isDeprecatedEntityType(entityType) {
  return Boolean(pluginsDeprecatedIn20[entityType]);
}

function is20EntityType(entityType) {
  return Boolean(plugins20[entityType]);
}

function is10ServiceType(entityType) {
  return Boolean(oneZeroServicePlugins[entityType]);
}

function notBlankOrDeprecatedValidator(entityType) {
  if (!entityType || entityType.trim().length === 0) {
    return [
      {
        severity: 'error',
        message: 'The entity type value must not be blank'
      }
    ];
  }

  if (twoZeroModeEnabled && isDeprecatedEntityType(entityType)) {
    return [
      {
        severity: 'error',
        message: `This entity type has been deprecated. Please choose a different type.`
      }
    ];
  }

  return null;
}

export function ruleFormDefinition(rule) {
  const entityType = rule ? rule.get('entityType') : '';
  const metricName = rule ? rule.get('metricName') : '';

  let origin = rule ? rule.get('origin') : '';
  if (!origin && entityType && metricName) {
    origin = isBuiltInMetric(entityType, metricName) ? 'built-in' : 'custom';
  }

  let form = createMapForm()
    .put(
      'name',
      createField({
        value: rule ? rule.get('name') : '',
        validator: notBlankValidator
      })
    )
    .put(
      'origin',
      createField({
        value: origin,
        validator: notBlankValidator
      })
    )
    .put(
      'entityType',
      createField({
        value: entityType,
        validator: notBlankOrDeprecatedValidator
      })
    )
    .put(
      'metricName',
      createField({
        value: metricName,
        validator: metricName => {
          return metricName && metricName != '' && metricName.length > 0
            ? null
            : [
                {
                  severity: 'error',
                  message: `Please enter a valid metric.`
                }
              ];
        }
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

  if (isMetricPercentile(entityType, metricName)) {
    form = putRollupField(form, rule);
  } else {
    form = putWindowField(form, rule);
    form = putAggregationField(form, rule);
  }

  return form;
}

export default connectTo(
  {
    customMetrics: getCustom().map(metricInstances => {
      const customMetricsList = [];
      metricInstances.map(metricInstance => {
        customMetricsList.push(
          createMetricListItem(
            metricInstance.get('metricId'),
            metricInstance.get('formatter'),
            metricInstance.get('label'),
            false,
            metricInstance.get('pluginId')
          )
        );
      });

      return customMetricsList;
    })
  },
  function RuleForm({ entity, form, onChange, customMetrics }) {
    // extend custom-metrics list with current selected custom-metric,
    // in case it is not contained in the list. This might happen due to
    // deprecation or there is no such metric anymore
    addCurrentCustomMetricToListIfMissing(form, customMetrics);

    function addCurrentCustomMetricToListIfMissing(form, customMetricsList) {
      if (!form || !customMetricsList) {
        return;
      }

      if (
        form.get('origin') &&
        form.get('origin').value === 'custom' &&
        form.get('entityType') &&
        form.get('entityType').value &&
        form.get('metricName') &&
        form.get('metricName').value
      ) {
        const entityType = form.get('entityType').value;
        const metricName = form.get('metricName').value;

        if (entityType && metricName) {
          if (!containsMetricInList(customMetricsList, metricName)) {
            customMetrics.push(
              createMetricListItem(
                metricName,
                entity.get('formatter'),
                entity.get('label'),
                true, // in this case we add the metric, to better understand the missing/deprecated metric
                entityType
              )
            );
          }
        }
      }
    }

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

    function getEntityTypeOfCustomMetric(metricId) {
      for (var i = 0; i < customMetrics.length; i++) {
        if (customMetrics[i].value === metricId) {
          return customMetrics[i].entityType;
        }
      }
      return null;
    }

    const plugins = twoZeroModeEnabled ? plugins20 : plugins10;
    const pluginsWithMetricDefinitions = Object.keys(plugins)
      .map(k => plugins[k])
      .filter(plugin => defaultAndUnknownPluginNames.indexOf(plugin) < 0)
      .filter(plugin => getCategories(plugin).length > 0)
      .sort((a, b) => getSingular(a).localeCompare(getSingular(b)))
      .map(plugin => {
        return {
          value: plugin,
          label: getSingular(plugin)
        };
      });
    form.get('entityType').map(field => {
      if (twoZeroModeEnabled && isDeprecatedEntityType(field.value)) {
        pluginsWithMetricDefinitions.push({
          value: field.value,
          label: getSingular(field.value) + ' (deprecated)'
        });
        pluginsWithMetricDefinitions.sort((a, b) => a.label.localeCompare(b.label));
      }
      if (twoZeroModeEnabled && is10ServiceType(field.value)) {
        pluginsWithMetricDefinitions.push({
          value: field.value,
          label: getSingular(field.value)
        });
        pluginsWithMetricDefinitions.sort((a, b) => a.label.localeCompare(b.label));
      }
      if (!twoZeroModeEnabled && is20EntityType(field.value)) {
        pluginsWithMetricDefinitions.push({
          value: field.value,
          label: getSingular(field.value)
        });
        pluginsWithMetricDefinitions.sort((a, b) => a.label.localeCompare(b.label));
      }
    });

    return (
      <fieldset>
        <Section>
          {form.get('name').map(field => (
            <FormGroup>
              <Label htmlFor="rule-name" hasError={!field.valid && field.touched}>
                Name
              </Label>
              <Helpify helpText="Rules can be selected by name in the Custom Issues dialog.">
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
          {form.get('origin').map(field => (
            <FormGroup>
              <Label htmlFor="rule-origin" hasError={!field.valid && field.touched}>
                Origin
              </Label>
              <ComboBox
                name="rule-origin"
                value={field.value}
                options={[
                  { value: 'built-in', label: 'Built-in metrics' },
                  { value: 'custom', label: 'Custom metrics' }
                ]}
                onChange={e => {
                  if (e && e.value != field.value) {
                    onChange(['origin', 'entityType', 'metricName'], [e ? e.value : '', '', ''], updatedForm => {
                      // manually set to not-touched to prevent showing the validation-error
                      updatedForm = updatedForm.updateIn(['entityType'], function(f) {
                        return f.setTouched(false);
                      });
                      updatedForm = updatedForm.updateIn(['metricName'], function(f) {
                        return f.setTouched(false);
                      });
                      return updatedForm;
                    });
                  }
                }}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}

          {form.get('origin').value && form.get('origin').value === 'built-in'
            ? form.get('entityType').map(field => (
                <FormGroup>
                  <Label htmlFor="rule-entityType" hasError={!field.valid && field.touched}>
                    Entity type
                  </Label>
                  <ComboBox
                    name="rule-entityType"
                    value={field.value}
                    options={pluginsWithMetricDefinitions}
                    onChange={e => {
                      if (e && e.value != field.value) {
                        onChange(['entityType', 'metricName'], [e ? e.value : '', ''], updatedForm => {
                          // manually set to not-touched to prevent showing the validation-error
                          updatedForm = updatedForm.updateIn(['metricName'], f => {
                            return f.setTouched(false);
                          });
                          return updatedForm;
                        });
                      }
                    }}
                  />
                  <TouchedMessages field={field} />
                </FormGroup>
              ))
            : null}

          {form.get('origin').value && (form.get('origin').value === 'custom' || form.get('entityType').value)
            ? form.get('metricName').map(field => (
                <FormGroup>
                  <Label htmlFor="rule-metricName" hasError={!field.valid && field.touched}>
                    Metric
                  </Label>
                  <MetricSelector
                    id="rule-metricName"
                    plugin={form.get('entityType').value}
                    value={form.get('metricName').value}
                    metrics={form.get('origin').value === 'custom' ? customMetrics : null}
                    useComboBox
                    onChange={e => {
                      if (e && e.value != field.value) {
                        onChange('metricName', e ? e.value : '', (updatedForm, rule) => {
                          if (isPercentile(updatedForm)) {
                            updatedForm = updatedForm.remove('window').remove('aggregation');
                            updatedForm = putRollupField(updatedForm, rule);
                          } else {
                            updatedForm = updatedForm.remove('rollup');
                            updatedForm = putWindowField(updatedForm, rule);
                            updatedForm = putAggregationField(updatedForm, rule);
                          }

                          if (form.get('origin').value === 'custom') {
                            // manually update the hidden hidden entityType field in case of custom metrics
                            updatedForm = updatedForm.updateIn(['entityType'], f => {
                              const entityType = getEntityTypeOfCustomMetric(e.value);
                              return f.setValue(entityType);
                            });
                          }
                          return updatedForm;
                        });
                      }
                    }}
                  />
                  <TouchedMessages field={field} />
                </FormGroup>
              ))
            : null}

          {form.get('origin').value && (form.get('origin').value === 'custom' || form.get('entityType').value) ? (
            <Row>
              {!isPercentile() && (
                <Col cols={3}>
                  {form.get('window').map(field => (
                    <FormGroup>
                      <Label htmlFor="rule-window" hasError={!field.valid && field.touched}>
                        Time window
                      </Label>
                      <ComboBox
                        name="rule-window"
                        value={field.value}
                        options={[
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
                <Col cols={3}>
                  {form.get('rollup').map(field => (
                    <FormGroup>
                      <Label htmlFor="rule-rollup" hasError={!field.valid && field.touched}>
                        Window Size
                      </Label>
                      <ComboBox
                        name="rule-rollup"
                        value={field.value}
                        options={[
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
                <Col cols={3}>
                  {form.get('aggregation').map(field => (
                    <FormGroup>
                      <Label htmlFor="rule-aggregation" hasError={!field.valid && field.touched}>
                        Aggregation
                      </Label>
                      <ComboBox
                        name="rule-aggregation"
                        value={field.value}
                        options={[{ value: 'avg', label: 'avg' }, { value: 'sum', label: 'sum' }]}
                        onChange={e => onChange('aggregation', e ? e.value : e)}
                      />
                      <TouchedMessages field={field} />
                    </FormGroup>
                  ))}
                </Col>
              )}
              <Col cols={3}>
                {form.get('conditionOperator').map(field => (
                  <FormGroup>
                    <Label htmlFor="rule-conditionOperator" hasError={!field.valid && field.touched}>
                      Operator
                    </Label>
                    <ComboBox
                      name="rule-conditionOperator"
                      value={field.value}
                      options={[
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
              <Col cols={3}>
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
          ) : null}
        </Section>
      </fieldset>
    );
  }
);

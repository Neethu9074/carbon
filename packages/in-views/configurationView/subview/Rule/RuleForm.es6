import { fromJS } from 'immutable';
import { createMapForm, createField, notBlankValidator } from 'formalistic';
import React from 'react';

import {
  plugins10,
  plugins20,
  pluginsDeprecatedIn20,
  oneZeroServicePlugins,
  customIssuesDisabledForPlugins
} from 'in-forge/constants';
import { containsMetricInList, createMetricListItem, getPlainMetricList, isBuiltInMetric } from 'in-sdk/metrics';
import {
  formatterTypeToLabel,
  mapConditionValue
} from 'in-views/configurationView/subview/Rules/components/RuleDetails';
import MetricSelector from 'in-views/configurationView/subview/Rule/MetricSelector';
import { numberFormatterToFormatterType } from 'in-services/formatters/number';
import Section from 'in-views/configurationView/components/Section';
import { getCategories, isMetricPercentile } from 'in-sdk/metrics';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import { compareIgnoreCase } from 'in-services/util/string';
import FormGroup from 'in-components/form/FormGroup';
import { getCustom } from 'in-api/metricsCatalog';
import Helpify from 'in-components/form/Helpify';
import { getSingular } from 'in-sdk/pluginName';
import { find } from 'in-services/arrayUtils';
import ComboBox from 'in-components/ComboBox';
import { Row, Col } from 'in-components/Grid';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { createRule } from 'in-api/rules';
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

function isPercentile(form) {
  if (!form || !form.get('entityType') || !form.get('metricName')) {
    return false;
  }

  const metricName = form.get('metricName').value;
  const entityType = form.get('entityType').value;
  return isMetricPercentile(entityType, metricName);
}

function getPluginsWithMetricDefinitions() {
  const plugins = twoZeroModeEnabled ? plugins20 : plugins10;
  return Object.keys(plugins)
    .map(k => plugins[k])
    .filter(plugin => getCategories(plugin).length > 0)
    .filter(plugin => customIssuesDisabledForPlugins.indexOf(plugin) < 0)
    .sort((a, b) => compareIgnoreCase(getSingular(a), getSingular(b)))
    .map(plugin => {
      return {
        value: plugin,
        label: getSingular(plugin)
      };
    });
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
  let { name, entityType, metricName, conditionOperator, conditionValue, formatter } = rule
    ? rule.toJS()
    : createRule();

  // FIXME fallback is only needed as long as not all plugins define a built-in metrics-catalog
  if (rule && formatter === 'UNDEFINED') {
    const metricList = getPlainMetricList(entityType);
    const metricItem = find(metricList, _metric => _metric.value === metricName);

    if (metricItem) {
      formatter = numberFormatterToFormatterType(metricItem.formatter);
    }
  }

  //let conditionValue = rule ? rule.get('conditionValue') : 0;
  conditionValue = mapConditionValue(conditionValue, formatter);

  let origin = '';
  if (entityType && metricName) {
    origin = isBuiltInMetric(entityType, metricName) ? 'built-in' : 'custom';
  }

  let form = createMapForm()
    .put(
      'name',
      createField({
        value: name,
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
        value: conditionOperator,
        validator: notBlankValidator
      })
    )
    .put(
      'conditionValue',
      createField({
        value: String(conditionValue),
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
    )
    .put(
      'formatter',
      createField({
        value: formatter,
        validator: notBlankValidator
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

function updateEntityTypesWithDeprecation(pluginsWithMetricDefinitions, form) {
  const entityType = form.get('entityType').value;

  if (twoZeroModeEnabled && isDeprecatedEntityType(entityType)) {
    pluginsWithMetricDefinitions.push({
      value: entityType,
      label: getSingular(entityType) + ' (deprecated)'
    });
  }
  if ((twoZeroModeEnabled && is10ServiceType(entityType)) || (!twoZeroModeEnabled && is20EntityType(entityType))) {
    pluginsWithMetricDefinitions.push({
      value: entityType,
      label: getSingular(entityType)
    });
  }

  // re-ensure correct order of the list
  pluginsWithMetricDefinitions.sort((a, b) => compareIgnoreCase(a.label, b.label));
}

function addCurrentCustomMetricToListIfMissing(customMetricsList, form, entity) {
  if (!form || !customMetricsList) {
    return;
  }

  if (form.get('origin') && form.get('origin').value === 'custom' && form.get('entityType') && form.get('metricName')) {
    const entityType = form.get('entityType').value;
    const metricName = form.get('metricName').value;

    if (entityType && metricName) {
      if (!containsMetricInList(customMetricsList, metricName)) {
        customMetricsList.push(
          createMetricListItem(metricName, entity.get('formatter'), entity.get('label'), entityType)
        );
      }
    }
  }
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
  class RuleForm extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      const { form, entity, setForm, onChange, customMetrics } = this.props;

      // extend custom-metrics list with current selected custom-metric,
      // in case it is not contained in the list. This might happen due to
      // deprecation or there is no such metric anymore
      addCurrentCustomMetricToListIfMissing(customMetrics, form, entity);

      const pluginsWithMetricDefinitions = getPluginsWithMetricDefinitions();
      updateEntityTypesWithDeprecation(pluginsWithMetricDefinitions, form);

      const isPercentileMetric = isPercentile(form);

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
                      let newForm = ruleFormDefinition(fromJS(createRule(null, form.get('name').value, '')));
                      newForm = newForm.updateIn(['origin'], f => f.setValue(e.value || '').setTouched(false));
                      setForm(newForm);
                    }
                  }}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}

            {form.get('origin').value === 'built-in'
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
                          let newForm = ruleFormDefinition(fromJS(createRule(null, form.get('name').value, e.value)));
                          newForm = newForm.updateIn(['origin'], f =>
                            f.setValue(form.get('origin').value || '').setTouched(false)
                          );
                          setForm(newForm);
                        }
                      }}
                    />
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))
              : null}

            {form.get('origin').value === 'custom' || form.get('entityType').value
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
                                const metricItem = find(customMetrics, _metric => _metric.value === e.value);
                                if (metricItem == null) {
                                  return f.setValue('');
                                }
                                return f.setValue(metricItem.entityType);
                              });
                            }

                            let metricFormatter = 'UNDEFINED';
                            if (form.get('origin').value === 'custom') {
                              const metricItem = find(customMetrics, _metric => _metric.value === e.value);
                              if (metricItem != null) {
                                metricFormatter = metricItem.formatter;
                              }
                            } else if (form.get('origin').value === 'built-in') {
                              const entityType = form.get('entityType').value;
                              const buildInMetricsList = getPlainMetricList(entityType);
                              const metricItem = find(buildInMetricsList, _metric => _metric.value === e.value);
                              if (metricItem != null) {
                                metricFormatter = numberFormatterToFormatterType(metricItem.formatter);
                              }
                            }

                            updatedForm = updatedForm.updateIn(['formatter'], f => {
                              return f.setValue(metricFormatter);
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

            {form.get('origin').value === 'custom' || form.get('entityType').value ? (
              <Row>
                {!isPercentileMetric && (
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
                {isPercentileMetric && (
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
                {!isPercentileMetric && (
                  <Col cols={3}>
                    {form.get('aggregation').map(field => (
                      <FormGroup>
                        <Label htmlFor="rule-aggregation" hasError={!field.valid && field.touched}>
                          Aggregation
                        </Label>
                        <ComboBox
                          name="rule-aggregation"
                          value={field.value}
                          options={[
                            { value: 'avg', label: 'avg' },
                            { value: 'sum', label: 'sum' },
                            { value: 'min', label: 'min' },
                            { value: 'max', label: 'max' }
                          ]}
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
                <Col cols={1}>
                  <span id="rule-conditionValue-formatter" className={`${block}__value_format_text`}>
                    {formatterTypeToLabel(form.get('formatter').value)}
                  </span>
                </Col>
              </Row>
            ) : null}
          </Section>
        </fieldset>
      );
    }
  }
);

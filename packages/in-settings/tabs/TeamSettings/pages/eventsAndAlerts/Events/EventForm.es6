import { createMapForm, createField, notBlankValidator } from 'formalistic';
import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import {
  plugins10,
  plugins20,
  pluginsDeprecatedIn20,
  oneZeroServicePlugins,
  customIssuesDisabledForPlugins
} from 'in-forge/constants';
import {
  formatterTypeToLabel,
  mapConditionValue
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/EventDetails';
import MetricSelector from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/MetricSelector';
import { containsMetricInList, createMetricListItem, getPlainMetricList, isBuiltInMetric } from 'in-sdk/metrics';
import BackendValidationMessages from 'in-components/form/BackendValidationMessages';
import { numberFormatterToFormatterType } from 'in-services/formatters/number';
import SectionHeading from 'in-settings/components/SectionHeading';
import { getCategories, isMetricPercentile } from 'in-sdk/metrics';
import TouchedMessages from 'in-components/form/TouchedMessages';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import EventDescription from 'in-components/EventDescription';
import { compareIgnoreCase } from 'in-services/util/string';
import { createRule, getSystemRules } from 'in-api/rules';
import FormGroup from 'in-settings/components/FormGroup';
import TextArea from 'in-components/form/TextArea';
import { getCustom } from 'in-api/metricsCatalog';
import Helpify from 'in-components/form/Helpify';
import { getSingular } from 'in-sdk/pluginName';
import Toggle from 'in-components/form/Toggle';
import { find } from 'in-services/arrayUtils';
import ComboBox from 'in-components/ComboBox';
import { Row, Col } from 'in-components/Grid';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './EventForm.mless';
import DescriptionText from '../../legacyKnowledgeManagement/CustomIssues/CustomIssueForm';

function putWindowField(form, event) {
  return form.put(
    'window',
    createField({
      value: String(event.get('window')),
      validator: notBlankValidator
    })
  );
}

function putRollupField(form, event) {
  return form.put(
    'rollup',
    createField({
      value: String(event.get('rollup')),
      validator: notBlankValidator
    })
  );
}

function putAggregationField(form, event) {
  return form.put(
    'aggregation',
    createField({
      value: event.get('aggregation'),
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

export function eventFormDefinition(event) {
  let { name, entityType, metricName, conditionOperator, conditionValue, formatter, applyOn } = event
    ? event.toJS()
    : createRule();

  // FIXME fallback is only needed as long as not all plugins define a built-in metrics-catalog
  if (event && formatter === 'UNDEFINED') {
    const metricList = getPlainMetricList(entityType);
    const metricItem = find(metricList, _metric => _metric.value === metricName);

    if (metricItem) {
      formatter = numberFormatterToFormatterType(metricItem.formatter);
    }
  }

  conditionValue = mapConditionValue(conditionValue, formatter);

  let dataSource = '';
  if (entityType && metricName) {
    dataSource = isBuiltInMetric(entityType, metricName) ? 'built-in' : 'custom';
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
      'description',
      createField({
        value: name,
        validator: notBlankValidator
      })
    )
    .put(
      'severity',
      createField({
        value: String(event.get('severity')),
        validator: severity => {
          if (Number(severity) === 0) {
            return [
              {
                severity: 'error',
                message: `Please select a severity`
              }
            ];
          }
          return null;
        }
      })
    )
    .put(
      'triggering',
      createField({
        value: event.get('triggering')
      })
    )
    .put(
      'expirationTime',
      createField({
        value: String(event.get('expirationTime')),
        validator: notBlankValidator
      })
    )
    .put(
      'dataSource',
      createField({
        value: dataSource,
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
    )
    .put(
      'applyOn',
      createField({
        value: applyOn,
        validator: notBlankValidator
      })
    );

  if (isMetricPercentile(entityType, metricName)) {
    form = putRollupField(form, event);
  } else {
    form = putWindowField(form, event);
    form = putAggregationField(form, event);
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

  if (
    form.get('dataSource') &&
    form.get('dataSource').value === 'custom' &&
    form.get('entityType') &&
    form.get('metricName')
  ) {
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
    }),
    systemRules: getSystemRules()
  },
  class EventForm extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      const { form, entity, setForm, onChange, onChangeApplyOn, customMetrics, queryValidationInProgress } = this.props;

      // extend custom-metrics list with current selected custom-metric,
      // in case it is not contained in the list. This might happen due to
      // deprecation or there is no such metric anymore
      addCurrentCustomMetricToListIfMissing(customMetrics, form, entity);

      const pluginsWithMetricDefinitions = getPluginsWithMetricDefinitions();
      updateEntityTypesWithDeprecation(pluginsWithMetricDefinitions, form);

      const isPercentileMetric = isPercentile(form);

      return (
        <fieldset>
          <SectionHeading>1. Event Details</SectionHeading>

          <Row>
            <Col cols={8}>
              <Fragment>
                {form.get('name').map(field => (
                  <FormGroup>
                    <Label htmlFor="event-name" hasError={!field.valid && field.touched}>
                      Name
                    </Label>
                    <Input
                      id="event-name"
                      type="text"
                      value={field.value}
                      onChange={e => onChange('name', e.target.value)}
                      hasError={!field.valid && field.touched}
                      autoFocus
                    />
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))}
                {form.get('description').map(field => (
                  <FormGroup>
                    <Label htmlFor="event-description" hasError={!field.valid && field.touched}>
                      Description
                    </Label>
                    <TextArea
                      id="event-description"
                      rows="3"
                      value={field.value}
                      onChange={e => onChange('description', e.target.value)}
                      hasError={!field.valid && field.touched}
                    />
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))}
                <FormGroup noFlex>
                  <Row>
                    <Col cols={4}>
                      {form.get('severity').map(field => (
                        <FormGroup>
                          <Label htmlFor="event-severity" hasError={!field.valid && field.touched}>
                            Issue Severity
                          </Label>
                          <ComboBox
                            name="event-severity"
                            value={field.value}
                            options={[
                              { value: '', label: 'Please select' },
                              { value: '5', label: 'warning' },
                              { value: '10', label: 'critical' }
                            ]}
                            onChange={e => onChange('severity', e ? e.value : '')}
                          />
                          <TouchedMessages field={field} />
                        </FormGroup>
                      ))}
                    </Col>
                    <Col cols={4}>
                      {form.get('triggering').map(field => (
                        <FormGroup>
                          <Label htmlFor="event-triggering">Incident</Label>
                          <Toggle
                            id="event-triggering"
                            className={locals.toggle}
                            checked={field.value}
                            onChange={e => onChange('triggering', e.target.checked)}
                          />
                        </FormGroup>
                      ))}
                    </Col>
                    <Col cols={4}>
                      {form.get('expirationTime').map(field => (
                        <FormGroup>
                          <Label htmlFor="event-expirationTime" hasError={!field.valid && field.touched}>
                            Grace period
                          </Label>
                          <Helpify helpText="Period to wait before closing the issue once conditions are no longer met.">
                            <ComboBox
                              name="event-expirationTime"
                              value={field.value}
                              className={locals.helpified}
                              options={[
                                { value: '', label: 'Please select' },
                                { value: '5000', label: '5s' },
                                { value: '10000', label: '10s' },
                                { value: '60000', label: '1min' },
                                { value: '300000', label: '5min' },
                                { value: '3600000', label: '60min' }
                              ]}
                              onChange={e => onChange('expirationTime', (e = e ? e.value : ''))}
                            />
                            <TouchedMessages field={field} />
                          </Helpify>
                        </FormGroup>
                      ))}
                    </Col>
                  </Row>
                </FormGroup>
              </Fragment>
            </Col>
            <Col cols={4}>
              <FormGroup>
                <Label>Issue Preview</Label>
                <EventDescription
                  className={locals.issuePreview}
                  event={createIssueForPreview(form)}
                  snapshotId="snapshotId"
                  isNotClickable
                />
              </FormGroup>
            </Col>
          </Row>

          <SectionHeading>2. Condition</SectionHeading>

          {form.get('dataSource').map(field => (
            <FormGroup>
              <Label htmlFor="event-data-source" hasError={!field.valid && field.touched}>
                Data source
              </Label>
              <ComboBox
                name="event-data-source"
                value={field.value}
                options={[
                  { value: 'built-in', label: 'Built-in metrics' },
                  { value: 'custom', label: 'Custom metrics' }
                ]}
                onChange={e => {
                  if (e && e.value != field.value) {
                    let newForm = eventFormDefinition(fromJS(createRule(null, form.get('name').value, '')));
                    newForm = newForm.updateIn(['dataSource'], f => f.setValue(e.value || '').setTouched(false));
                    setForm(newForm);
                  }
                }}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
          <Row>
            <Col cols={6}>
              {form.get('dataSource').value === 'custom' || form.get('entityType').value
                ? form.get('metricName').map(field => (
                    <FormGroup>
                      <Label htmlFor="event-metricName" hasError={!field.valid && field.touched}>
                        Metric
                      </Label>
                      <MetricSelector
                        id="event-metricName"
                        plugin={form.get('entityType').value}
                        value={form.get('metricName').value}
                        metrics={form.get('dataSource').value === 'custom' ? customMetrics : null}
                        useComboBox
                        onChange={e => {
                          if (e && e.value != field.value) {
                            onChange('metricName', e ? e.value : '', (updatedForm, event) => {
                              if (isPercentile(updatedForm)) {
                                updatedForm = updatedForm.remove('window').remove('aggregation');
                                updatedForm = putRollupField(updatedForm, event);
                              } else {
                                updatedForm = updatedForm.remove('rollup');
                                updatedForm = putWindowField(updatedForm, event);
                                updatedForm = putAggregationField(updatedForm, event);
                              }

                              if (form.get('dataSource').value === 'custom') {
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
                              if (form.get('dataSource').value === 'custom') {
                                const metricItem = find(customMetrics, _metric => _metric.value === e.value);
                                if (metricItem != null) {
                                  metricFormatter = metricItem.formatter;
                                }
                              } else if (form.get('dataSource').value === 'built-in') {
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
            </Col>
            <Col cols={6}>
              {form.get('dataSource').value === 'built-in'
                ? form.get('entityType').map(field => (
                    <FormGroup>
                      <Label htmlFor="event-entityType" hasError={!field.valid && field.touched}>
                        Entity type
                      </Label>
                      <ComboBox
                        name="event-entityType"
                        value={field.value}
                        options={pluginsWithMetricDefinitions}
                        onChange={e => {
                          if (e && e.value != field.value) {
                            let newForm = eventFormDefinition(
                              fromJS(createRule(null, form.get('name').value, e.value))
                            );
                            newForm = newForm.updateIn(['dataSource'], f =>
                              f.setValue(form.get('dataSource').value || '').setTouched(false)
                            );
                            setForm(newForm);
                          }
                        }}
                      />
                      <TouchedMessages field={field} />
                    </FormGroup>
                  ))
                : null}
            </Col>
          </Row>
          {form.get('dataSource').value === 'custom' || form.get('entityType').value ? (
            <FormGroup noFlex>
              <Row>
                {!isPercentileMetric && (
                  <Col cols={3}>
                    {form.get('window').map(field => (
                      <FormGroup>
                        <Label htmlFor="event-window" hasError={!field.valid && field.touched}>
                          Time window
                        </Label>
                        <ComboBox
                          name="event-window"
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
                        <Label htmlFor="event-rollup" hasError={!field.valid && field.touched}>
                          Window Size
                        </Label>
                        <ComboBox
                          name="event-rollup"
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
                        <Label htmlFor="event-aggregation" hasError={!field.valid && field.touched}>
                          Aggregation
                        </Label>
                        <ComboBox
                          name="event-aggregation"
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
                      <Label htmlFor="event-conditionOperator" hasError={!field.valid && field.touched}>
                        Operator
                      </Label>
                      <ComboBox
                        name="event-conditionOperator"
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
                      <Label htmlFor="event-conditionValue" hasError={!field.valid && field.touched}>
                        Value
                      </Label>
                      <Input
                        id="event-conditionValue"
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
                  <span id="event-conditionValue-formatter" className={locals.valueFormatText}>
                    {formatterTypeToLabel(form.get('formatter').value)}
                  </span>
                </Col>
              </Row>
            </FormGroup>
          ) : null}

          <SectionHeading>3. Scope</SectionHeading>
          <Row>
            <Col cols={6}>
              {form.get('applyOn').map(field => (
                <FormGroup>
                  <Label htmlFor="event-apply-on" hasError={!field.valid && field.touched}>
                    Apply on (required)
                  </Label>
                  <ComboBox
                    name="event-apply-on"
                    value={field.value}
                    options={[
                      { value: 'application', label: 'Application' },
                      { value: 'dfq', label: 'Selected entities (Dynamic Focus query)' },
                      { value: 'all', label: 'All available entities' }
                    ]}
                    clearable={false}
                    onChange={e => onChangeApplyOn(e ? e.value : null)}
                  />
                  <TouchedMessages field={field} />
                  {form.get('applyOn').value === 'all' && (
                    <DescriptionText>
                      <strong>Caution!</strong> This will match and create issues on all available entities for the
                      conditions specified. <strong>This might affect other users in your organization as well.</strong>
                    </DescriptionText>
                  )}
                </FormGroup>
              ))}
            </Col>
            <Col cols={6}>
              {form.get('applyOn').value === 'dfq' &&
                form.get('query').map(field => (
                  <FormGroup>
                    <Label htmlFor="event-query" hasError={!field.valid && field.touched}>
                      Dynamic Focus Query
                    </Label>
                    <Input
                      id="event-query"
                      type="text"
                      placeholder={'e.g. entity.zone:"prod" AND entity.service.name:"Shop"'}
                      className={locals.helpified}
                      value={field.value}
                      onChange={e => onChange('query', e.target.value)}
                      hasError={form.get('validationResult') && !form.get('validationResult').value.valid}
                    />
                    {queryValidationInProgress && (
                      <LoadingIndicator type="dark" className={locals.queryLoading} inline />
                    )}
                    <BackendValidationMessages validationResult={form.get('validationResult').value} />
                    <TouchedMessages field={field} />
                    <DescriptionText>
                      A <strong>non-empty</strong> filter query which defines for which entities the rule will be
                      applied. Select <i>&quot;Apply on: All available entities&quot;</i> if you want this rule to be
                      applied on all entities. For more information on syntax, please see our&nbsp;
                      <Link href="https://docs.instana.io/core_concepts/dynamic_focus/#usage" external>
                        documentation
                      </Link>
                      .
                    </DescriptionText>
                  </FormGroup>
                ))}
            </Col>
          </Row>
        </fieldset>
      );
    }
  }
);

function createIssueForPreview(form) {
  return fromJS({
    id: 'uuid',
    start: Date.now(),
    end: null,
    problem: {
      fixSuggestion: form.get('description').value,
      id: 'uuid',
      problemText: form.get('name').value,
      snapshotId: 'snapshotId',
      severity: form.get('severity').value
    },
    state: 'open',
    type: 'issue'
  });
}

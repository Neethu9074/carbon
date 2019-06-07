import { compose, lifecycle, withState } from 'recompose';
import { create, just } from 'reactive-observables';
import React, { Fragment } from 'react';
import { fromJS } from 'immutable';
import { isEqual } from 'lodash';

import {
  dataSourceCustom,
  dataSourceBuiltIn,
  dataSourceSystem,
  isDeprecatedEntityType,
  putWindowField,
  putRollupField,
  putAggregationField,
  putQueryFields,
  putApplicationField,
  removeQueryFields,
  updateFormDefinitionForDataSource
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import {
  applyOnOptions,
  scopeApplication,
  scopeEverything,
  scopeDfq
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import {
  getEntityTypeOptions,
  formatterTypeToDefinition
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';
import MetricSelector from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/MetricSelector';
import { containsMetricInList, createMetricListItem, getPlainMetricList } from 'in-sdk/metrics';
import ApplicationSelect from 'in-settings/tabs/TeamSettings/components/ApplicationSelect';
import BackendValidationMessages from 'in-components/form/BackendValidationMessages';
import { numberFormatterToFormatterType } from 'in-services/formatters/number';
import { combinedValidationResults, valid } from 'in-settings/validation';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import LoadingIndicator from 'in-components/LoadingIndicator';
import EventDescription from 'in-components/EventDescription';
import { isBlank, isNotBlank } from 'in-services/util/string';
import { compareIgnoreCase } from 'in-services/util/string';
import { getSystemRules } from 'in-api/eventSpecifications';
import FormGroup from 'in-settings/components/FormGroup';
import { isMetricPercentile } from 'in-sdk/metrics';
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
import { validate } from 'in-api/search';
import Link from 'in-components/Link';

import locals from './CustomEventForm.mless';

const previewStartDate = Date.now();

const queryIsValid = just([true, true]);

// We use two observables to manage the various query validation aspects:
// 1. queryInput emits when the query is changed (the user is editing the query input field). When this happens we also
// start showing the progress indicator for the query validation and prohibit saving the form as long as the query
// validation is in progress.
const queryInput = create();
// 2. queryValidationFinished emits when the subscription doing the validation has produced a new result, thus we now
// can stop the progress indicator for the query validation and enable saving the form again.
const queryValidationFinished = create();

export default compose(
  connectTo({
    systemRules: getSystemRules(),
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
  }),
  connectTo({
    // Maintenance notice: Do no use a function to create the connectTo-observable here, only use an object literal.
    // Otherwise the observable will be recreated all the time leading to continuuos validation requests.
    queryValidationResult: queryInput
      .distinct()
      .debounce(1000)
      .flatMap(query => {
        if (isNotBlank(query)) {
          return validate(query);
        } else {
          return queryIsValid;
        }
      })
      .tap(() => queryValidationFinished.emit(true))
  }),
  withState('queryValidationInProgress', 'setQueryValidationInProgress', false),
  connectTo(({ setQueryValidationInProgress, setSaveEnabled }) => ({
    queryValidationFinished: queryValidationFinished.distinct().tap(finished => {
      if (finished) {
        setQueryValidationProgressState(false, setQueryValidationInProgress, setSaveEnabled);
      }
      queryValidationFinished.emit(false);
    })
  })),
  lifecycle({
    componentDidMount() {
      const { entity } = this.props;
      // Validate the query once initially after loading an event specification.
      if (isNotBlank(entity.get('query'))) {
        queryInput.emit(entity.get('query'));
      }
    }
  })
)(EventForm);

function EventForm({
  form,
  entity,
  onChange,
  customMetrics,
  systemRules,
  queryValidationResult,
  queryValidationInProgress,
  setQueryValidationInProgress,
  setSaveEnabled
}) {
  applyQueryValidationResult(queryValidationResult, form, onChange);

  // extend custom-metrics list with current selected custom-metric,
  // in case it is not contained in the list. This might happen due to
  // deprecation or there is no such metric anymore
  addCurrentCustomMetricToListIfMissing(customMetrics, form, entity);

  let pluginsWithMetricDefinitions;
  if (form.get('dataSource') && form.get('dataSource').value !== dataSourceSystem) {
    pluginsWithMetricDefinitions = getEntityTypeOptions();
    updateEntityTypesWithDeprecation(pluginsWithMetricDefinitions, form);
  }

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
                  maxLength={256}
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
                  maxLength={65536}
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
                        options={severityOptions}
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
                  {form.get('gracePeriod').map(field => (
                    <FormGroup>
                      <Label htmlFor="event-grace-period" hasError={!field.valid && field.touched}>
                        Grace period
                      </Label>
                      <Helpify helpText="Period to wait before closing the issue once conditions are no longer met.">
                        <ComboBox
                          name="event-grace-period"
                          value={field.value}
                          className={locals.helpified}
                          options={gracePeriodOptions}
                          onChange={e => onChange('gracePeriod', (e = e ? e.value : ''))}
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
              isPreview
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
            options={dataSourceOptions}
            onChange={e => {
              onChange('dataSource', e ? e.value : null, (updatedForm, eventSpec) => {
                return updateFormDefinitionForDataSource(updatedForm, field.value, eventSpec, systemRules);
              });
            }}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('dataSource').value === dataSourceSystem && ConditionsForSystemRuleSource(form, systemRules, onChange)}
      {(form.get('dataSource').value === dataSourceBuiltIn || form.get('dataSource').value === dataSourceCustom) &&
        ConditionsForNonSystemSource(form, pluginsWithMetricDefinitions, onChange, customMetrics, isPercentileMetric)}

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
                options={applyOnOptions}
                clearable={false}
                onChange={e => onChangeApplyOn(e ? e.value : null, onChange)}
              />
              <TouchedMessages field={field} />
              {form.get('applyOn').value === scopeEverything && (
                <DescriptionText>
                  <strong>Caution!</strong> This will match and create issues on all available entities for the
                  conditions specified. <strong>This might affect other users in your organization as well.</strong>
                </DescriptionText>
              )}
            </FormGroup>
          ))}
        </Col>
        <Col cols={6}>
          {form.get('applyOn').value === scopeDfq &&
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
                  value={field.value || ''}
                  maxLength={2048}
                  onChange={e => {
                    onChange('query', e.target.value, updatedForm => {
                      return startQueryValidation(
                        e.target.value,
                        updatedForm,
                        onChange,
                        setQueryValidationInProgress,
                        setSaveEnabled
                      );
                    });
                  }}
                  hasError={form.get('validationResult') && !form.get('validationResult').value.valid}
                />
                {queryValidationInProgress && <LoadingIndicator type="dark" className={locals.queryLoading} inline />}
                <BackendValidationMessages validationResult={form.get('validationResult').value} />
                <TouchedMessages field={field} />
                <DescriptionText>
                  A <strong>non-empty</strong> filter query which defines for which entities the rule will be applied.
                  Select <i>&quot;Apply on: All available entities&quot;</i> if you want this rule to be applied on all
                  entities. For more information on syntax, please see our&nbsp;
                  <Link href="https://docs.instana.io/core_concepts/dynamic_focus/#usage" external>
                    documentation
                  </Link>
                  .
                </DescriptionText>
              </FormGroup>
            ))}
          {form.get('applyOn').value === scopeApplication &&
            form.get('application').map(field => (
              <FormGroup>
                <Label hasError={!field.valid && field.touched}>Application</Label>
                <ApplicationSelect
                  applicationName={field.value}
                  onSelectApplicationName={applicationName => onChange('application', applicationName)}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
        </Col>
      </Row>
    </fieldset>
  );
}

function createIssueForPreview(form) {
  return fromJS({
    id: 'uuid',
    start: previewStartDate,
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

function ConditionsForSystemRuleSource(form, systemRules, onChange) {
  return form.get('systemRule').map(field => (
    <FormGroup>
      <Label htmlFor="event-system-rule" hasError={!field.valid && field.touched}>
        System Rule
      </Label>
      <ComboBox
        name="event-system-rule"
        value={field.value}
        options={systemRuleOptions(systemRules)}
        onChange={e => {
          if (e && e.value != field.value) {
            onChange('systemRule', e.value);
          }
        }}
        clearable={false}
      />
      <TouchedMessages field={field} />
    </FormGroup>
  ));
}

function ConditionsForNonSystemSource(form, pluginsWithMetricDefinitions, onChange, customMetrics, isPercentileMetric) {
  return (
    <Fragment>
      <Row>
        <Col cols={!isBuiltInMetric(form) ? 12 : 6}>
          {isBuiltInMetric(form)
            ? EntityTypeFormGroup(form, pluginsWithMetricDefinitions, onChange)
            : MetricSelectionFormGroup(form, customMetrics, onChange)}
        </Col>

        <Col cols={6}>
          {isBuiltInMetric(form) &&
            form.get('entityType').value &&
            MetricSelectionFormGroup(form, customMetrics, onChange)}
        </Col>
      </Row>

      {shouldRenderThresholds(form) && ThresholdsFormGroup(isPercentileMetric, form, onChange)}
    </Fragment>
  );
}
function isBuiltInMetric(form) {
  return form.get('dataSource').value === dataSourceBuiltIn;
}

function EntityTypeFormGroup(form, pluginsWithMetricDefinitions, onChange) {
  return form.get('entityType').map(field => (
    <FormGroup>
      <Label htmlFor="event-entity-type" hasError={!field.valid && field.touched}>
        Entity type
      </Label>
      <ComboBox
        name="event-entity-type"
        value={field.value}
        options={pluginsWithMetricDefinitions}
        onChange={e => {
          if ((field.value && !e) || (e && e.value != field.value)) {
            onChange('metricName', '');
            onChange('entityType', e ? e.value : '');
          }
        }}
      />
      <TouchedMessages field={field} />
    </FormGroup>
  ));
}

function MetricSelectionFormGroup(form, customMetrics, onChange) {
  return form.get('metricName').map(field => (
    <FormGroup>
      <Label htmlFor="event-metricName" hasError={!field.valid && field.touched}>
        Metric
      </Label>
      <MetricSelector
        id="event-metricName"
        plugin={form.get('entityType').value}
        value={form.get('metricName').value}
        metrics={form.get('dataSource').value === dataSourceCustom ? customMetrics : null}
        useComboBox
        onChange={e => {
          if ((field.value && !e) || (e && e.value != field.value)) {
            let selectedMetric = e ? e.value : '';
            onChange('metricName', selectedMetric, (updatedForm, eventSpec) => {
              if (isPercentile(updatedForm)) {
                updatedForm = updatedForm.remove('window').remove('aggregation');
                updatedForm = putRollupField(updatedForm, eventSpec);
              } else {
                updatedForm = updatedForm.remove('rollup');
                updatedForm = putWindowField(updatedForm, eventSpec);
                updatedForm = putAggregationField(updatedForm, eventSpec);
              }

              if (form.get('dataSource').value === dataSourceCustom) {
                // manually update the hidden hidden entityType field in case of custom metrics
                updatedForm = updatedForm.updateIn(['entityType'], f => {
                  const metricItem = find(customMetrics, _metric => _metric.value === selectedMetric);
                  if (metricItem == null) {
                    return f.setValue('');
                  }
                  return f.setValue(metricItem.entityType);
                });
              }

              let metricFormatter = 'UNDEFINED';
              let metricLabel = 'UNKNOWN';
              if (form.get('dataSource').value === dataSourceCustom) {
                const metricItem = find(customMetrics, _metric => _metric.value === selectedMetric);
                if (metricItem != null) {
                  metricFormatter = metricItem.formatter;
                  metricLabel = metricItem.origLabel || metricItem.label;
                }
              } else if (form.get('dataSource').value === dataSourceBuiltIn) {
                const entityType = form.get('entityType').value;
                const buildInMetricsList = getPlainMetricList(entityType);
                const metricItem = find(buildInMetricsList, _metric => _metric.value === selectedMetric);
                if (metricItem != null) {
                  metricFormatter = numberFormatterToFormatterType(metricItem.formatter);
                  metricLabel = metricItem.origLabel || metricItem.label;
                }
              }

              updatedForm = updatedForm.updateIn(['formatter'], f => {
                return f.setValue(metricFormatter);
              });
              updatedForm = updatedForm.updateIn(['label'], f => {
                return f.setValue(metricLabel);
              });

              return updatedForm;
            });
          }
        }}
      />
      <TouchedMessages field={field} />
    </FormGroup>
  ));
}

function shouldRenderThresholds(form) {
  return (
    form.get('dataSource').value === dataSourceCustom ||
    (form.get('dataSource').value === dataSourceBuiltIn && form.get('entityType').value)
  );
}

function ThresholdsFormGroup(isPercentileMetric, form, onChange) {
  return (
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
                  options={windowOptions}
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
                  options={rollupOptions}
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
                  options={aggregationOptions}
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
                options={conditionOperatorOptions}
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
                {formatterTypeToDefinition(form.get('formatter').value)}
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
      </Row>
    </FormGroup>
  );
}

function updateEntityTypesWithDeprecation(pluginsWithMetricDefinitions, form) {
  const entityType = form.get('entityType').value;

  if (isDeprecatedEntityType(entityType)) {
    pluginsWithMetricDefinitions.push({
      value: entityType,
      label: getSingular(entityType) + ' (deprecated)'
    });
  }

  // re-ensure correct order of the list
  pluginsWithMetricDefinitions.sort((a, b) => compareIgnoreCase(a.label, b.label));
}

function addCurrentCustomMetricToListIfMissing(customMetricsList, form) {
  if (!form || !customMetricsList) {
    return;
  }

  if (
    form.get('dataSource') &&
    form.get('dataSource').value === dataSourceCustom &&
    form.get('entityType') &&
    form.get('metricName')
  ) {
    const entityType = form.get('entityType').value;
    const metricName = form.get('metricName').value;

    if (entityType && metricName) {
      if (!containsMetricInList(customMetricsList, metricName)) {
        customMetricsList.push(
          createMetricListItem(metricName, form.get('formatter').value, form.get('label').value, entityType)
        );
      }
    }
  }
}

function startQueryValidation(query, form, onChange, setQueryValidationInProgress, setSaveEnabled) {
  if (isBlank(query)) {
    onChange('validationResult', valid());
    setQueryValidationProgressState(false, setQueryValidationInProgress, setSaveEnabled);
    return form;
  }

  // The query has changed and it is not an empty string.

  // 1. First we hide any previous error message that might still be shown.
  let updatedForm = form.updateIn(['validationResult'], field =>
    field.setValue({ valid: true, error: null }).setTouched(false)
  );

  // 2. Next we show progress indicator and disable saving the form.
  setQueryValidationProgressState(true, setQueryValidationInProgress, setSaveEnabled);

  // 3. Finally we start the actual query validation.
  queryInput.emit(query);

  return updatedForm;
}

function setQueryValidationProgressState(queryValidationInProgress, setQueryValidationInProgress, setSaveEnabled) {
  setQueryValidationInProgress(queryValidationInProgress);
  setSaveEnabled(!queryValidationInProgress);
}

function applyQueryValidationResult(queryValidationResult, form, onChange) {
  if (queryValidationResult && form.containsKey('validationResult')) {
    const combined = combinedValidationResults(queryValidationResult.body);
    if (!isEqual(combined, form.get('validationResult').value)) {
      // A little dirty trick to circumvents React's warning to not call setState during render. Sorry, not sorry.
      setTimeout(() => onChange('validationResult', combined), 0);
    }
  }
}

function onChangeApplyOn(applyOn, onChange) {
  let updateFormDefinition;

  if (applyOn === scopeDfq) {
    updateFormDefinition = (form, event) => {
      form = form.remove('application');
      form = putQueryFields(form, event);
      return form.updateIn(['query'], f => {
        return f.setValue('');
      });
    };
  } else if (applyOn === scopeApplication) {
    updateFormDefinition = form => {
      form = removeQueryFields(form);
      return putApplicationField(form, null);
    };
  } else {
    // applyOn === scopeEverything or not selected
    updateFormDefinition = form => {
      form = removeQueryFields(form);
      return form.remove('application');
    };
  }
  onChange('applyOn', applyOn, updateFormDefinition);
}

function isPercentile(form) {
  if (!form || !form.get('entityType') || !form.get('metricName')) {
    return false;
  }

  const metricName = form.get('metricName').value;
  const entityType = form.get('entityType').value;
  return isMetricPercentile(entityType, metricName);
}

const severityWarning = '5';
const severityCritical = '10';
const severityOptions = [{ value: severityWarning, label: 'warning' }, { value: severityCritical, label: 'critical' }];

const dataSourceOptions = [
  { value: dataSourceBuiltIn, label: 'Built-in metrics' },
  { value: dataSourceCustom, label: 'Custom metrics' },
  { value: dataSourceSystem, label: 'System Rules' }
];

function systemRuleOptions(systemRules) {
  if (!systemRules) {
    return [];
  }
  return systemRules.map(({ id, name }) => ({ value: id, label: name }));
}

const gracePeriodOptions = [
  { value: '5000', label: '5 s' },
  { value: '10000', label: '10s' },
  { value: '60000', label: '1 min' },
  { value: '300000', label: '5 min' },
  { value: '3600000', label: '60 min' }
];

const windowOptions = [
  { value: '1000', label: '1 s' },
  { value: '5000', label: '5 s' },
  { value: '10000', label: '10 s' },
  { value: '60000', label: '1 min' },
  { value: '300000', label: '5 min' },
  { value: '600000', label: '10 min' }
];

const rollupOptions = [
  { value: '5000', label: '5 s' },
  { value: '60000', label: '1 min' },
  { value: '300000', label: '5 min' },
  { value: '3600000', label: '1 hour' }
];

const aggregationOptions = [
  { value: 'avg', label: 'avg' },
  { value: 'sum', label: 'sum' },
  { value: 'min', label: 'min' },
  { value: 'max', label: 'max' }
];

const conditionOperatorOptions = [
  { value: '<', label: '<' },
  { value: '<=', label: '<=' },
  { value: '==', label: '==' },
  { value: '>=', label: '>=' },
  { value: '>', label: '>' },
  { value: '!=', label: '!=' }
];

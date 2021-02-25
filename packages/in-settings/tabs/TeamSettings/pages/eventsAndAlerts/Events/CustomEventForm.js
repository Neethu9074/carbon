/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { compose, lifecycle, withState } from 'recompose';
import { create, just } from '@instana/observables';
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
  putMetricPatternOperator,
  putMetricPatternPlaceholder,
  removeQueryFields,
  updateFormDefinitionForDataSource,
  updateFormDefinitionForSystemRule,
  entityVerification,
  systemRules
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import Applications, {
  getSelectedApplicationConfigsByName,
  applicationSelectionTableActions,
  getSelectedApplicationsForAlert,
  submitApplicationSelection,
  noRightHeader
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/components/Applications';
import {
  containsMetricInList,
  createMetricListItem,
  getAllBuiltInMetrics,
  isBuiltInPlainMetric,
  getMetricDefinition,
  isBuiltInDynamicMetric
} from 'in-sdk/metrics';
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
import InputWithDFQSelectionList from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/components/InputWithDFQSelectionList';
import BuiltInMetricSelector from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/BuiltInMetricSelector';
import CustomMetricSelector from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/CustomMetricSelector';
import { putApplicationIdField } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import { getPluginsWithCustomMetrics, getCustomMetricsForPlugin } from 'in-api/infraCatalog';
import BackendValidationMessages from 'in-components/form/BackendValidationMessages';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { numberFormatterToFormatterType } from 'in-services/formatters/number';
import { combinedValidationResults, valid } from 'in-settings/validation';
import EventDescription from 'in-events/components/EventDescription';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import { Row, Col } from 'in-new-components/layout/Grid/Grid';
import { isBlank, isNotBlank } from 'in-services/util/string';
import { compareIgnoreCase } from 'in-services/util/string';
import HelpText from 'in-components/form/HelpText/HelpText';
import FormGroup from 'in-settings/components/FormGroup';
import { millis } from 'in-services/formatters/number';
import { isMetricPercentile } from 'in-sdk/metrics';
import TextArea from 'in-components/form/TextArea';
import Helpify from 'in-components/form/Helpify';
import { getPluginName } from 'in-sdk/pluginName';
import Toggle from 'in-components/form/Toggle';
import { find } from 'in-services/arrayUtils';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import connectTo from 'in-hoc/connectTo';
import { validate } from 'in-api/search';
import Link from 'in-components/Link';

import locals from './CustomEventForm.mless';

const undefinedMetricFormatter = 'UNDEFINED';
const unknownMetricLabel = 'UNKNOWN';

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
  connectTo(({ form }) => {
    const observables = {};
    if (isCustomDataSourceSelected(form)) {
      observables.pluginsWithCustomMetrics = getPluginsWithCustomMetrics().map(plugins => {
        const result = [];
        if (plugins) {
          plugins.map(plugin => {
            result.push({
              value: plugin.get('plugin'),
              label: plugin.get('label')
            });
          });
        }
        return result;
      });
      if (form.get('entityType').value) {
        observables.customMetricsForPlugin = getCustomMetricsForPlugin(form.get('entityType').value).map(
          metricInstances => {
            const result = [];
            if (metricInstances) {
              metricInstances.map(metricInstance => {
                result.push(
                  createCustomMetricListItem(
                    metricInstance.get('metricId'),
                    metricInstance.get('formatter'),
                    metricInstance.get('label'),
                    metricInstance.get('pluginId')
                  )
                );
              });
            }
            return result;
          }
        );
      }
    }
    return observables;
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
  connectTo(props => {
    const selectedApplicationName = props.form.get('application') ? props.form.get('application').value : '';
    if (selectedApplicationName === null || isBlank(selectedApplicationName)) {
      return {
        existingApplication: null
      };
    }
    return {
      existingApplication: getSelectedApplicationConfigsByName(selectedApplicationName)
    };
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
  setForm,
  entity,
  onChange,
  pluginsWithCustomMetrics,
  customMetricsForPlugin,
  queryValidationResult,
  queryValidationInProgress,
  setQueryValidationInProgress,
  setSaveEnabled,
  existingApplication
}) {
  applyQueryValidationResult(queryValidationResult, form, onChange);

  // extend custom-metrics list with current selected custom-metric,
  // in case it is not contained in the list. This might happen due to
  // deprecation or there is no such metric anymore
  addCurrentCustomMetricToListIfMissing(customMetricsForPlugin, form, entity);

  let pluginsWithMetricDefinitions;
  if (form.get('dataSource') && form.get('dataSource').value !== dataSourceSystem) {
    pluginsWithMetricDefinitions = getEntityTypeOptions();
    updateEntityTypesWithDeprecation(pluginsWithMetricDefinitions, form);
  }

  let selectedApplicationIds = form.get('applicationIds') ? form.get('applicationIds').value : [];

  if (existingApplication) {
    existingApplication.forEach(app => {
      selectedApplicationIds.push(app.id);
    });
  }
  const isPercentileMetric = isPercentile(form);

  return (
    <fieldset>
      <SectionHeading>1. Event Details</SectionHeading>
      <Row>
        <Col lg={8}>
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
                <TouchedMessages field={field} className={locals.subErrorTextFormField} />
                <HelpText className={locals.subTextFormField}>
                  Shows up in the list of events. This is also the name of issues. Should be unique and meaningful.
                </HelpText>
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
                <TouchedMessages field={field} className={locals.subErrorTextFormField} />
                <HelpText className={locals.subTextFormField}>
                  Shows up in the issue description. Should be as descriptive as possible. Supports markdown.
                </HelpText>
              </FormGroup>
            ))}
            <FormGroup noFlex>
              <Row>
                <Col lg={4}>
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
                        clearable={false}
                      />
                      <TouchedMessages field={field} />
                    </FormGroup>
                  ))}
                </Col>
                <Col lg={4}>
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
                <Col lg={4}>
                  {form.get('gracePeriod').map(field => (
                    <FormGroup>
                      <Label htmlFor="event-grace-period" hasError={!field.valid && field.touched}>
                        Grace Period
                      </Label>
                      <Helpify helpText="Period to wait before closing the issue once conditions are no longer met.">
                        <ComboBox
                          name="event-grace-period"
                          value={field.value}
                          className={locals.helpified}
                          options={getOptionsWithAdditionalValueIfMissing(gracePeriodOptions, field.value)}
                          onChange={e => onChange('gracePeriod', (e = e ? e.value : ''))}
                          clearable={false}
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
        <Col lg={4}>
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
            Source
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
            clearable={false}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {isSystemRuleDataSourceSelected(form) && (
        <>
          {form.get('systemRule').map(field => (
            <FormGroup>
              <Label htmlFor="event-system-rule" hasError={!field.valid && field.touched}>
                System Rule
              </Label>
              <ComboBox
                name="event-system-rule"
                value={field.value}
                options={systemRuleOptions(systemRules)}
                onChange={e => {
                  onChange('systemRule', e ? e.value : null, (updatedForm, eventSpec) => {
                    return updateFormDefinitionForSystemRule(updatedForm, field.value, eventSpec, systemRules);
                  });
                }}
                clearable={false}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}

          {form.get('systemRule') && form.get('systemRule').value === entityVerification.id && (
            <ObserveHostHasMatchingEntitiesRunningFormGroup
              form={form}
              entityTypes={getEntityTypeOptions()}
              onChange={onChange}
            />
          )}
        </>
      )}

      {isBuiltInDataSourceSelected(form) && (
        <>
          <Row>
            <Col lg={3}>
              <EntityTypeFormGroup
                form={form}
                pluginsWithMetricDefinitions={pluginsWithMetricDefinitions}
                onChange={onChange}
              />
            </Col>
            <Col lg={9}>
              {form.get('entityType').value &&
                form.get('metricName').map(field => (
                  <FormGroup>
                    <Label htmlFor="event-metricName" hasError={!field.valid && field.touched}>
                      Metric
                    </Label>
                    <BuiltInMetricSelector
                      id="event-metricName"
                      plugin={form.get('entityType').value}
                      value={form.get('metricName').value}
                      clearable={false}
                      onChange={e => {
                        if ((field.value && !e) || (e && e.value !== field.value)) {
                          let selectedMetric = e ? e.value : '';
                          onChange('metricName', selectedMetric, updatedForm => {
                            if (isPercentile(updatedForm)) {
                              updatedForm = updatedForm.remove('window').remove('aggregation');
                              updatedForm = putRollupField(updatedForm);
                            } else {
                              updatedForm = updatedForm.remove('rollup');
                              updatedForm = putWindowField(updatedForm);
                              updatedForm = putAggregationField(updatedForm);
                            }

                            const entityType = form.get('entityType').value;
                            const buildInMetricsList = getAllBuiltInMetrics(entityType);
                            const metricItem = find(buildInMetricsList, _metric => _metric.value === selectedMetric);

                            if (metricItem) {
                              if (isBuiltInPlainMetric(entityType, metricItem.value)) {
                                updatedForm = updatedForm
                                  .remove('metricPatternOperator')
                                  .remove('metricPatternPlaceholder');
                              } else {
                                updatedForm = putMetricPatternOperator(updatedForm);
                                updatedForm = putMetricPatternPlaceholder(updatedForm);
                              }

                              const metricInfo = getBuiltInMetricInfo(metricItem);
                              updatedForm = updatedForm
                                .updateIn(['formatter'], f => f.setValue(metricInfo.formatter))
                                .updateIn(['conditionOperator'], f => f.setValue(null).setTouched(false))
                                .updateIn(['conditionValue'], f => f.setValue('').setTouched(false));
                            }

                            return updatedForm;
                          });
                        }
                      }}
                    />
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))}
            </Col>
          </Row>

          <DynamicBuiltInFormGroup form={form} onChange={onChange} />

          {form.get('entityType').value && form.get('metricName').value && (
            <ThresholdsFormGroup isPercentileMetric={isPercentileMetric} form={form} onChange={onChange} />
          )}
        </>
      )}

      {isCustomDataSourceSelected(form) && (
        <>
          <Row>
            <Col lg={3}>
              <EntityTypeFormGroup
                form={form}
                pluginsWithMetricDefinitions={pluginsWithCustomMetrics}
                onChange={onChange}
              />
            </Col>
            <Col lg={9}>
              {customMetricsForPlugin &&
                form.get('metricName').map(field => (
                  <FormGroup>
                    <Label htmlFor="event-metricName" hasError={!field.valid && field.touched}>
                      Metric
                    </Label>
                    <CustomMetricSelector
                      // Workaround to clear the selection when the entity-type change.
                      // It is not that expensive, because it is a small component.
                      key={Math.random()}
                      id="event-metricName"
                      value={form.get('metricName').value}
                      metrics={customMetricsForPlugin}
                      onChange={e => {
                        if ((field.value && !e) || (e && e.value !== field.value)) {
                          let selectedMetric = e ? e.value : '';
                          onChange('metricName', selectedMetric, (updatedForm, eventSpec) => {
                            updatedForm = updatedForm.remove('rollup');
                            updatedForm = putWindowField(updatedForm, eventSpec);
                            updatedForm = putAggregationField(updatedForm, eventSpec);

                            const metricInfo = getCustomMetricInfo(customMetricsForPlugin, selectedMetric);

                            updatedForm = updatedForm
                              .updateIn(['formatter'], f => f.setValue(metricInfo.formatter))
                              .updateIn(['conditionOperator'], f => f.setValue(null).setTouched(false))
                              .updateIn(['conditionValue'], f => f.setValue('').setTouched(false));

                            return updatedForm;
                          });
                        }
                      }}
                    />
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))}
            </Col>
          </Row>

          {form.get('metricName').value && (
            <ThresholdsFormGroup isPercentileMetric={isPercentileMetric} form={form} onChange={onChange} />
          )}
        </>
      )}

      <SectionHeading>3. Scope</SectionHeading>
      <Row>
        <Col lg={6}>
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
        <Col lg={6}>
          {form.get('applyOn').value === scopeDfq &&
            form.get('query').map(field => (
              <FormGroup>
                <Label htmlFor="event-query" hasError={!field.valid && field.touched}>
                  Dynamic Focus Query
                </Label>
                <InputWithDFQSelectionList
                  id={'event-query'}
                  placeholder={'e.g. entity.zone:"prod" AND entity.service.name:"Shop"'}
                  value={field.value || ''}
                  hasError={form.get('validationResult') && !form.get('validationResult').value.valid}
                  onChange={value => {
                    onChange('query', value, updatedForm => {
                      return startQueryValidation(
                        value,
                        updatedForm,
                        onChange,
                        setQueryValidationInProgress,
                        setSaveEnabled
                      );
                    });
                  }}
                  positionAbove
                />
                {queryValidationInProgress && <LoadingIndicator className={locals.queryLoading} inline />}
                <BackendValidationMessages validationResult={form.get('validationResult').value} />
                <TouchedMessages field={field} />
                <DescriptionText>
                  A <strong>non-empty</strong> filter query which defines for which entities the rule will be applied.
                  Select <i>&quot;Apply on: All available entities&quot;</i> if you want this rule to be applied on all
                  entities. For more information on syntax, please see our&nbsp;
                  <Link href="https://instana.com/docs/dynamic_focus/#syntax" external>
                    documentation
                  </Link>
                  .
                </DescriptionText>
              </FormGroup>
            ))}
        </Col>
      </Row>
      {form.get('applyOn').value === scopeApplication &&
        form.get('applicationIds').map(field => (
          <FormGroup>
            <Applications
              setTitle={false}
              loadEntities={() => getSelectedApplicationsForAlert(selectedApplicationIds)}
              hasRowNavigation={false}
              noDataMessage="No Application Perspectives Selected"
              tableActions={applicationSelectionTableActions(form, setForm)}
              rightHeader={
                <SelectListDialogButton
                  form={form}
                  onSubmit={selectedIds => submitApplicationSelection(form, setForm, selectedIds)}
                  title="Add Application Perspectives"
                  label="Add Application Perspectives"
                  listComponent={Applications}
                  listComponentRightHeader={noRightHeader}
                  limit={10}
                  hiddenIds={selectedApplicationIds}
                  createSubmitLabel={numberOfItems =>
                    numberOfItems > 0
                      ? `Add ${numberOfItems} Application Perspective${numberOfItems > 1 ? 's' : ''}`
                      : 'Add'
                  }
                  requiresAtLeastOneMessage="Please select at least one application perspectives."
                />
              }
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
    </fieldset>
  );
}

function EntityTypeFormGroup({ form, pluginsWithMetricDefinitions, onChange }) {
  return form.get('entityType').map(field => (
    <FormGroup>
      <Label htmlFor="event-entity-type" hasError={!field.valid && field.touched}>
        Entity Type
      </Label>
      <ComboBox
        name="event-entity-type"
        value={field.value}
        options={pluginsWithMetricDefinitions}
        onChange={e => {
          onChange('entityType', e ? e.value : null, updatedForm => {
            return updatedForm.updateIn(['metricName'], field => field.setValue(null).setTouched(false));
          });
        }}
        clearable={false}
      />
      <TouchedMessages field={field} />
    </FormGroup>
  ));
}

function ThresholdsFormGroup({ isPercentileMetric, form, onChange }) {
  return (
    <FormGroup noFlex>
      <Row>
        {!isPercentileMetric && (
          <Col lg={3}>
            {form.get('window').map(field => (
              <FormGroup>
                <Label htmlFor="event-window" hasError={!field.valid && field.touched}>
                  Time Window
                </Label>
                <ComboBox
                  name="event-window"
                  value={field.value}
                  options={getOptionsWithAdditionalValueIfMissing(windowOptions, field.value)}
                  onChange={e => onChange('window', e ? e.value : '')}
                  clearable={false}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Col>
        )}
        {isPercentileMetric && (
          <Col lg={3}>
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
                  clearable={false}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Col>
        )}
        {!isPercentileMetric && (
          <Col lg={3}>
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
                  clearable={false}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Col>
        )}
        <Col lg={3}>
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
                clearable={false}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </Col>
        <Col lg={3}>
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

function DynamicBuiltInFormGroup({ form, onChange }) {
  const entityType = form.get('entityType')?.value;
  const metricName = form.get('metricName')?.value;

  if (!entityType || !metricName || !isBuiltInDynamicMetric(entityType, metricName)) {
    return null;
  }

  const metricPatternPlaceholder = form.get('metricPatternPlaceholder');
  const metricPatternOperator = form.get('metricPatternOperator');

  return (
    <FormGroup noFlex>
      <Row>
        <Col lg={3}>
          {metricPatternOperator &&
            metricPatternOperator.map(field => (
              <FormGroup>
                <Label
                  htmlFor="event-metricPatternOperator"
                  hasError={!metricPatternOperator.valid && metricPatternOperator.touched}
                >
                  Matching Operator
                </Label>
                <ComboBox
                  name="event-metricPatternOperator"
                  value={metricPatternOperator.value}
                  options={metricPatternMatchingOptions}
                  onChange={e => {
                    const prevOperator = field.value;
                    const newOperator = e ? e.value : '';
                    onChange('metricPatternOperator', newOperator, updatedForm => {
                      if (newOperator === 'any') {
                        updatedForm = updatedForm.remove('metricPatternPlaceholder');
                      } else if (prevOperator === 'any') {
                        updatedForm = putMetricPatternPlaceholder(updatedForm);
                      }
                      return updatedForm;
                    });
                  }}
                  clearable={false}
                />
                <TouchedMessages field={metricPatternOperator} />
              </FormGroup>
            ))}
        </Col>
        <Col lg={6}>
          {metricPatternPlaceholder && (
            <FormGroup>
              <Label
                htmlFor="event-metricPatternPlaceholder"
                hasError={!metricPatternPlaceholder.valid && metricPatternPlaceholder.touched}
              >
                {getMetricDefinition(entityType, metricName).metricPattern?.placeholderLabel ?? 'Placeholder'}
              </Label>
              <Input
                id="event-metricPatternPlaceholder"
                type="text"
                value={metricPatternPlaceholder.value}
                onChange={e => onChange('metricPatternPlaceholder', e.target.value)}
                hasError={!metricPatternPlaceholder.valid && metricPatternPlaceholder.touched}
              />
              <TouchedMessages field={metricPatternPlaceholder} />
            </FormGroup>
          )}
        </Col>
      </Row>
    </FormGroup>
  );
}

function ObserveHostHasMatchingEntitiesRunningFormGroup({ entityTypes, form, onChange }) {
  const entityTypeOptions = entityTypes.filter(
    ({ value }) => entityTypesToExcludeInVerificationRule.indexOf(value) === -1
  );

  const matchingEntityType = form.get('matchingEntityType');
  const matchingOperator = form.get('matchingOperator');
  const matchingEntityLabel = form.get('matchingEntityLabel');
  const offlineDuration = form.get('offlineDuration');

  return (
    <FormGroup noFlex>
      <Row>
        <Col lg={3}>
          <FormGroup>
            <Label htmlFor="-entity-matchingtype" hasError={!matchingEntityType.valid && matchingEntityType.touch}>
              Entity Type
            </Label>
            <ComboBox
              name="matching-entity-type"
              value={matchingEntityType.value}
              options={entityTypeOptions}
              onChange={e => onChange('matchingEntityType', e ? e.value : '')}
              clearable={false}
            />
            <TouchedMessages field={matchingEntityType} />
          </FormGroup>
        </Col>
        <Col lg={3}>
          <FormGroup>
            <Label htmlFor="matching-operator" hasError={!matchingOperator.valid && matchingOperator.touched}>
              Entity Label Operator
            </Label>
            <ComboBox
              name="matching-operator"
              value={matchingOperator.value}
              options={entityLabelOperatorOptions}
              onChange={e => onChange('matchingOperator', e ? e.value : '')}
              clearable={false}
            />
            <TouchedMessages field={matchingOperator} />
          </FormGroup>
        </Col>
        <Col lg={3}>
          <FormGroup>
            <Label htmlFor="matching-entity-label" hasError={!matchingEntityLabel.valid && matchingEntityLabel.touched}>
              Entity Label
            </Label>
            <Input
              id="matching-entity-label"
              type="text"
              value={matchingEntityLabel.value || ''}
              onChange={e => onChange('matchingEntityLabel', e.target.value)}
              hasError={!matchingEntityLabel.valid && matchingEntityLabel.touched}
              maxLength={256}
              autoFocus
            />
            <TouchedMessages field={matchingEntityLabel} />
          </FormGroup>
        </Col>
        <Col lg={3}>
          <FormGroup>
            <Label htmlFor="offline-duration" hasError={!offlineDuration.valid && offlineDuration.touched}>
              Offline for
            </Label>
            <ComboBox
              name="offline-duration"
              value={offlineDuration.value}
              options={offlineDurationOptions}
              onChange={e => onChange('offlineDuration', e ? e.value : '')}
              clearable={false}
            />
            <TouchedMessages field={offlineDuration} />
          </FormGroup>
        </Col>
      </Row>
    </FormGroup>
  );
}

function getBuiltInMetricInfo(metricItem) {
  let formatter = undefinedMetricFormatter;
  let label = unknownMetricLabel;
  if (metricItem != null) {
    formatter = numberFormatterToFormatterType(metricItem.formatter);
    label = metricItem.origLabel || metricItem.label;
  }
  return {
    formatter,
    label
  };
}

function getCustomMetricInfo(customMetrics, selectedMetric) {
  let formatter = undefinedMetricFormatter;
  let label = unknownMetricLabel;
  const metricItem = find(customMetrics, _metric => _metric.value === selectedMetric);
  if (metricItem != null) {
    formatter = metricItem.formatter;
    label = metricItem.origLabel || metricItem.label;
  }
  return {
    formatter,
    label
  };
}

function updateEntityTypesWithDeprecation(pluginsWithMetricDefinitions, form) {
  const entityType = form.get('entityType')?.value;

  if (entityType && isDeprecatedEntityType(entityType)) {
    pluginsWithMetricDefinitions.push({
      value: entityType,
      label: getPluginName(entityType, 1) + ' (deprecated)'
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
        const metricItem = createCustomMetricListItem(metricName, undefinedMetricFormatter, metricName, entityType);
        customMetricsList.push(metricItem);
      }
    }
  }
}

function createCustomMetricListItem(metricName, formatter, label, entityType) {
  const metricItem = createMetricListItem(metricName, formatter, label, false);
  return {
    ...metricItem,
    entityType
  };
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
  // but do nothing if old and new query have the same value, this prevents us having an unlimited
  // loading spinner if same value got pasted again
  queryInput.once(previousQuery => {
    if (previousQuery !== query) {
      setQueryValidationProgressState(true, setQueryValidationInProgress, setSaveEnabled);
    }
  });

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
    updateFormDefinition = (form, eventSpec) => {
      form = form.remove('application');
      form = putQueryFields(form, eventSpec);
      return form.updateIn(['query'], f => {
        return f.setValue('');
      });
    };
  } else if (applyOn === scopeApplication) {
    updateFormDefinition = form => {
      form = removeQueryFields(form);
      form = putApplicationField(form, null);
      form = putApplicationIdField(form, []);
      return form;
    };
  } else {
    // applyOn === scopeEverything or not selected
    updateFormDefinition = form => {
      form = removeQueryFields(form);
      form = form.remove('application');
      form = form.remove('applicationIds');
      return form;
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

function isBuiltInDataSourceSelected(form) {
  return form.get('dataSource').value === dataSourceBuiltIn;
}

function isCustomDataSourceSelected(form) {
  return form.get('dataSource').value === dataSourceCustom;
}

function isSystemRuleDataSourceSelected(form) {
  return form.get('dataSource').value === dataSourceSystem;
}

const severityWarning = '5';
const severityCritical = '10';
const severityOptions = Object.freeze([
  { value: severityWarning, label: 'warning' },
  { value: severityCritical, label: 'critical' }
]);

const dataSourceOptions = Object.freeze([
  { value: dataSourceBuiltIn, label: 'Built-in metrics' },
  { value: dataSourceCustom, label: 'Custom metrics' },
  { value: dataSourceSystem, label: 'System Rules' }
]);

function systemRuleOptions(systemRules) {
  if (!systemRules) {
    return [];
  }
  return systemRules.map(({ id, name }) => ({ value: id, label: name }));
}

/**
 * Gets the given options but extends it with the selected value if it is missing.
 * This is needed for options where there has not always been a backend validation,
 * and therefore there could still be a some Custom Events using these values that
 * are not listed in possible options.
 * Therefore we include this custom value in the dropdown, instead of selecting
 * nothing.
 */
function getOptionsWithAdditionalValueIfMissing(options, selectedTimeValue) {
  if (selectedTimeValue && selectedTimeValue !== '0') {
    const optionsContainTimeValue = options.some(opt => opt.value == selectedTimeValue);
    return optionsContainTimeValue
      ? options
      : [
          {
            value: selectedTimeValue,
            label: millis.fixedCompact(selectedTimeValue)
          },
          ...options
        ];
  } else {
    return options;
  }
}

const gracePeriodOptions = Object.freeze([
  { value: '5000', label: '5 s' },
  { value: '10000', label: '10 s' },
  { value: '30000', label: '30 s' },
  { value: '60000', label: '60 s' },
  { value: '90000', label: '90 s' },
  { value: '300000', label: '5 min' },
  { value: '600000', label: '10 min' },
  { value: '1800000', label: '30 min' },
  { value: '3600000', label: '60 min' },
  { value: '5400000', label: '90 min' },
  { value: '7200000', label: '120 min' },
  { value: '14400000', label: '4 h' },
  { value: '21600000', label: '6 h' },
  { value: '43200000', label: '12 h' },
  { value: '86400000', label: '24 h' }
]);

const windowOptions = Object.freeze([
  { value: '1000', label: '1 s' },
  { value: '5000', label: '5 s' },
  { value: '10000', label: '10 s' },
  { value: '30000', label: '30 s' },
  { value: '60000', label: '60 s' },
  { value: '90000', label: '90 s' },
  { value: '300000', label: '5 min' },
  { value: '600000', label: '10 min' },
  { value: '1800000', label: '30 min' },
  { value: '3600000', label: '60 min' },
  { value: '5400000', label: '90 min' },
  { value: '7200000', label: '120 min' }
]);

const rollupOptions = Object.freeze([
  { value: '5000', label: '5 s' },
  { value: '60000', label: '1 min' },
  { value: '300000', label: '5 min' },
  { value: '3600000', label: '60 min' }
]);

const aggregationOptions = Object.freeze([
  { value: 'avg', label: 'avg' },
  { value: 'sum', label: 'sum' },
  { value: 'min', label: 'min' },
  { value: 'max', label: 'max' }
]);

const conditionOperatorOptions = Object.freeze([
  { value: '<', label: '<' },
  { value: '<=', label: '≤' },
  { value: '=', label: '=' },
  { value: '>=', label: '≥' },
  { value: '>', label: '>' },
  { value: '!=', label: '≠' }
]);

const entityTypesToExcludeInVerificationRule = Object.freeze([
  'application',
  'awsEbs',
  'awsLambda',
  'awsLambdaVersion',
  'cassandraCluster',
  'cockroachDBCluster',
  'consulCluster',
  'couchbaseCluster',
  'elasticsearchCluster',
  'endpoint',
  'hazelcastCluster',
  'host',
  'kafkaCluster',
  'kubernetesCluster',
  'kubernetesDeployment',
  'kubernetesNamespace',
  'kubernetesNode',
  'kubernetesPod',
  'kubernetesReplicaSet',
  'mongoDbReplicaSet',
  'openshiftDeploymentConfig',
  'ping',
  'redisCluster',
  'service'
]);

const entityLabelOperatorOptions = Object.freeze([
  { value: 'is', label: 'is' },
  { value: 'contains', label: 'contains' },
  { value: 'startsWith', label: 'starts with' },
  { value: 'endsWith', label: 'ends with' }
]);

const offlineDurationOptions = Object.freeze([
  { value: '60000', label: '1 min' },
  { value: '120000', label: '2 min' },
  { value: '180000', label: '3 min' },
  { value: '300000', label: '5 min' },
  { value: '600000', label: '10 min' },
  { value: '1800000', label: '30 min' },
  { value: '3600000', label: '60 min' },
  { value: '5400000', label: '90 min' },
  { value: '7200000', label: '120 min' },
  { value: '14400000', label: '4 h' },
  { value: '21600000', label: '6 h' },
  { value: '43200000', label: '12 h' },
  { value: '64800000', label: '18 h' },
  { value: '86400000', label: '24 h' }
]);

const metricPatternMatchingOptions = Object.freeze([
  { value: 'is', label: 'is' },
  { value: 'contains', label: 'contains' },
  { value: 'startsWith', label: 'starts with' },
  { value: 'endsWith', label: 'ends with' },
  { value: 'any', label: 'any' }
]);

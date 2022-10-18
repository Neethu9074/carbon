/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, lifecycle, withState } from 'recompose';
import React, { Fragment } from 'react';
import { fromJS } from 'immutable';
import { isEqual } from 'lodash';

import { Link, Spacer, Toggle } from '@instana/components';
import { create, just } from '@instana/observables';

import {
  dataSourceBuiltIn,
  dataSourceCustom,
  dataSourceSystem,
  entityVerification,
  hostAvailabilityDetection,
  isDeprecatedEntityType,
  putAggregationField,
  putApplicationField,
  putApplicationIdField,
  putMetricPatternOperator,
  putMetricPatternPlaceholder,
  putQueryFields,
  putRollupField,
  putScopeByHostsFields,
  putWindowField,
  removeQueryFields,
  removeScopeByHostsField,
  systemRules,
  updateFormDefinitionForDataSource,
  updateFormDefinitionForSystemRule
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import {
  aggregationOptions,
  conditionOperatorOptions,
  dataSourceOptions,
  getOptionsWithAdditionalValueIfMissing,
  gracePeriodOptions,
  metricPatternMatchingOptions,
  rollupOptions,
  severityOptions,
  systemRuleOptions,
  windowOptions
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/customEventFormUtil';
import Applications, {
  applicationSelectionTableActions,
  getSelectedApplicationConfigsByName,
  getSelectedApplicationsForAlert,
  noRightHeader,
  submitApplicationSelection
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/components/Applications';
import {
  createCustomMetricListItem,
  getCustomMetricsOptionsForPluginObservable,
  getPluginsWithCustomMetricsOptionsObservable
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/customMetricUtils';
import {
  applyOnOptions,
  applyOnOptionsForHostAvailability,
  scopeApplication,
  scopeDfq,
  scopeEverything,
  scopeHostsByTag
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import {
  containsMetricInList,
  getAllBuiltInMetrics,
  getMetricDefinition,
  isBuiltInDynamicMetric,
  isBuiltInPlainMetric,
  isBackendAggregatedPercentileMetric
} from 'in-sdk/metrics';
import {
  actionAutomationEnabled,
  deprecateAppDataLegacyEventsEnabled,
  disallowAppDataLegacyEventsEnabled,
  hideAppDataLegacyEventsEnabled
} from 'in-services/featureFlags';
import {
  formatterTypeToDefinition,
  getEntityTypeOptionsOfBuiltInMetrics,
  isAppDataEntityType
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';
import { ObserveHostHasMatchingEntitiesRunningFormGroup } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/ObserveHostHasMatchingEntitiesRunningFormGroup';
import InputWithDFQSelectionList from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/components/InputWithDFQSelectionList';
import BuiltInMetricSelector from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/BuiltInMetricSelector';
import CustomMetricSelector from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/CustomMetricSelector';
import HostAvailabilityFormGroup from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/HostAvailabilityFormGroup';
import ScopeHostsByTagFormGroup from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/ScopeHostsByTagFormGroup';
import { ActionsSelection } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/sharedActions';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import BackendValidationMessages from 'in-components/form/BackendValidationMessages';
import { compareIgnoreCase, isBlank, isNotBlank } from 'in-services/util/string';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import LegacyAppdataEventInfoMessage from './LegacyAppdataEventInfoMessage';
import { combinedValidationResults, valid } from 'in-settings/validation';
import EventDescription from 'in-events/components/EventDescription';
import SectionHeading from 'in-settings/components/SectionHeading';
import DescriptionText from 'in-components/form/DescriptionText';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { getFormatterType } from 'in-services/formatters/number';
import HelpText from 'in-components/form/HelpText/HelpText';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import FormGroup from 'in-settings/components/FormGroup';
import TextArea from 'in-components/form/TextArea';
import { getPluginName } from 'in-sdk/pluginName';
import Helpify from 'in-components/form/Helpify';
import ComboBox from 'in-components/ComboBox';
import { find } from 'in-services/arrayUtils';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { validate } from 'in-api/search';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

import locals from './CustomEventForm.mless';

const undefinedMetricFormatter = 'UNDEFINED';
const unknownMetricLabel = t('in-settings:tabs.unknown');

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
      observables.pluginsWithCustomMetrics = getPluginsWithCustomMetricsOptionsObservable();
      const entityType = form.get('entityType').value;
      if (entityType) {
        observables.customMetricsForPlugin = getCustomMetricsOptionsForPluginObservable(entityType);
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
  onChange,
  pluginsWithCustomMetrics,
  customMetricsForPlugin,
  queryValidationResult,
  queryValidationInProgress,
  setQueryValidationInProgress,
  setSaveEnabled,
  hideLegacyAppDataEventDeprecationInfo,
  existingApplication,
  disabled,
  entity
}) {
  applyQueryValidationResult(queryValidationResult, form, onChange);

  // extend custom-metrics list with current selected custom-metric,
  // in case it is not contained in the list. This might happen due to
  // deprecation or there is no such metric anymore
  addCurrentCustomMetricToListIfMissing(customMetricsForPlugin, form);

  let pluginsWithMetricDefinitions;
  if (form.get('dataSource') && form.get('dataSource').value !== dataSourceSystem) {
    pluginsWithMetricDefinitions = getEntityTypeOptionsOfBuiltInMetrics(true);
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
      <SectionHeading>{t('in-settings:tabs.1EventDetails')}</SectionHeading>
      <Row>
        <Col lg={8}>
          <Fragment>
            {form.get('name').map(field => (
              <FormGroup>
                <Label htmlFor="event-name" hasError={!field.valid && field.touched}>
                  {t('in-settings:tabs.name')}
                </Label>
                <Input
                  disabled={disabled}
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
                  {t('in-settings:tabs.showsUpInTheListOfEvents')}
                </HelpText>
              </FormGroup>
            ))}
            {form.get('description').map(field => (
              <FormGroup>
                <Label htmlFor="event-description" hasError={!field.valid && field.touched}>
                  {t('in-settings:tabs.description')}
                </Label>
                <TextArea
                  disabled={disabled}
                  id="event-description"
                  rows="3"
                  value={field.value}
                  onChange={e => onChange('description', e.target.value)}
                  hasError={!field.valid && field.touched}
                  maxLength={65536}
                />
                <TouchedMessages field={field} className={locals.subErrorTextFormField} />
                <HelpText className={locals.subTextFormField}>
                  {t('in-settings:tabs.showsUpInTheIssueDescription')}
                </HelpText>
              </FormGroup>
            ))}
            <FormGroup noFlex>
              <Row>
                <Col lg={4}>
                  {form.get('severity').map(field => (
                    <FormGroup>
                      <Label htmlFor="event-severity" hasError={!field.valid && field.touched}>
                        {t('in-settings:tabs.issueSeverity')}
                      </Label>
                      <ComboBox
                        isDisabled={disabled}
                        name="event-severity"
                        value={field.value}
                        options={severityOptions}
                        onChange={e => onChange('severity', e ? e.value : '')}
                        isClearable={false}
                      />
                      <TouchedMessages field={field} />
                    </FormGroup>
                  ))}
                </Col>
                <Col lg={4}>
                  {form.get('triggering').map(field => (
                    <FormGroup>
                      <Label htmlFor="event-triggering">{t('in-settings:tabs.incident')}</Label>
                      <Spacer horizontal="xxsmall" />
                      <Toggle
                        disabled={disabled}
                        id="event-triggering"
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
                        {t('in-settings:tabs.gracePeriod')}
                      </Label>
                      <Helpify
                        helpText={t('in-settings:tabs.periodToWaitBeforeClosingTheIssueOnceConditionsAreNoLongerMet')}
                      >
                        <ComboBox
                          isDisabled={disabled}
                          name="event-grace-period"
                          value={field.value}
                          className={locals.helpified}
                          options={getOptionsWithAdditionalValueIfMissing(gracePeriodOptions, field.value)}
                          onChange={e => onChange('gracePeriod', e?.value ?? '')}
                          isClearable={false}
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
            <Label>{t('in-settings:tabs.issuePreview')}</Label>
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
      <SectionHeading>{t('in-settings:tabs.2Condition')}</SectionHeading>
      {form.get('dataSource').map(field => (
        <FormGroup>
          <Label htmlFor="event-data-source" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.source')}
          </Label>
          <ComboBox
            isDisabled={disabled}
            name="event-data-source"
            value={field.value}
            options={dataSourceOptions}
            onChange={e => {
              onChange('dataSource', e ? e.value : null, (updatedForm, eventSpec) => {
                return updateFormDefinitionForDataSource(updatedForm, field.value, eventSpec, systemRules);
              });
            }}
            isClearable={false}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {isSystemRuleDataSourceSelected(form) && (
        <>
          {form.get('systemRule').map(field => (
            <FormGroup>
              <Label htmlFor="event-system-rule" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.systemRule')}
              </Label>
              <ComboBox
                isDisabled={disabled}
                name="event-system-rule"
                value={field.value}
                options={systemRuleOptions(systemRules)}
                onChange={e => {
                  onChange('systemRule', e ? e.value : null, (updatedForm, eventSpec) => {
                    return updateFormDefinitionForSystemRule(updatedForm, field.value, eventSpec, systemRules);
                  });
                }}
                isClearable={false}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}

          {form.get('systemRule') && form.get('systemRule').value === entityVerification.id && (
            <ObserveHostHasMatchingEntitiesRunningFormGroup
              disabled={disabled}
              form={form}
              entityTypes={getEntityTypeOptionsOfBuiltInMetrics(true)}
              onChange={onChange}
            />
          )}

          {isHostAvailabilitySystemRule() && (
            <HostAvailabilityFormGroup form={form} onChange={onChange} disabled={disabled} />
          )}
        </>
      )}

      {isBuiltInDataSourceSelected(form) && (
        <>
          <Row>
            <Col lg={3}>
              <EntityTypeFormGroup
                disabled={disabled}
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
                      {t('in-settings:tabs.metric')}
                    </Label>
                    <BuiltInMetricSelector
                      disabled={disabled}
                      id="event-metricName"
                      plugin={form.get('entityType').value}
                      value={form.get('metricName').value}
                      isClearable={false}
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

          <DynamicBuiltInFormGroup form={form} onChange={onChange} disabled={disabled} />

          {form.get('entityType').value && form.get('metricName').value && (
            <ThresholdsFormGroup
              disabled={disabled}
              isPercentileMetric={isPercentileMetric}
              form={form}
              onChange={onChange}
            />
          )}
        </>
      )}

      {isCustomDataSourceSelected(form) && (
        <>
          <Row>
            <Col lg={3}>
              <EntityTypeFormGroup
                disabled={disabled}
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
                      {t('in-settings:tabs.metric')}
                    </Label>
                    <CustomMetricSelector
                      disabled={disabled}
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
            <ThresholdsFormGroup
              disabled={disabled}
              isPercentileMetric={isPercentileMetric}
              form={form}
              onChange={onChange}
            />
          )}
        </>
      )}
      {!hideAppDataLegacyEventsEnabled &&
        deprecateAppDataLegacyEventsEnabled &&
        !hideLegacyAppDataEventDeprecationInfo &&
        !disabled &&
        isAppDataEntityType(form.get('entityType')?.value ?? '') && <LegacyAppdataEventInfoMessage />}

      <SectionHeading>{t('in-settings:tabs.3Scope')}</SectionHeading>
      <Row>
        <Col lg={6}>
          {form.get('applyOn').map(field => (
            <FormGroup>
              <Label htmlFor="event-apply-on" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.applyOnRequired')}
              </Label>
              <ComboBox
                name="event-apply-on"
                value={field.value}
                options={isHostAvailabilitySystemRule() ? applyOnOptionsForHostAvailability : applyOnOptions}
                isClearable={false}
                onChange={e => onChangeApplyOn(e ? e.value : null, onChange)}
                isDisabled={disabled}
              />
              <TouchedMessages field={field} />
              {form.get('applyOn').value === scopeEverything && (
                <DescriptionText>
                  <Trans i18nKey="in-settings:tabs.thisWillMatchAndCreateIssuesOnAllAvailableEntitiesForTheConditionsSpecified" />
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
                  {t('in-settings:tabs.dynamicFocusQuery')}
                </Label>
                <InputWithDFQSelectionList
                  disabled={disabled}
                  id={'event-query'}
                  placeholder={t('in-settings:tabs.formatExample', {
                    format: 'entity.zone:"prod" AND entity.service.name:"Shop"'
                  })}
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
                  <Trans
                    i18nKey="in-settings:tabs.aNonEmptyFilterQueryWhichDefinesForWhichEntitiesTheRuleWillBeApplied"
                    components={{
                      docLink: (
                        <Link
                          href="https://www.ibm.com/docs/en/obi/current?topic=instana-filtering-dynamic-focus#syntax"
                          external
                        />
                      )
                    }}
                  />
                </DescriptionText>
              </FormGroup>
            ))}
          {isHostAvailabilitySystemRule() && form.get('applyOn').value === scopeHostsByTag && (
            <ScopeHostsByTagFormGroup form={form} onChange={onChange} disabled={disabled} />
          )}
        </Col>
      </Row>
      {form.get('applyOn').value === scopeApplication &&
        form.get('applicationIds').map(field => (
          <FormGroup>
            <Applications
              setTitle={false}
              loadEntities={() => getSelectedApplicationsForAlert(selectedApplicationIds)}
              hasRowNavigation={false}
              noDataMessage={t('in-settings:tabs.noApplicationPerspectivesSelected')}
              tableActions={!disabled && applicationSelectionTableActions(form, setForm)}
              rightHeader={
                !disabled && (
                  <SelectListDialogButton
                    form={form}
                    onSubmit={selectedIds => submitApplicationSelection(form, setForm, selectedIds)}
                    title={t('in-settings:tabs.addApplicationPerspectives')}
                    label={t('in-settings:tabs.addApplicationPerspectives')}
                    listComponent={Applications}
                    listComponentRightHeader={noRightHeader}
                    limit={10}
                    hiddenIds={selectedApplicationIds}
                    createSubmitLabel={numberOfItems =>
                      numberOfItems > 0
                        ? t('in-settings:tabs.addNumberOfItemsApplicationPerspective', { count: numberOfItems })
                        : t('in-settings:tabs.add')
                    }
                    requiresAtLeastOneMessage={t('in-settings:tabs.pleaseSelectAtLeastOneApplicationPerspectives')}
                  />
                )
              }
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
      {role.canConfigureAutomationActions && actionAutomationEnabled && !form.get('triggering').value && (
        <>
          <SectionHeading>{t('in-settings:tabs.4ActionAssociations')}</SectionHeading>
          <ActionsSelection form={form} setForm={setForm} entity={entity} />
        </>
      )}
    </fieldset>
  );

  function isHostAvailabilitySystemRule() {
    return form.get('systemRule')?.value === hostAvailabilityDetection.id;
  }
}

function EntityTypeFormGroup({ form, pluginsWithMetricDefinitions = [], onChange, disabled }) {
  return form.get('entityType').map(field => (
    <FormGroup>
      <Label htmlFor="event-entity-type" hasError={!field.valid && field.touched}>
        {t('in-settings:tabs.entityType')}
      </Label>
      <ComboBox
        isDisabled={disabled}
        name="event-entity-type"
        value={field.value}
        options={pluginsWithMetricDefinitions?.filter(plugin => entityTypesFilter(plugin.value, disabled))}
        onChange={e => {
          onChange('entityType', e ? e.value : null, updatedForm => {
            return updatedForm.updateIn(['metricName'], field => field.setValue(null).setTouched(false));
          });
        }}
        isClearable={false}
      />
      <TouchedMessages field={field} />
    </FormGroup>
  ));
}

function entityTypesFilter(entityType, readOnly) {
  if (!isAppDataEntityType(entityType)) {
    return true;
  }

  return (
    (!hideAppDataLegacyEventsEnabled && !disallowAppDataLegacyEventsEnabled) ||
    // We can always expose the deprecated type in read-only state, so that the selected option is populated correctly
    readOnly
  );
}

function ThresholdsFormGroup({ isPercentileMetric, form, onChange, disabled }) {
  return (
    <FormGroup noFlex>
      <Row>
        {!isPercentileMetric && (
          <Col lg={3}>
            {form.get('window').map(field => (
              <FormGroup>
                <Label htmlFor="event-window" hasError={!field.valid && field.touched}>
                  {t('in-settings:tabs.timeWindow')}
                </Label>
                <ComboBox
                  isDisabled={disabled}
                  name="event-window"
                  value={field.value}
                  options={getOptionsWithAdditionalValueIfMissing(windowOptions, field.value)}
                  onChange={e => onChange('window', e ? e.value : '')}
                  isClearable={false}
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
                  {t('in-settings:tabs.windowSize')}
                </Label>
                <ComboBox
                  isDisabled={disabled}
                  name="event-rollup"
                  value={field.value}
                  options={rollupOptions}
                  onChange={e => onChange('rollup', e ? e.value : '')}
                  isClearable={false}
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
                  {t('in-settings:tabs.aggregation')}
                </Label>
                <ComboBox
                  isDisabled={disabled}
                  name="event-aggregation"
                  value={field.value}
                  options={aggregationOptions}
                  onChange={e => onChange('aggregation', e ? e.value : e)}
                  isClearable={false}
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
                {t('in-settings:tabs.operator')}
              </Label>
              <ComboBox
                isDisabled={disabled}
                name="event-conditionOperator"
                value={field.value}
                options={conditionOperatorOptions}
                onChange={e => onChange('conditionOperator', e ? e.value : e)}
                isClearable={false}
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
                disabled={disabled}
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

function DynamicBuiltInFormGroup({ form, onChange, disabled }) {
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
                  {t('in-settings:tabs.matchingOperator')}
                </Label>
                <ComboBox
                  isDisabled={disabled}
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
                  isClearable={false}
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
                disabled={disabled}
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

function getBuiltInMetricInfo(metricItem) {
  let formatter = undefinedMetricFormatter;
  let label = unknownMetricLabel;
  if (metricItem != null) {
    formatter = getFormatterType(metricItem.formatter);
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

export function onChangeApplyOn(applyOn, onChange) {
  let updateFormDefinition;

  if (applyOn === scopeDfq) {
    updateFormDefinition = (form, eventSpec) => {
      form = form.remove('application');
      form = removeScopeByHostsField(form);
      form = putQueryFields(form, eventSpec);
      return form.updateIn(['query'], f => {
        return f.setValue('');
      });
    };
  } else if (applyOn === scopeApplication) {
    updateFormDefinition = form => {
      form = removeQueryFields(form);
      form = removeScopeByHostsField(form);
      form = putApplicationField(form, null);
      form = putApplicationIdField(form, []);
      return form;
    };
  } else if (applyOn === scopeHostsByTag) {
    updateFormDefinition = form => {
      form = removeQueryFields(form);
      form = form.remove('application');
      form = form.remove('applicationIds');
      form = putScopeByHostsFields(form);

      return form;
    };
  } else {
    // applyOn === scopeEverything or not selected
    updateFormDefinition = form => {
      form = removeQueryFields(form);
      form = form.remove('application');
      form = form.remove('applicationIds');
      form = removeScopeByHostsField(form);

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
  return isBackendAggregatedPercentileMetric(entityType, metricName);
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

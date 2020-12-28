import { createField, createMapForm, createListForm, notBlankValidator } from 'formalistic';
import { just } from '@instana/observables';
import React, { Fragment } from 'react';
import classNames from 'classnames';
import { get } from 'lodash';

import {
  createNewApplicationConfig,
  getApplicationConfig,
  addApplicationConfig,
  updateApplicationConfig
} from 'in-api/applicationConfigs';
import InboundOrAllCallsChoiceVertical from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsChoiceVertical';
import {
  getSecondLevelKeySuggestions,
  getValueSuggestions
} from 'in-analyze/AnalyzeView/components/AnalyzeEditTagFilterDialog';
import EditTagFilterDialog from 'in-analyze/components/EditTagFilterDialog/EditTagFilterDialog';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import BasicForm, { matchSpecificationValidator } from 'in-applications/Forms/BasicForm';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import TagFilterList from 'in-analyze/AnalyzeView/components/TagFilterList';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getApplicationCreationTagKeys } from 'in-applications/tags';
import { applicationSubmitTracker } from 'in-applications/tracker';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import OptionBox from 'in-applications/components/OptionBox';
import Steps from 'in-applications/Forms/components/Steps';
import { entityTypes } from 'in-analyze/applicationFilter';
import { getColor } from 'in-applications/endpointTypes';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import { isBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Pill from 'in-new-components/Pill';
import Card from 'in-new-components/Card';

import locals from './CreateApplicationDialog.mless';

export default function CreateApplicationDialog({ timeConfig, applicationId, onCancelHref$, getOnSavePath }) {
  return (
    <MaxWidthFullscreenContainer className={locals.maxWidthFullscreenContainer}>
      <Card title={applicationId ? 'Update Application Perspective' : 'Create Application Perspective'}>
        <BasicForm
          saveButtonLabel={applicationId ? 'Save' : 'Create'}
          onCancelHref$={onCancelHref$}
          getOnSavePath={getOnSavePath}
          getEntity={() =>
            applicationId
              ? getApplicationConfig(applicationId)
              : just({ progress: { loading: false }, errors: [], data: createNewApplicationConfig() })
          }
          updateEntity={applicationConfig => {
            applicationSubmitTracker({
              name: applicationConfig.label,
              downstreamEnabled: applicationConfig.scope === 'INCLUDE_ALL_DOWNSTREAM',
              tags: applicationConfig.matchSpecification.map(spec => spec.key)
            });
            const isNewConfig = !applicationConfig.id ? true : false;
            if (isNewConfig) {
              return addApplicationConfig(applicationConfig);
            }
            return updateApplicationConfig(applicationConfig);
          }}
          getInitialForm={getInitialForm}
          renderFormContent={(appConfig, form, setValue, updateForm) => {
            const tagFiltersForSubscription = getTagFilterListForBackendSubscription(
              form.get('matchSpecification').toJS()
            );
            const filters = {
              timeConfig,
              tagFilter: tagFiltersForSubscription
            };
            return (
              <Fragment>
                <HelpText>
                  Application perspectives provide a means to model environments, sets of services, tenants, or just
                  about anything.
                </HelpText>
                <Steps
                  steps={[
                    {
                      stepTitle: 'Define a name for your application perspective.',
                      content: form.get('label').map(field => (
                        <FormGroup>
                          <Label htmlFor="label" hasError={!field.valid && field.touched}>
                            Application Perspective Name
                          </Label>
                          <Input
                            type="text"
                            id="label"
                            value={field.value}
                            onChange={e => setValue(['label'], e.target.value, form)}
                            autoComplete="off"
                            hasError={!field.valid && field.touched}
                            autoFocus
                          />
                          <TouchedMessages field={field} />

                          {applicationId && (
                            <HelpText>
                              Renaming an application is an eventually consistent action within the Instana system. For
                              this reason, a change to an application name may take <em>up to a few minutes</em> until
                              it has populated throughout the whole system.
                            </HelpText>
                          )}

                          <DescriptionText className={locals.applicationNameText}>
                            {`Application perspective names should have a well established definition within an organization. For example,
                      to model an environment: "Production Blue", to model a set of services: "Payment", or to model a
                      tenant: "ACME Customer".`}
                          </DescriptionText>
                        </FormGroup>
                      ))
                    },
                    {
                      stepTitle: 'Define the application perspective using one or more tags.',
                      content: (
                        <Fragment>
                          <DescriptionText>
                            {`For example where key is "docker.label" and value is "environment=Production Blue",
                            or key is "call.http.params" and value is "tenant=ACMECustomer". Note that any calls to a`}
                            <Pill color={getColor('DATABASE')} kind="light">
                              DATABASE
                            </Pill>
                            service or
                            <Pill color={getColor('MESSAGING')} kind="light">
                              MESSAGING
                            </Pill>
                            service from services matching this definition will automatically be included.
                            <br />
                            <br />
                            <strong>AND operators take precedence and are evaluated before OR operators</strong>
                          </DescriptionText>

                          <div className={locals.addRuleButtonWrapper}>
                            <Button
                              kind="action"
                              onClick={() =>
                                addActiveDialog(
                                  <EditTagFilterDialog
                                    tagFilters={filters.tagFilter}
                                    timeConfig={filters.timeConfig}
                                    tagSuggestions={getApplicationCreationTagKeys()}
                                    getKeySuggestions={getSecondLevelKeySuggestions}
                                    getValueSuggestions={getValueSuggestions}
                                    addTagFilter={_tag => {
                                      const additionalSubForm = getEnrichedMatchSpecificationForm({
                                        key: _tag.name,
                                        entity: _tag.entity,
                                        secondLevelName: _tag.secondLevelName || '',
                                        value: _tag.value || '',
                                        operator: _tag.operator
                                      });
                                      updateForm(
                                        form.updateIn(['matchSpecification'], list =>
                                          list.push(additionalSubForm).setTouched(true)
                                        )
                                      );
                                    }}
                                    forAnalyzeCalls
                                  />
                                )
                              }
                              icon="lib_openclose_add_circle_outline"
                            >
                              Add Tag
                            </Button>
                          </div>
                          <TagFilterList
                            filterConnectionOperators={['OR', 'AND']}
                            onOperatorChanged={(i, operator) => {
                              updateForm(
                                form.updateIn(['matchSpecification', i, 'conjunction'], field =>
                                  field.setValue(operator).setTouched(true)
                                )
                              );
                            }}
                            tagFilters={form.get('matchSpecification').map((matchSpecification, i) => ({
                              tag: {
                                name: matchSpecification.get('key').value,
                                entity: matchSpecification.get('entity').value,
                                value: matchSpecification.get('value').value,
                                operator: matchSpecification.get('operator').value,
                                secondLevelName: matchSpecification.get('secondLevelName').value,
                                conjunction: matchSpecification.get('conjunction').value
                              },
                              onClick: () =>
                                addActiveDialog(
                                  <EditTagFilterDialog
                                    tagFilter={{
                                      name: matchSpecification.get('key').value,
                                      entity: matchSpecification.get('entity').value,
                                      value: matchSpecification.get('value').value,
                                      operator: matchSpecification.get('operator').value,
                                      secondLevelName: matchSpecification.get('secondLevelName').value
                                    }}
                                    tagFilters={filters.tagFilter}
                                    timeConfig={filters.timeConfig}
                                    tagSuggestions={getApplicationCreationTagKeys()}
                                    getKeySuggestions={getSecondLevelKeySuggestions}
                                    getValueSuggestions={getValueSuggestions}
                                    updateTagFilter={_tag => {
                                      form = form.updateIn(['matchSpecification', i, 'value'], field =>
                                        field.setValue(_tag.value || '').setTouched(true)
                                      );
                                      form = form.updateIn(['matchSpecification', i, 'key'], field =>
                                        field.setValue(_tag.name).setTouched(true)
                                      );
                                      form = form.updateIn(['matchSpecification', i, 'entity'], field =>
                                        field.setValue(_tag.entity).setTouched(true)
                                      );
                                      form = form.updateIn(['matchSpecification', i, 'operator'], field =>
                                        field.setValue(_tag.operator).setTouched(true)
                                      );
                                      form = form.updateIn(['matchSpecification', i, 'secondLevelName'], field =>
                                        field.setValue(_tag.secondLevelName).setTouched(true)
                                      );

                                      updateForm(form);
                                    }}
                                    removeTagFilter={() => removeMatchSpecification(i, form, updateForm)}
                                    forAnalyzeCalls
                                  />
                                ),
                              onRemove: () => removeMatchSpecification(i, form, updateForm)
                            }))}
                          />
                        </Fragment>
                      )
                    },
                    {
                      stepTitle: 'Downstream services.',
                      content: form.get('scope').map(field => (
                        <FormGroup>
                          <OptionBox
                            className={classNames({
                              [locals.optionBox]: true,
                              [locals.optionBoxUnchecked]: field.value !== 'INCLUDE_NO_DOWNSTREAM'
                            })}
                            title="No downstream services"
                            asRadioButton
                            checked={field.value == 'INCLUDE_NO_DOWNSTREAM'}
                            onChange={() => setValue(['scope'], 'INCLUDE_NO_DOWNSTREAM', form)}
                          />
                          <OptionBox
                            className={classNames({
                              [locals.optionBox]: true,
                              [locals.optionBoxUnchecked]:
                                field.value !== 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING'
                            })}
                            title="Immediate downstream database and messaging services"
                            asRadioButton
                            checked={field.value == 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING'}
                            onChange={() =>
                              setValue(['scope'], 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING', form)
                            }
                          />
                          <OptionBox
                            className={classNames({
                              [locals.optionBox]: true,
                              [locals.optionBoxUnchecked]: field.value !== 'INCLUDE_ALL_DOWNSTREAM'
                            })}
                            title="All downstream services"
                            asRadioButton
                            checked={field.value == 'INCLUDE_ALL_DOWNSTREAM'}
                            onChange={() => setValue(['scope'], 'INCLUDE_ALL_DOWNSTREAM', form)}
                          />
                        </FormGroup>
                      ))
                    },
                    {
                      stepTitle: 'Application scope.',
                      content: form.get('boundaryScope').map(field => {
                        return (
                          <FormGroup>
                            <InboundOrAllCallsChoiceVertical
                              boundaryScope={field.value}
                              onBoundaryStateChange={value => setValue(['boundaryScope'], value.boundaryScope, form)}
                            />
                          </FormGroup>
                        );
                      })
                    }
                  ]}
                />
              </Fragment>
            );
          }}
        />
      </Card>
    </MaxWidthFullscreenContainer>
  );
}

function removeMatchSpecification(i, form, updateForm) {
  updateForm(form.updateIn(['matchSpecification'], list => list.remove(i).setTouched(true)));
}

function getInitialForm(application) {
  return createMapForm()
    .put(
      'id',
      createField({
        value: application.id
      })
    )
    .put(
      'label',
      createField({
        value: application.label,
        validator: applicationLabelValidator
      })
    )
    .put(
      'matchSpecification',
      get(application, 'matchSpecification', []).reduce(
        (form, matchSpecification) => form.push(getEnrichedMatchSpecificationForm(matchSpecification)),
        createListForm({
          validator: matchSpecificationValidator
        })
      )
    )
    .put(
      'scope',
      createField({
        value: application.scope
      })
    )
    .put(
      'boundaryScope',
      createField({
        value: application.boundaryScope
      })
    );
}

function getMatchSpecificationForm(matchSpecification = {}) {
  return createMapForm()
    .put(
      'key',
      createField({
        value: get(matchSpecification, 'key', ''),
        validator: notBlankValidator
      })
    )
    .put(
      'entity',
      createField({
        value: get(matchSpecification, 'entity', entityTypes.NOT_APPLICABLE),
        validator: notBlankValidator
      })
    )
    .put(
      'secondLevelName',
      createField({
        value: get(matchSpecification, 'secondLevelName', '')
      })
    )
    .put(
      'value',
      createField({
        value: get(matchSpecification, 'value', '')
      })
    )
    .put(
      'operator',
      createField({
        value: get(matchSpecification, 'operator', 'EQUALS')
      })
    );
}

function getEnrichedMatchSpecificationForm(matchSpecification) {
  return getMatchSpecificationForm(matchSpecification).put(
    'conjunction',
    createField({
      value: get(matchSpecification, 'conjunction', 'AND')
    })
  );
}

function applicationLabelValidator(name) {
  if (isBlank(name)) {
    return [
      {
        severity: 'error',
        message: 'The application perspective name must not be blank.'
      }
    ];
  }

  if (name.length > 128) {
    return [
      {
        severity: 'error',
        message: 'The application perspective name must not be larger than 128 characters.'
      }
    ];
  }

  return null;
}

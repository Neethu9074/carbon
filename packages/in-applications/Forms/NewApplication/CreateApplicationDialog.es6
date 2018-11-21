import { createField, createMapForm, createListForm } from 'formalistic';
import { just } from 'reactive-observables';
import React, { Fragment } from 'react';
import { get } from 'lodash';

import {
  createNewApplicationConfig,
  getApplicationConfig,
  addApplicationConfig,
  updateApplicationConfig
} from 'in-api/applicationConfigs';
import BasicForm, { getMatchSpecificationForm, matchSpecificationValidator } from 'in-applications/Forms/BasicForm';
import { getTagFilterListForBackendSubscription, operatorBlacklists } from 'in-analyze/applicationFilter';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getApplicationCreationTagKeys } from 'in-applications/tags';
import TagFilterList from 'in-analyze/AnalyzeView/components/TagFilterList';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import EditFilterDialog from 'in-analyze/Dialogs/EditFilterDialog';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import Steps from 'in-applications/Forms/components/Steps';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import { isBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { fromJS } from 'immutable';

import locals from './CreateApplicationDialog.mless';

export default function CreateApplicationDialog({ timeConfig, applicationId, onCancelHref$, getOnSavePath }) {
  return (
    <MaxWidthFullscreenContainer className={locals.maxWidthFullscreenContainer}>
      <BasicForm
        title={applicationId ? 'Update Application Perspective' : 'Create Application Perspective'}
        generalHelpText="Application perspectives provide a means to model environments, sets of services, tenants, or just about anything."
        saveButtonLabel={applicationId ? 'Save' : 'Create'}
        onCancelHref$={onCancelHref$}
        getOnSavePath={getOnSavePath}
        getEntity={() =>
          applicationId
            ? getApplicationConfig(applicationId)
            : just({ progress: { loading: false }, errors: [], data: createNewApplicationConfig() })
        }
        updateEntity={applicationConfig => {
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
          const filters = fromJS({
            timeConfig,
            tagFilter: tagFiltersForSubscription
          });
          return (
            <Fragment>
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
                            this reason, a change to an application name may take <em>up to a few minutes</em> until it
                            has populated throughout the whole system.
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
                          {`For example where key is "docker.label" and value is "environment=Production Blue", or key is "call.http.params" and value is "tenant=ACMECustomer". Note that any calls to a database from services matching this definition will automatically be included.`}
                          <br />
                          <br />
                          <strong>AND operators take precedence and are evaluated before OR operators</strong>
                        </DescriptionText>

                        <div className={locals.addRuleButtonWrapper}>
                          <Button
                            kind="action"
                            onClick={() =>
                              setActiveDialog(
                                <EditFilterDialog
                                  filters={filters}
                                  keys={getApplicationCreationTagKeys()}
                                  onSave={_tag => {
                                    const additionalSubForm = getEnrichedMatchSpecificationForm({
                                      key: _tag.name,
                                      secondLevelName: _tag.secondLevelName,
                                      value: _tag.value,
                                      operator: _tag.operator,
                                      conjunction: _tag.conjunction
                                    });
                                    updateForm(
                                      form.updateIn(['matchSpecification'], list =>
                                        list.push(additionalSubForm).setTouched(true)
                                      )
                                    );
                                  }}
                                  operatorBlacklist={operatorBlacklists.appConfigBlacklist}
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
                              value: matchSpecification.get('value').value,
                              operator: matchSpecification.get('operator').value,
                              secondLevelName: matchSpecification.get('secondLevelName').value,
                              conjunction: matchSpecification.get('conjunction').value
                            },
                            onClick: () =>
                              setActiveDialog(
                                <EditFilterDialog
                                  filters={filters}
                                  keys={getApplicationCreationTagKeys()}
                                  name={matchSpecification.get('key').value}
                                  value={matchSpecification.get('value').value}
                                  operator={matchSpecification.get('operator').value}
                                  secondLevelName={matchSpecification.get('secondLevelName').value}
                                  onSave={_tag => {
                                    form = form.updateIn(['matchSpecification', i, 'value'], field =>
                                      field.setValue(_tag.value).setTouched(true)
                                    );
                                    form = form.updateIn(['matchSpecification', i, 'key'], field =>
                                      field.setValue(_tag.name).setTouched(true)
                                    );
                                    form = form.updateIn(['matchSpecification', i, 'operator'], field =>
                                      field.setValue(_tag.operator).setTouched(true)
                                    );
                                    form = form.updateIn(['matchSpecification', i, 'secondLevelName'], field =>
                                      field.setValue(_tag.secondLevelName).setTouched(true)
                                    );

                                    updateForm(form);
                                  }}
                                  onRemove={() => removeMatchSpecification(i, form, updateForm)}
                                  removeItemName="Filter"
                                  operatorBlacklist={operatorBlacklists.appConfigBlacklist}
                                />
                              ),
                            onRemove: () => removeMatchSpecification(i, form, updateForm)
                          }))}
                        />
                      </Fragment>
                    )
                  }
                ]}
              />
            </Fragment>
          );
        }}
      />
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

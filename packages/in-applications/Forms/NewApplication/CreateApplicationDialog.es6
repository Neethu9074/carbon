import { createField, createMapForm, createListForm } from 'formalistic';
import { just } from 'reactive-observables';
import React, { Fragment } from 'react';
import { assign, get } from 'lodash';

import {
  createNewApplicationConfig,
  getApplicationConfig,
  addApplicationConfig,
  updateApplicationConfig
} from 'in-api/applicationConfigs';
import BasicForm, { getMatchSpecificationForm, matchSpecificationValidator } from 'in-applications/Forms/BasicForm';
import { getApplicationCreationFilterBlacklist } from 'in-applications/tags';
import TagFilterList from 'in-analyze/Analyze/components/TagFilterList';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import EditFilterDialog from 'in-analyze/Dialogs/EditFilterDialog';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import { createTracker } from 'in-services/tracking/mixpanel';
import Spacer from 'in-applications/Forms/components/Spacer';
import Steps from 'in-applications/Forms/components/Steps';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import { isBlank } from 'in-services/util/string';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

const trackCreateApplication = createTracker('application.create');
const trackUpdateApplication = createTracker('application.update');

import locals from './CreateApplicationDialog.mless';

export default function CreateApplicationDialog({ applicationId, onCancelHref$, getOnSavePath }) {
  return (
    <BasicForm
      title={applicationId ? 'Update Application' : 'Create Application'}
      generalHelpText="Applications provide a means to model environments, sets of services, tenants, or just about anything. They can be thought of as perspectives on services and their endpoints."
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
          return addApplicationConfig(applicationConfig).tap(() =>
            trackCreateApplication(mapTagsForTracking(applicationConfig))
          );
        }
        return updateApplicationConfig(applicationConfig).tap(() =>
          trackUpdateApplication(mapTagsForTracking(applicationConfig))
        );
      }}
      getInitialForm={getInitialForm}
      renderFormContent={(appConfig, form, setValue, updateForm) => {
        return (
          <Fragment>
            <Steps
              steps={[
                {
                  stepTitle: 'Define a name for your application:',
                  content: form.get('label').map(field => (
                    <FormGroup>
                      <Label htmlFor="label" hasError={!field.valid && field.touched}>
                        Application Name
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
                          Renaming an application is an eventually consistent action within the Instana system. For this
                          reason, a change to an application name may take <em>up to a few minutes</em> until it has
                          populated throughout the whole system.
                        </HelpText>
                      )}

                      <DescriptionText className={locals.applicationNameText}>
                        {`Application names should have a well established definition within an organization. For example,
                      to model an environment: "Production Blue", to model a set of services "Users", or to model a
                      tenant: "ACME Customer."`}
                      </DescriptionText>
                    </FormGroup>
                  ))
                },

                {
                  stepTitle: 'Define the application through one or more tags:',
                  content: (
                    <Fragment>
                      <DescriptionText>
                        {`For example: key as "docker.label" and value as "environment=Production Blue", or key as "call.http.params" and value as "tenant=ACMECustomer". When at least one specified condition matches a call, it will be considered part of this application.`}
                      </DescriptionText>

                      <Spacer />

                      <TagFilterList
                        addButtonLabel="Tag"
                        filterConnectionOperator="OR"
                        onAddTagFilter={() =>
                          setActiveDialog(
                            <EditFilterDialog
                              withInstanaCategory={false}
                              blacklist={getApplicationCreationFilterBlacklist()}
                              onSave={_tag => {
                                const additionalSubForm = getMatchSpecificationForm({
                                  key: _tag.name,
                                  secondLevelName: _tag.secondLevelName,
                                  value: _tag.value,
                                  operator: _tag.operator
                                });
                                updateForm(
                                  form.updateIn(['matchSpecification'], list =>
                                    list.push(additionalSubForm).setTouched(true)
                                  )
                                );
                              }}
                            />
                          )
                        }
                        tagFilters={form.get('matchSpecification').map((matchSpecification, i) => ({
                          tag: {
                            name: matchSpecification.get('key').value,
                            value: matchSpecification.get('value').value,
                            operator: matchSpecification.get('operator').value,
                            secondLevelName: matchSpecification.get('secondLevelName').value
                          },
                          onClick: () =>
                            setActiveDialog(
                              <EditFilterDialog
                                withInstanaCategory={false}
                                blacklist={getApplicationCreationFilterBlacklist()}
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
                                removePostPhrase="Filter"
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
        (form, matchSpecification) => form.push(getMatchSpecificationForm(matchSpecification)),
        createListForm({
          validator: matchSpecificationValidator
        })
      )
    );
}

function applicationLabelValidator(name) {
  if (isBlank(name)) {
    return [
      {
        severity: 'error',
        message: 'The application name must not be blank.'
      }
    ];
  }

  if (name.length > 128) {
    return [
      {
        severity: 'error',
        message: 'The application name must not be larger than 128 characters.'
      }
    ];
  }

  return null;
}

function mapTagsForTracking(applicationConfig) {
  const configForTracking = assign({}, applicationConfig);
  configForTracking.tags = applicationConfig.matchSpecification
    ? applicationConfig.matchSpecification.map(matchSpec => matchSpec.key)
    : [];
  return configForTracking;
}

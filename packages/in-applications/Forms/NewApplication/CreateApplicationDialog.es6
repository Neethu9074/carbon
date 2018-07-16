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
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import { createTracker } from 'in-services/tracking/mixpanel';
import { getTagValuesAsOptions } from 'in-applications/tags';
import Spacer from 'in-applications/Forms/components/Spacer';
import Steps from 'in-applications/Forms/components/Steps';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import { isBlank } from 'in-services/util/string';
import Select from 'in-components/form/Select';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

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
                  stepTitle:
                    'Define a Name for your Application that will be used throughout Instana to refer to this application.',
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
                  stepTitle: 'Define the application through as many tags (key/value pairs) as desired.',
                  content: (
                    <div>
                      <DescriptionText>
                        {`For example: key as "docker.label" and value as "environment=Production Blue". Regular expressions can be used for the value. When all conditions specified here match a call, it will be considered part of this application.`}
                      </DescriptionText>

                      <Spacer />

                      {form.get('matchSpecification').map((matchSpecification, i) => (
                        <div key={i} className={locals.matchSpecification}>
                          {matchSpecification.get('key').map(field => (
                            <FormGroup className={locals.matchSpecificationGroupKey}>
                              <Label htmlFor={`match-${i}-key`} hasError={!field.valid && field.touched}>
                                Key
                              </Label>
                              <Select
                                id={`match-${i}-key`}
                                value={field.value}
                                onChange={e => setValue(['matchSpecification', i, 'key'], e.target.value, form)}
                                autoComplete="off"
                                hasError={!field.valid && field.touched}
                              >
                                {getTagValuesAsOptions()}
                              </Select>
                              <TouchedMessages field={field} />
                            </FormGroup>
                          ))}

                          {matchSpecification.get('value').map(field => (
                            <FormGroup className={locals.matchSpecificationGroupValue}>
                              <Label htmlFor={`match-${i}-value`} hasError={!field.valid && field.touched}>
                                Value
                              </Label>
                              <Input
                                type="text"
                                id={`match-${i}-value`}
                                value={field.value}
                                onChange={e => setValue(['matchSpecification', i, 'value'], e.target.value, form)}
                                autoComplete="off"
                                hasError={!field.valid && field.touched}
                              />
                              <TouchedMessages field={field} />
                            </FormGroup>
                          ))}

                          {form.get('matchSpecification').size > 1 && (
                            <Tooltip content="Remove this match condition">
                              <SvgIcon
                                className={locals.removeMatchRuleIcon}
                                type="lib_openclose_cancel"
                                width={24}
                                onClick={() => removeMatchSpecification(i, form, updateForm)}
                                tabIndex={0}
                                aria-label="Remove this match condition"
                              />
                            </Tooltip>
                          )}
                        </div>
                      ))}

                      <div className={locals.addRuleButtonWrapper}>
                        <Button
                          kind="action"
                          onClick={() => addMatchSpecification(form, updateForm)}
                          icon="lib_openclose_add_circle_outline"
                        >
                          add key
                        </Button>
                      </div>
                    </div>
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

function addMatchSpecification(form, updateForm) {
  const additionalSubForm = getMatchSpecificationForm();
  updateForm(form.updateIn(['matchSpecification'], list => list.push(additionalSubForm).setTouched(true)));
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
      get(application, 'matchSpecification', [{}]).reduce(
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
        message: 'The application name must not be smaller or equal than 128 characters.'
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

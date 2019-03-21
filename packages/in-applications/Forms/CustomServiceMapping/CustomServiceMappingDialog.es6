import { createField, createMapForm, createListForm, notBlankValidator, composeValidators } from 'formalistic';
import React, { Fragment } from 'react';
import { assign, get } from 'lodash';

import {
  createNewServiceConfig,
  updateServiceConfig,
  addServiceConfig,
  getServiceConfigs
} from 'in-api/serviceConfiguration';
import BasicForm, { matchSpecificationValidator } from 'in-applications/Forms/BasicForm';
import { customServiceMappingTagKeys, getTagType } from 'in-applications/tags';
import RemoveSection from 'in-applications/Forms/CustomServiceMapping/Remove';
import { regularExpressionValidator } from 'in-services/validators/regexp';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import { servicesList } from 'in-applications/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { generateUniqueShortId } from 'in-services/util/id';
import Steps from 'in-applications/Forms/components/Steps';
import FormGroup from 'in-components/form/FormGroup';
import { isBlank } from 'in-services/util/string';
import Select from 'in-components/form/Select';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './CustomServiceMappingDialog.mless';

export default function CustomServiceMappingDialog() {
  return (
    <BasicForm
      title="Configure Custom Services"
      saveButtonLabel="Save"
      onCancelHref$={getModifiedUrlStream(p => (p.pathname = servicesList))}
      getOnSavePath={() => servicesList}
      getEntity={() =>
        getServiceConfigs().map(result => {
          if (result.data) {
            return assign({}, result, { data: result.data[0] || createNewServiceConfig() });
          }
          return result;
        })
      }
      updateEntity={serviceExtractionConfig => {
        const isNewConfig = !serviceExtractionConfig.id ? true : false;
        serviceExtractionConfig.id = serviceExtractionConfig.id || generateUniqueShortId();
        return isNewConfig ? addServiceConfig(serviceExtractionConfig) : updateServiceConfig(serviceExtractionConfig);
      }}
      getInitialForm={getInitialForm}
      renderFormContent={(serviceConfig, form, setValue, updateForm) => {
        return (
          <Fragment>
            <Steps
              steps={[
                {
                  stepTitle: 'Extend the automatic service mapping by adding a custom service rule.',
                  content: (
                    <div>
                      <DescriptionText>
                        Instana automatically maps services based on an extensive set of predefined rules. For example,
                        if the tag nodejs.app.name is found, and there are calls tagged with
                        <strong>{` "nodejs.app.name=user service" `}</strong>
                        and with
                        <strong>{` "nodejs.app.name=cart service"`}</strong>, then
                        <strong>{` "user service" `}</strong> and
                        <strong>{` "cart service" `}</strong> will appear as services.
                        <br />
                        <br />
                        Please visit the{' '}
                        <strong>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://docs.instana.io/products/application_service_management/"
                          >
                            Docs on Application and Service Management{' '}
                          </a>
                        </strong>{' '}
                        to learn more on the predefined rules. To define a custom rule start below by selecting a set of
                        tags. If all tags are present on a call, it will mapped to that service.
                      </DescriptionText>

                      <div className={locals.addRuleButtonWrapper}>
                        <Button
                          kind="action"
                          onClick={() => addMatchSpecification(form, updateForm)}
                          icon="lib_openclose_add_circle_outline"
                        >
                          Add Tag
                        </Button>
                      </div>

                      {form.get('matchSpecification').map((matchSpecification, i) => (
                        <div key={i} className={locals.matchSpecification}>
                          {matchSpecification.get('key').map(field => (
                            <FormGroup className={locals.matchSpecificationGroupKey}>
                              <Label htmlFor={`match-${i}-key`} hasError={!field.valid && field.touched}>
                                Tag
                              </Label>
                              <Select
                                id={`match-${i}-key`}
                                value={field.value}
                                onChange={e => {
                                  let updatedForm = form.updateIn(['matchSpecification', i, 'key'], field =>
                                    field.setValue(e.target.value).setTouched(true)
                                  );
                                  if (getTagType(e.target.value) === 'KEY_VALUE_PAIR') {
                                    updatedForm = updatedForm.updateIn(['matchSpecification', i], matchSpecification =>
                                      matchSpecification.put(
                                        'secondLevelName',
                                        createField({
                                          value: '',
                                          validator: notBlankValidator
                                        })
                                      )
                                    );
                                  } else {
                                    updatedForm = updatedForm.updateIn(['matchSpecification', i], matchSpecification =>
                                      matchSpecification.remove('secondLevelName')
                                    );
                                  }
                                  updateForm(updatedForm);
                                }}
                                autoComplete="off"
                                hasError={!field.valid && field.touched}
                              >
                                {getCustomServiceMappingTagValuesAsOptions()}
                              </Select>
                              <TouchedMessages field={field} />
                            </FormGroup>
                          ))}

                          {matchSpecification.get('secondLevelName') &&
                            matchSpecification.get('secondLevelName').map(field => {
                              const key = matchSpecification.get('key').value;
                              if (getTagType(key) !== 'KEY_VALUE_PAIR') {
                                return null;
                              }

                              return (
                                <FormGroup className={locals.matchSpecificationGroupValue}>
                                  <Label htmlFor={`match-${i}-key`} hasError={!field.valid && field.touched}>
                                    Key
                                  </Label>
                                  <Input
                                    type="text"
                                    id={`match-${i}-secondLevelName`}
                                    value={field.value}
                                    onChange={e =>
                                      setValue(['matchSpecification', i, 'secondLevelName'], e.target.value, form)
                                    }
                                    autoComplete="off"
                                    hasError={!field.valid && field.touched}
                                  />
                                  <TouchedMessages field={field} />
                                </FormGroup>
                              );
                            })}

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
                    </div>
                  )
                }
              ]}
            />
            {serviceConfig.id && <RemoveSection serviceConfig={serviceConfig} />}
          </Fragment>
        );
      }}
    />
  );
}

function getCustomServiceMappingTagValuesAsOptions() {
  return [{ value: '', label: 'Please select' }]
    .concat(customServiceMappingTagKeys.map(key => ({ label: key, value: key })))
    .map(tag => (
      <option key={tag.label} value={tag.value}>
        {tag.label}
      </option>
    ));
}

function addMatchSpecification(form, updateForm) {
  const additionalSubForm = getMatchSpecificationForm({});
  updateForm(form.updateIn(['matchSpecification'], list => list.push(additionalSubForm).setTouched(true)));
}

function removeMatchSpecification(i, form, updateForm) {
  updateForm(form.updateIn(['matchSpecification'], list => list.remove(i).setTouched(true)));
}

function getInitialForm(serviceConfig) {
  return createMapForm()
    .put(
      'id',
      createField({
        value: serviceConfig.id
      })
    )
    .put(
      'name',
      createField({
        value: get(serviceConfig, 'name', 'custom rule name'),
        validator: notBlankValidator
      })
    )
    .put(
      'label',
      createField({
        value: serviceConfig.label,
        validator: notBlankValidator
      })
    )
    .put(
      'matchSpecification',
      get(serviceConfig, 'matchSpecification', [{}]).reduce(
        (form, matchSpecification) => form.push(getMatchSpecificationForm(matchSpecification)),
        createListForm({
          validator: matchSpecificationValidator
        })
      )
    );
}

function getMatchSpecificationForm(matchSpecification = {}, defaultValue = '.*') {
  let form = createMapForm()
    .put(
      'key',
      createField({
        value: get(matchSpecification, 'key', ''),
        validator: notBlankValidator
      })
    )
    .put(
      'value',
      createField({
        value: get(matchSpecification, 'value', defaultValue),
        validator: composeValidators(regularExpressionValidator)
      })
    )
    .put(
      'operator',
      createField({
        value: get(matchSpecification, 'operator', 'EQUALS')
      })
    );

  if (!isBlank(get(matchSpecification, 'secondLevelName', ''))) {
    form = form.put(
      'secondLevelName',
      createField({
        value: get(matchSpecification, 'secondLevelName', ''),
        validator: notBlankValidator
      })
    );
  }

  return form;
}

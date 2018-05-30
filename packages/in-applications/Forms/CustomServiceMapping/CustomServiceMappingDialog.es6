import { createField, createMapForm, createListForm, notBlankValidator } from 'formalistic';
import React, { Fragment } from 'react';
import { assign, get } from 'lodash';

import {
  createNewServiceConfig,
  updateServiceConfig,
  addServiceConfig,
  getServiceConfigs
} from 'in-api/serviceConfiguration';
import BasicForm, { getMatchSpecificationForm, matchSpecificationValidator } from 'in-applications/Forms/BasicForm';
import RemoveSection from 'in-applications/Forms/CustomServiceMapping/Remove';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import { servicesList } from 'in-applications/navigation/paths';
import { getTagValuesAsOptions } from 'in-applications/tags';
import Spacer from 'in-applications/Forms/components/Spacer';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { generateUniqueShortId } from 'in-services/util/id';
import Steps from 'in-applications/Forms/components/Steps';
import FormGroup from 'in-components/form/FormGroup';
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
      title="Configure Services"
      generalHelpText={`Instana automatically configures services based on an extensive set of default service configuration rules.
      A single custom rule can be defined here, which will match before the default rules. Calls which are not
      tagged with all the keys specified here will be handled by the default service configuration rules. The
      resulting name of the services will depend on the value of the keys specified, in the form of
      "#{key1-value}-#{key2-value}-#{keyN-value}"`}
      saveButtonLabel="Save"
      onCancelHref$={getModifiedUrlStream(p => (p.pathname = servicesList))}
      onSavePath={servicesList}
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
                  stepTitle:
                    'Define a set of custom keys that will be used instead of the Instana default rules to tag calls.',
                  content: (
                    <div>
                      <DescriptionText>
                        For example, the key nodejs.app.name is selected, and there are two calls, one tagged with
                        <strong>{` "nodejs.app.name=user service"`}</strong> and one tagged with
                        <strong>{` "nodejs.app.name=cart service"`}</strong>, then
                        <strong>{` "user service" `}</strong>
                        and<strong>{` "cart service"`}</strong> will appear as services.
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

                          {matchSpecification.get('value').map(field => {
                            const key = matchSpecification.get('key').value;
                            if (key !== 'docker.label' && key !== 'kubernetes.pod.label' && key !== 'host.tag') {
                              return null;
                            }

                            return (
                              <FormGroup className={locals.matchSpecificationGroupValue}>
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
            {serviceConfig.id && <RemoveSection serviceConfig={serviceConfig} />}
          </Fragment>
        );
      }}
    />
  );
}

function addMatchSpecification(form, updateForm) {
  const additionalSubForm = getMatchSpecificationForm({}, 'a=b');
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

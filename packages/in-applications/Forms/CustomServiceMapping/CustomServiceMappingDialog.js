/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { composeValidators, createField, createListForm, createMapForm, notBlankValidator } from 'formalistic';
import React, { Fragment } from 'react';
import { assign, get } from 'lodash';

import { createNewServiceConfigs, getServiceConfigs, replaceAllServiceConfigs } from 'in-api/serviceConfiguration';
import DragAndDropRuleList from 'in-applications/Forms/CustomServiceMapping/DragAndDropRuleList';
import { regularExpressionValidator } from 'in-services/validators/regexp';
import DescriptionText from 'in-components/form/DescriptionText';
import { servicesList } from 'in-applications/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { generateUniqueShortId } from 'in-services/util/id';
import Steps from 'in-applications/Forms/components/Steps';
import BasicForm from 'in-applications/Forms/BasicForm';
import { isBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import { Trans, t } from 'in-i18n';

import locals from './CustomServiceMappingDialog.mless';

export default function CustomServiceMappingDialog() {
  return (
    <BasicForm
      title={t('in-applications:titleConfigureCustomServiceRules')}
      saveButtonLabel={t('in-applications:buttonSave')}
      onCancelHref$={getModifiedUrlStream(p => (p.pathname = servicesList))}
      getOnSavePath={() => servicesList}
      getEntity={() =>
        getServiceConfigs().map(result => {
          if (result.data) {
            return assign({}, result, { data: result.data || createNewServiceConfigs() });
          }
          return result;
        })
      }
      updateEntity={serviceConfigs => {
        serviceConfigs.map(
          serviceConfig => (serviceConfig.id = serviceConfig.id === [] ? serviceConfig.id : generateUniqueShortId())
        );
        return replaceAllServiceConfigs(serviceConfigs);
      }}
      getInitialForm={getInitialForm}
      renderFormContent={(serviceConfigs, form, setValue, updateForm) => {
        return (
          <Fragment>
            <Steps
              steps={[
                {
                  stepTitle: t('in-applications:forms.customService.stepTitle'),
                  content: (
                    <div>
                      <DescriptionText>
                        <Trans
                          i18nKey="in-applications:forms.customService.descriptionTextFirstLine"
                          components={{ bold: <strong /> }}
                        />
                        <br />
                        <br />
                        <Trans
                          i18nKey="in-applications:forms.customService.descriptionVisit"
                          components={{
                            bold: <strong />,
                            linkToDoc: (
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://instana.com/docs/application_monitoring/services/"
                              />
                            )
                          }}
                        />
                      </DescriptionText>

                      <DragAndDropRuleList
                        form={form}
                        onSave={_serviceConfigs => updateForm(_serviceConfigs)}
                        onRemove={i => updateForm(form.remove(i))}
                        switchIndices={(sourceIndex, destinationIndex) =>
                          updateForm(form.remove(sourceIndex).insert(destinationIndex, form.get(sourceIndex)))
                        }
                        addMatchSpecification={addMatchSpecification}
                        removeMatchSpecification={removeMatchSpecification}
                        updateForm={updateForm}
                        setValue={setValue}
                      />
                      <div className={locals.addRuleButtonWrapper}>
                        <Button
                          kind="action"
                          onClick={() => updateForm(form.push(getServiceConfigForm(serviceConfigs)))}
                          icon="lib_openclose_add_circle_outline"
                        >
                          {t('in-applications:buttonAddCustomServiceRule')}
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

function getInitialForm(serviceConfigs) {
  return serviceConfigs.reduce(
    (form, serviceConfig) => form.push(getServiceConfigForm(serviceConfig)),
    createListForm({})
  );
}

export function getServiceConfigForm(serviceConfig = {}) {
  return createMapForm()
    .put('id', createField({ value: get(serviceConfig, 'id', []) }))
    .put('name', createField({ value: get(serviceConfig, 'name', 'Rule') }))
    .put('enabled', createField({ value: get(serviceConfig, 'enabled', true) }))
    .put(
      'matchSpecification',
      get(serviceConfig, 'matchSpecification', [{}]).reduce(
        (form, matchSpecification) => form.push(getMatchSpecificationForm(matchSpecification)),
        createListForm({})
      )
    );
}

function addMatchSpecification(form, serviceConfigIndex, updateForm) {
  const updatedForm = form.updateIn([serviceConfigIndex, 'matchSpecification'], list =>
    list.push(getMatchSpecificationForm({})).setTouched(true)
  );
  updateForm(updatedForm);
  return updatedForm;
}

function removeMatchSpecification(i, form, serviceConfigIndex, updateForm) {
  const updatedForm = form.updateIn([serviceConfigIndex, 'matchSpecification'], list =>
    list.remove(i).setTouched(true)
  );
  updateForm(updatedForm);
  return updatedForm;
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

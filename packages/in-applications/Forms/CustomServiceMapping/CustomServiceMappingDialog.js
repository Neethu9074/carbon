/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { composeValidators, createField, createListForm, createMapForm } from 'formalistic';
import React, { Fragment, useEffect, useState } from 'react';
import { assign, get } from 'lodash';

import { combineLatest, create } from '@instana/observables';
import { generateUniqueShortId } from '@instana/utils';
import { Link, Button } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { createNewServiceConfigs, getServiceConfigs, replaceAllServiceConfigs } from 'in-api/serviceConfiguration';
import DragAndDropRuleList from 'in-applications/Forms/CustomServiceMapping/DragAndDropRuleList';
import { regularExpressionValidator } from 'in-services/validators/regexp';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { emptyArray, pendingResult } from 'in-services/fixedObjects';
import { notBlankValidator } from 'in-services/validators/string';
import DescriptionText from 'in-components/form/DescriptionText';
import { servicesList } from 'in-applications/navigation/paths';
import { hasError, isLoading } from 'in-services/util/result';
import Steps from 'in-applications/Forms/components/Steps';
import BasicForm from 'in-applications/Forms/BasicForm';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { isBlank } from 'in-services/util/string';
import { Trans, t } from 'in-i18n';

import locals from './CustomServiceMappingDialog.mless';

const getServiceMappingTagCatalog = getApplicationTagCatalog({ useCase: 'SERVICE_MAPPING' });

export default function CustomServiceMappingDialog() {
  const { createHrefToPath } = useNavigation();
  const timeConfig = useTimeConfig();
  const tagCatalogResult = useObservable(getServiceMappingTagCatalog, [timeConfig]);
  const [tagCatalogResult$] = useState(create);
  useEffect(() => {
    tagCatalogResult$.emit(tagCatalogResult);
  }, [tagCatalogResult, tagCatalogResult$]);

  return (
    <BasicForm
      title={t('in-applications:titleConfigureCustomServiceRules')}
      saveButtonLabel={t('in-applications:buttonSave')}
      onCancelHref={createHrefToPath(servicesList)}
      getOnSavePath={() => servicesList}
      getEntity={getServiceMappingConfig(tagCatalogResult$)}
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
                            linkToDoc: <Link external href="https://ibm.biz/applications-services" />
                          }}
                        />
                      </DescriptionText>

                      <div className={locals.addRuleButtonWrapper}>
                        <Button
                          kind="action"
                          onClick={() => updateForm(form.push(getServiceConfigForm(serviceConfigs)))}
                          icon="lib_openclose_add_circle_outline"
                        >
                          {t('in-applications:buttonAddCustomServiceRule')}
                        </Button>
                      </div>

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
                        serviceMappingTagCatalog={tagCatalogResult?.data}
                      />
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

function getServiceMappingConfig(catalogResult$) {
  return () =>
    combineLatest([getServiceConfigs(), catalogResult$], true).map(result => {
      const [serviceConfigResult, tagCatalogResult] = result;
      if (isLoading(serviceConfigResult, tagCatalogResult)) {
        return pendingResult;
      }
      if (hasError(serviceConfigResult)) {
        return serviceConfigResult;
      }
      if (hasError(tagCatalogResult)) {
        return tagCatalogResult;
      }
      resolveTagAliases(tagCatalogResult, serviceConfigResult);
      if (serviceConfigResult.data) {
        return assign({}, serviceConfigResult, { data: serviceConfigResult.data || createNewServiceConfigs() });
      }
      return serviceConfigResult;
    });
}

function resolveTagAliases(tagCatalogResult, serviceConfigResult) {
  const tagByAlias = tagCatalogResult.data.tags.reduce((map, tag) => {
    (tag.aliases ?? emptyArray).forEach(alias => (map[alias] = tag.name));
    return map;
  }, {});

  serviceConfigResult.data.forEach(rule => {
    rule.matchSpecification.forEach(matchSpec => {
      matchSpec.key = tagByAlias[matchSpec.key] ?? matchSpec.key;
    });
  });
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

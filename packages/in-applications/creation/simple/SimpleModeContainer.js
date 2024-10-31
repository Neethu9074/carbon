/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';

import {
  findByRestrictingApplicationId,
  limitWithContributionFilter
} from 'in-applications/creation/contributionFilters';
import SimpleModePageNavigation from 'in-components/BlueprintFormMultistep/SimpleModePageNavigation';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getApplicationLiveView from 'in-applications/subscriptions/getApplicationLiveView';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import SimpleCreateStep1 from 'in-applications/creation/simple/SimpleCreateStep1';
import SimpleCreateStep2 from 'in-applications/creation/simple/SimpleCreateStep2';
import SimpleCreateStep3 from 'in-applications/creation/simple/SimpleCreateStep3';
import { blueprintConfig } from 'in-applications/creation/data/blueprintConfig';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { successObservable } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { CALLS } from 'in-applications/analyze/metrics';
import { t } from 'in-i18n';

import locals from './SimpleModeContainer.mless';

const stepConfigs = [
  {
    title: t('in-applications:creation.simple.step1Title')
  },
  {
    title: t('in-applications:creation.simple.step2Title'),
    validateIntermediately: [['tagFilterExpression']]
  },
  {
    title: t('in-applications:creation.simple.step3Title')
  }
];

export default function SimpleModeContainer({
  onClose,
  setSimpleModeStep,
  simpleModeStep,
  timeConfig,
  form,
  updateForm,
  onCreate,
  isValidTagFilterExpression,
  errorMessage,
  isSaving,
  userRestrictedApplicationsResult
}) {
  const [selectedBlueprint, setSelectedBlueprint] = useState(blueprintConfig[0]);
  const { trackApplicationCreationStepSwitched } = useApplicationTracker();

  const downstreamScope = form.get('scope').value;
  const tagFilterExpression = form.get('tagFilterExpression').value;
  const restrictingApplicationId = form.get('restrictingApplicationId').value;
  const contributionFilter =
    restrictingApplicationId == null
      ? null
      : findByRestrictingApplicationId(userRestrictedApplicationsResult.data, restrictingApplicationId)?.filter
          ?.tagFilterExpression;

  const servicesLiveList = useObservable(getServicesLiveList, [
    downstreamScope,
    tagFilterExpression,
    contributionFilter,
    isValidTagFilterExpression
  ]);

  const handleChangeBluePrint = blueprint => {
    const applicationScope = blueprint.presetFormFields?.applicationScope;
    const boundaryScope = blueprint.presetFormFields?.boundaryScope;
    let updatedForm = form;
    if (applicationScope) {
      updatedForm = form.updateIn(['scope'], field => field.setValue(applicationScope).setTouched(true));
    }
    if (boundaryScope) {
      updatedForm = form.updateIn(['boundaryScope'], field => field.setValue(boundaryScope).setTouched(true));
    }
    updateForm(updatedForm);
    setSelectedBlueprint(blueprint);
  };

  const blueprintCatalogResult =
    useObservable(
      getApplicationTagCatalog({
        dataSource: CALLS,
        useCase: 'APPLICATION_CONFIG_BLUEPRINT'
      })({
        timeConfig
      }),
      [timeConfig]
    ) ?? pendingResult;

  return (
    <div className={locals.container}>
      <SimpleModePageNavigation
        form={form}
        formId="create-application"
        updateForm={updateForm}
        onClose={onClose}
        setSimpleModeStep={setSimpleModeStep}
        simpleModeStep={simpleModeStep}
        stepConfigs={stepConfigs}
        onCreate={onCreate}
        isSaving={isSaving}
        onStepChanged={(oldStep, nextStep) => trackApplicationCreationStepSwitched({ oldStep, nextStep })}
        renderStep={step => {
          switch (step) {
            case 0:
              return (
                <SimpleCreateStep1
                  selectedBlueprint={selectedBlueprint}
                  setSelectedBlueprint={selectedBlueprint => {
                    updateForm(form.updateIn(['tagFilterExpression'], field => field.setValue([])));
                    handleChangeBluePrint(selectedBlueprint);
                  }}
                />
              );
            case 1:
              return (
                <SimpleCreateStep2
                  selectedBlueprint={selectedBlueprint}
                  timeConfig={timeConfig}
                  form={form}
                  updateForm={updateForm}
                  servicesLiveList={servicesLiveList}
                  blueprintCatalogResult={blueprintCatalogResult}
                  isValidTagFilterExpression={isValidTagFilterExpression}
                  userRestrictedApplicationsResult={userRestrictedApplicationsResult}
                />
              );
            case 2:
              return (
                <SimpleCreateStep3
                  selectedBlueprint={selectedBlueprint}
                  form={form}
                  updateForm={updateForm}
                  servicesLiveList={servicesLiveList}
                  errorMessage={errorMessage}
                  isValidTagFilterExpression={isValidTagFilterExpression}
                />
              );
          }
        }}
        additionalStepCheck={step => {
          if (step !== 0) {
            return isValidTagFilterExpression;
          }
          return true;
        }}
      />
    </div>
  );
}

function getServicesLiveList([downstreamScope, tagFilterExpression, contributionFilter, isValidTagFilterExpression]) {
  if (!isValidTagFilterExpression || (contributionFilter == null && tagFilterExpression.length === 0)) {
    return successObservable([]);
  }
  return getApplicationLiveView({
    // The live view is based on historic data from last hour
    timeConfig: { to: null, windowSize: 3600000, focusedMoment: null, autoRefresh: false },
    pagination: { page: 1, pageSize: 100 },
    downstreamScope,
    tagFilterExpression: limitWithContributionFilter(toBackendQueryModel(tagFilterExpression), contributionFilter)
  });
}

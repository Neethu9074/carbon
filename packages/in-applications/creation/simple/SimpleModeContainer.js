/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';

import SimpleModePageNavigation from 'in-new-components/BlueprintFormMultistep/SimpleModePageNavigation';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import getApplicationLiveView from 'in-subscription/application/getApplicationLiveView';
import { isQB2ModeEnabled } from 'in-new-components/Alerting/components/WithQB1orQB2';
import SimpleCreateStep1 from 'in-applications/creation/simple/SimpleCreateStep1';
import SimpleCreateStep2 from 'in-applications/creation/simple/SimpleCreateStep2';
import SimpleCreateStep3 from 'in-applications/creation/simple/SimpleCreateStep3';
import { applicationCreationStepSwitch } from 'in-applications/creation/tracker';
import { blueprintConfig } from 'in-applications/creation/data/blueprintConfig';
import { mapMatchSpecificationListToTree } from 'in-api/applicationConfigs';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { qb2InAPCreationEnabled } from 'in-services/featureFlags';
import { successObservable } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { CALLS } from 'in-applications/analyze/metrics';
import useObservable from 'in-hooks/useObservable';

const stepConfigs = [
  {
    title: 'Step 1: Select Model'
  },
  {
    title: 'Step 2: Specify Application',
    validateIntermediately: [
      [isQB2ModeEnabled && qb2InAPCreationEnabled ? 'tagFilterExpression' : 'matchSpecification']
    ]
  },
  {
    title: 'Step 3: Provide Details'
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
  isValidTagFilterExpression
}) {
  const [selectedBlueprint, setSelectedBlueprint] = useState(blueprintConfig[0]);
  const servicesLiveList = useObservable(getStreamData, [form, isValidTagFilterExpression]);

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
    <SimpleModePageNavigation
      form={form}
      updateForm={updateForm}
      onClose={onClose}
      setSimpleModeStep={setSimpleModeStep}
      simpleModeStep={simpleModeStep}
      stepConfigs={stepConfigs}
      onCreate={onCreate}
      onStepChanged={(oldStep, nextStep) => applicationCreationStepSwitch({ oldStep, nextStep })}
      renderStep={step => {
        switch (step) {
          case 0:
            return (
              <SimpleCreateStep1
                selectedBlueprint={selectedBlueprint}
                setSelectedBlueprint={selectedBlueprint => {
                  updateForm(form.updateIn(['tagFilterExpression'], field => field.setValue([])));
                  setSelectedBlueprint(selectedBlueprint);
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
              />
            );
          case 2:
            return (
              <SimpleCreateStep3
                selectedBlueprint={selectedBlueprint}
                form={form}
                updateForm={updateForm}
                servicesLiveList={servicesLiveList}
              />
            );
        }
      }}
      additionalStepCheck={step => {
        if (step !== 0 && isQB2ModeEnabled && qb2InAPCreationEnabled) {
          return isValidTagFilterExpression;
        }
        return true;
      }}
    />
  );
}

function getStreamData([form, isValidTagFilterExpression]) {
  const jsForm = form.toJS();
  const downstreamScope = jsForm.scope;
  const matchSpecification = jsForm.matchSpecification;
  const matchSpecificationTree = mapMatchSpecificationListToTree(matchSpecification);
  const tagFilterExpression = jsForm.tagFilterExpression;

  if (
    isQB2ModeEnabled && qb2InAPCreationEnabled
      ? !isValidTagFilterExpression || tagFilterExpression.length === 0
      : !matchSpecificationTree
  ) {
    return successObservable([]);
  }

  return getApplicationLiveView({
    // The live view is based on historic data from last hour
    timeConfig: { to: null, windowSize: 3600000, focusedMoment: null, autoRefresh: false },
    pagination: { page: 1, pageSize: 100 },
    matchExpression: !isQB2ModeEnabled || !qb2InAPCreationEnabled ? matchSpecificationTree : undefined,
    downstreamScope,
    tagFilterExpression:
      isQB2ModeEnabled && qb2InAPCreationEnabled ? toBackendQueryModel(tagFilterExpression) : undefined
  });
}

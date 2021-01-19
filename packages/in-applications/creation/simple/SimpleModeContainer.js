/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';

import SimpleModePageNavigation from 'in-new-components/BlueprintFormMultistep/SimpleModePageNavigation';
import getApplicationLiveView from 'in-subscription/application/getApplicationLiveView';
import SimpleCreateStep1 from 'in-applications/creation/simple/SimpleCreateStep1';
import SimpleCreateStep2 from 'in-applications/creation/simple/SimpleCreateStep2';
import SimpleCreateStep3 from 'in-applications/creation/simple/SimpleCreateStep3';
import { applicationCreationStepSwitch } from 'in-applications/creation/tracker';
import { blueprintConfig } from 'in-applications/creation/data/blueprintConfig';
import { mapMatchSpecificationListToTree } from 'in-api/applicationConfigs';
import { successObservable } from 'in-services/util/result';
import useObservable from 'in-hooks/useObservable';

const stepConfigs = [
  {
    title: 'Step 1: Select Model'
  },
  {
    title: 'Step 2: Specify Application',
    validateIntermediately: [['matchSpecification']]
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
  onCreate
}) {
  const [selectedBlueprint, setSelectedBlueprint] = useState(blueprintConfig[0]);

  const matchSpecification = form.toJS().matchSpecification;
  const servicesLiveList = useObservable(getStreamData, [form]);

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
              <SimpleCreateStep1 selectedBlueprint={selectedBlueprint} setSelectedBlueprint={setSelectedBlueprint} />
            );
          case 1:
            return (
              <SimpleCreateStep2
                selectedBlueprint={selectedBlueprint}
                timeConfig={timeConfig}
                form={form}
                updateForm={updateForm}
                servicesLiveList={servicesLiveList}
                matchSpecification={matchSpecification}
              />
            );
          case 2:
            return (
              <SimpleCreateStep3
                selectedBlueprint={selectedBlueprint}
                form={form}
                updateForm={updateForm}
                servicesLiveList={servicesLiveList}
                matchSpecification={matchSpecification}
              />
            );
        }
      }}
    />
  );
}

function getStreamData([form]) {
  const jsForm = form.toJS();
  const downstreamScope = jsForm.scope;
  const matchSpecification = jsForm.matchSpecification;
  const matchSpecificationTree = mapMatchSpecificationListToTree(matchSpecification);

  if (!matchSpecificationTree) {
    return successObservable([]);
  }

  return getApplicationLiveView({
    // The live view is based on historic data from last hour
    timeConfig: { to: null, windowSize: 3600000, focusedMoment: null, autoRefresh: false },
    pagination: { page: 1, pageSize: 100 },
    matchExpression: matchSpecificationTree,
    downstreamScope
  });
}

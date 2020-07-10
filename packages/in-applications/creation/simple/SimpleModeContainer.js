import React, { useState } from 'react';

import SimpleModePageNavigation from 'in-new-components/BlueprintFormMultistep/SimpleModePageNavigation';
import SimpleCreateStep1 from 'in-applications/creation/simple/SimpleCreateStep1';
import SimpleCreateStep2 from 'in-applications/creation/simple/SimpleCreateStep2';
import SimpleCreateStep3 from 'in-applications/creation/simple/SimpleCreateStep3';
import { applicationCreationStepSwitch } from 'in-applications/creation/tracker';
import { blueprintConfig } from 'in-applications/creation/data/blueprintConfig';
import { mapMatchSpecificationListToTree } from 'in-api/applicationConfigs';
import getServices from 'in-subscription/application/getServices';
import useObservable from 'in-hooks/useObservable';

const stepConfigs = [
  {
    title: 'Step 1: Define Application'
  },
  {
    title: 'Step 2: Build your Application'
  },
  {
    title: 'Step 3: Configuration Options'
  }
];

export default function SimpleModeContainer({ onClose, setSimpleModeStep, timeConfig, form, updateForm, onCreate }) {
  const [selectedBlueprint, setSelectedBlueprint] = useState(blueprintConfig[0]);

  const jsForm = form.toJS();
  const matchSpecification = jsForm.matchSpecification;
  const matchSpecificationTree = mapMatchSpecificationListToTree(matchSpecification);

  // Timeconfig is set here because we always want to see the last 24 hours.
  const liveTimeConfig = { to: null, windowSize: 86400000, focusedMoment: null, autoRefresh: false };
  const servicesLiveList = useObservable(getStreamData({ timeConfig: liveTimeConfig, matchSpecificationTree }), [
    matchSpecificationTree
  ]);

  return (
    <SimpleModePageNavigation
      form={form}
      updateForm={updateForm}
      onClose={onClose}
      setSimpleModeStep={setSimpleModeStep}
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

function getStreamData({
  page = 1,
  pageSize = 100,
  orderBy = 'callsAgg',
  orderDirection = 'DESC',
  boundaryScope,
  timeConfig,
  matchSpecificationTree
}) {
  return getServices({
    pagination: { page, pageSize },
    order: { by: orderBy, direction: orderDirection },
    metrics: {
      callsAgg: { metric: 'calls', aggregation: 'SUM' }
    },
    filter: {
      applicationBoundaryScope: boundaryScope,
      timeConfig
    },
    matchExpression: matchSpecificationTree
  });
}

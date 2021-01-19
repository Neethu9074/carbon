/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import CreateApplicationFilters from 'in-applications/creation/components/CreateApplicationFilters';
import ApplicationScopeSelector from 'in-applications/creation/components/ApplicationScopeSelector';
import ServiceLiveList from 'in-applications/creation/components/ServiceLiveList';
import Spacer from 'in-applications/Forms/components/Spacer';
import Label from 'in-components/form/Label';

import locals from './SimpleCreateStep2.mless';

export default function SimpleCreateStep2({
  selectedBlueprint,
  timeConfig,
  form,
  updateForm,
  servicesLiveList,
  matchSpecification
}) {
  return (
    <SimpleModeStepContentWrapper headline="Specify your Application Perspective">
      <div className={locals.filterWrapper}>
        <CreateApplicationFilters
          form={form}
          curatedTagFilters={selectedBlueprint.curatedTagFilters}
          timeConfig={timeConfig}
          updateForm={updateForm}
          selectedBlueprint={selectedBlueprint}
        />
        <Spacer type="dark" />
        <Label>Which downstream services would you like to include?</Label>
        <ApplicationScopeSelector form={form} updateForm={updateForm} selectedBlueprint={selectedBlueprint} />
      </div>
      <ServiceLiveList
        servicesLiveList={servicesLiveList}
        headerText="Matched services in the last hour"
        matchSpecification={matchSpecification}
      />
    </SimpleModeStepContentWrapper>
  );
}

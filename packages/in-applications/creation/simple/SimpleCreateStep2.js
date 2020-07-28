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
    <SimpleModeStepContentWrapper headline="Build your Application Perspective">
      <div className={locals.filterWrapper}>
        <Label>Define the Application Perspective using one or more tags.</Label>
        <CreateApplicationFilters
          form={form}
          curatedTagFilters={selectedBlueprint.curatedTagFilters}
          timeConfig={timeConfig}
          updateForm={updateForm}
          selectedBlueprint={selectedBlueprint}
        />
        <Spacer type="dark" />
        <Label>Choose which downstream services to include in the Application Perspective.</Label>
        <ApplicationScopeSelector form={form} updateForm={updateForm} />
      </div>
      <ServiceLiveList
        servicesLiveList={servicesLiveList}
        headerText="Services in this Application Perspective..."
        descriptionText="Based on the last 24 hours."
        matchSpecification={matchSpecification}
      />
    </SimpleModeStepContentWrapper>
  );
}

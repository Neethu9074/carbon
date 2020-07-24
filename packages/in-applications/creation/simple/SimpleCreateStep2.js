import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import CreateApplicationFilters from 'in-applications/creation/components/CreateApplicationFilters';
import ServiceLiveList from 'in-applications/creation/components/ServiceLiveList';

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
        <CreateApplicationFilters
          form={form}
          curatedTagFilters={selectedBlueprint.curatedTagFilters}
          timeConfig={timeConfig}
          updateForm={updateForm}
          selectedBlueprint={selectedBlueprint}
        />
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

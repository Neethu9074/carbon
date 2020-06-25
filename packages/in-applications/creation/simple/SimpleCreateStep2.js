import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import CreateApplicationFilters from 'in-applications/creation/components/CreateApplicationFilters';

import locals from './SimpleCreateStep2.mless';

export default function SimpleCreateStep2({ selectedBlueprint, timeConfig, form, updateForm }) {
  return (
    <SimpleModeStepContentWrapper headline="Build your Application Perspective">
      <div className={locals.filterWrapper}>
        <CreateApplicationFilters
          form={form}
          curatedTagFilters={selectedBlueprint.curatedTagFilters}
          timeConfig={timeConfig}
          updateForm={updateForm}
        />
      </div>
    </SimpleModeStepContentWrapper>
  );
}
